import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import {
  createChatSystemPrompt,
  getDeterministicChatResponse,
  type ChatLocale,
} from '@/lib/chat-context';

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// Short rolling-window protection per visitor. This is anti-abuse throttling,
// not a conversation/session quota: visitors can continue after the window.
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimit) {
    if (now > value.resetTime) rateLimit.delete(key);
  }
}, 10 * 60 * 1000);

function isValidSessionId(sid: unknown): sid is string {
  return typeof sid === "string" && sid.length > 0 && sid.length <= 64 && /^[a-zA-Z0-9_-]+$/.test(sid);
}

function sanitizeMessage(msg: unknown): string | null {
  if (typeof msg !== "string") return null;
  // Strip control characters except newlines, trim, enforce max length
  const cleaned = msg.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  if (cleaned.length === 0 || cleaned.length > 1000) return null;
  return cleaned;
}

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(sessionId);

  if (!limit || now > limit.resetTime) {
    rateLimit.set(sessionId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX) return false;

  limit.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, sessionId, locale } = body ?? {};

    const preferredLocale: ChatLocale | undefined = locale === "es" || locale === "en"
      ? locale
      : undefined;
    if (locale !== undefined && !preferredLocale) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 },
      );
    }

    // Validate session ID format
    const sid = isValidSessionId(sessionId) ? sessionId : null;
    if (!sid) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate each message
    const sanitizedMessages: Array<{ role: "user" | "assistant"; content: string }> = [];
    for (const msg of messages.slice(-4)) {
      if (!msg || typeof msg !== "object") continue;
      if (msg.role !== "user" && msg.role !== "assistant") continue;
      const content = sanitizeMessage(msg.content);
      if (!content) continue;
      sanitizedMessages.push({ role: msg.role, content });
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages provided' },
        { status: 400 }
      );
    }

    const recentMessages = sanitizedMessages.slice(-4);
    const latestQuestion = [...recentMessages]
      .reverse()
      .find((message) => message.role === "user")?.content;

    if (!latestQuestion) {
      return NextResponse.json(
        { error: 'A user message is required' },
        { status: 400 }
      );
    }

    const deterministicResponse = getDeterministicChatResponse(
      latestQuestion,
      preferredLocale,
      recentMessages,
    );
    if (deterministicResponse) {
      return new Response(deterministicResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // Rate limiting
    if (!checkRateLimit(sid)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 503 }
      );
    }

    // Create streaming completion
    const groq = getGroqClient();
    const stream = await groq.chat.completions.create({
      model: 'groq/compound-mini',
      messages: [
        { role: 'system', content: createChatSystemPrompt(latestQuestion, preferredLocale) },
        ...recentMessages,
      ],
      stream: true,
      temperature: 0.1,
      max_tokens: 120,
    });

    // Return streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch {
          controller.error(new Error("Stream failed"));
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

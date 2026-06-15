import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function createMockRequest(body: unknown, init?: RequestInit): NextRequest {
  const { signal, ...restInit } = init ?? {};
  const request = new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...restInit,
    ...(signal ? { signal } : {}),
  });

  return request;
}

export function createMockResponse(): NextResponse {
  return new NextResponse();
}
"use strict";

import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Contact Form Validation", () => {
  const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please provide a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  });

  it("should validate valid form data", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, this is a test message.",
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid name", () => {
    const invalidData = {
      name: "J",
      email: "john@example.com",
      message: "Hello, this is a test message.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
    }
  });

  it("should reject invalid email", () => {
    const invalidData = {
      name: "John Doe",
      email: "invalid-email",
      message: "Hello, this is a test message.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Please provide a valid email address");
    }
  });

  it("should reject short message", () => {
    const invalidData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Short",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Message must be at least 10 characters");
    }
  });
});
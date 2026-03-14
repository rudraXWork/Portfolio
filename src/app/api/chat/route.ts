import { NextRequest, NextResponse } from "next/server";
import { createConversationalRAGChain } from "@/lib/langchain";

export const runtime = "nodejs";

function getRetrySeconds(error: unknown): number | null {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: string }).message ?? "")
      : "";

  const retryInMatch = message.match(/retry in\s+([\d.]+)s/i);
  if (retryInMatch?.[1]) {
    return Math.ceil(Number(retryInMatch[1]));
  }

  const retryDelayMatch = message.match(/"retryDelay":"(\d+)s"/i);
  if (retryDelayMatch?.[1]) {
    return Number(retryDelayMatch[1]);
  }

  return null;
}

function isQuotaExceededError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const err = error as { status?: number; message?: string; statusText?: string };
  const lowerMessage = (err.message ?? "").toLowerCase();
  const lowerStatusText = (err.statusText ?? "").toLowerCase();

  return (
    err.status === 429 ||
    lowerStatusText.includes("too many requests") ||
    lowerMessage.includes("quota") ||
    lowerMessage.includes("rate limit") ||
    lowerMessage.includes("too many requests")
  );
}

export async function POST(request: NextRequest) {
  try {
    const { message, messages } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_input",
          message: "Message is required and must be a string",
        },
        { status: 400 }
      );
    }

    // Format previous messages as conversation history string
    // This is simple formatting; you can adjust based on message structure
    const history = messages
      ? messages
          .filter((msg: any) => msg.text !== message) // Exclude current message if present
          .map((msg: any) => `${msg.sender === "user" ? "Human" : "AI"}: ${msg.text}`)
          .join("\n")
      : "";

    // Create Conversational RAG chain
    const ragChain = await createConversationalRAGChain();

    // Get response from the chain
    // The chain expects an object with 'question' and 'conv_history'
    const response = await ragChain.invoke({
      question: message,
      conv_history: history,
    });

    return NextResponse.json({
      success: true,
      message: response,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    if (isQuotaExceededError(error)) {
      const retrySeconds = getRetrySeconds(error);
      const retryHint = retrySeconds
        ? ` Please retry in about ${retrySeconds} seconds.`
        : " Please try again shortly.";

      return NextResponse.json(
        {
          success: false,
          error: "quota_exceeded",
          message:
            "Rublix is temporarily rate-limited due to API quota limits." +
            retryHint,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "internal_error",
        message: "Failed to process chat message. Please try again.",
      },
      { status: 500 }
    );
  }
}

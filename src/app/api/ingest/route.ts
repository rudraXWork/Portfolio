import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs";
import path from "path";

function getEnvFromList(names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }

  throw new Error(`Missing required environment variable. Tried: ${names.join(", ")}`);
}

// Function to handle the ingestion process
export async function POST() {
  try {
    // Read the document.txt file from the public directory
    const filePath = path.join(process.cwd(), "public", "document.txt");
    const text = fs.readFileSync(filePath, "utf-8");

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", " ", ""],
    });

    const docs = await splitter.createDocuments([text]);

    // Environment variables
    const sbApiKey = getEnvFromList(["SUPABASE_API_KEY", "SUPABASE_SERVICE_ROLE_KEY"]);
    const sbUrl = getEnvFromList(["SUPABASE_URL_LC_CHATBOT", "NEXT_PUBLIC_SUPABASE_URL"]);
    const geminiApiKey = getEnvFromList(["GOOGLE_API_KEY"]);

    // Supabase client
    const client = createClient(sbUrl, sbApiKey);

    // Store embeddings in Supabase
    await SupabaseVectorStore.fromDocuments(
      docs,
      new GoogleGenerativeAIEmbeddings({
        apiKey: geminiApiKey,
        model: "gemini-embedding-001",
      }),
      {
        client,
        tableName: "documents",
        queryName: "search_documents",
      }
    );

    return NextResponse.json({ success: true, message: "Documents ingested successfully" });
  } catch (err: unknown) {
    console.error("Ingestion error:", err);
    const message =
      typeof err === "object" && err !== null && "message" in err
        ? String((err as { message?: string }).message ?? "Unknown error")
        : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

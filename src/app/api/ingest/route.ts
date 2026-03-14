import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs";
import path from "path";

// Function to handle the ingestion process
export async function POST(req: NextRequest) {
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
    const sbApiKey = process.env.SUPABASE_API_KEY!;
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT!;
    const geminiApiKey = process.env.GOOGLE_API_KEY!;

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
  } catch (err: any) {
    console.error("Ingestion error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (for API routes)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Store vector embeddings in Supabase
 */
export async function storeEmbedding(
  content: string,
  embedding: number[],
  metadata: Record<string, any> = {}
) {
  try {
    const { data, error } = await supabaseServer
      .from("documents")
      .insert([
        {
          content,
          embedding,
          metadata,
          created_at: new Date(),
        },
      ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error storing embedding:", error);
    throw error;
  }
}

/**
 * Search similar documents using vector similarity
 */
export async function searchSimilarDocuments(
  embedding: number[],
  limit: number = 5
) {
  try {
    const { data, error } = await supabaseServer.rpc(
      "search_documents",
      {
        query_embedding: embedding,
        match_count: limit,
      }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw error;
  }
}

/**
 * Get all documents
 */
export async function getAllDocuments() {
  try {
    const { data, error } = await supabaseServer
      .from("documents")
      .select("id, content, metadata, created_at");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

type ConversationalInput = {
  question: string;
  conv_history?: string;
};

// Initialize Supabase client for LangChain
const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT!;
const sbApiKey = process.env.SUPABASE_API_KEY!;
const supabaseClient = createClient(sbUrl, sbApiKey);

// Embeddings model
export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

// Chat model
export const chatModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  maxTokens: 512,
  temperature: 0.5,
});

/**
 * Get vector store retriever
 */
export async function getRetriever(k: number = 4) {
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    embeddings,
    {
      client: supabaseClient,
      tableName: "documents",
      queryName: "search_documents",
    }
  );

  return vectorStore.asRetriever({
    k,
    searchType: "similarity",
  });
}

/**
 * Create RAG chain for answering questions with history awareness
 */
export async function createConversationalRAGChain() {
  const retriever = await getRetriever();

  // Prompt to answer the question based on context and history
  const answerPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful and enthusiastic support bot for Rudra N Jena's portfolio.
Use the provided context and conversation history to answer questions about Rudra.

Portfolio Information (Context):
{context}

If the answer is not in the context, check if it's in the conversation history.
If you don't know the answer, say: "I'm sorry, I don't have that information about Rudra." and do not make up facts.
Be concise, professional, and friendly.`,
    ],
    ["human", "Conversation History:\n{conv_history}\n\nQuestion: {question}"],
  ]);

  const retrieverChain = RunnableSequence.from([
    (input: ConversationalInput) => input.question,
    retriever,
    (docs: Document[]) => docs.map((doc) => doc.pageContent).join("\n\n"),
  ]);

  const answerChain = answerPrompt
    .pipe(chatModel)
    .pipe(new StringOutputParser());

  // Single LLM call flow:
  // 1. Retrieve context from original question
  // 2. Generate final answer using context + conversation history
  const chain = RunnableSequence.from([
    {
      context: retrieverChain,
      question: (input: ConversationalInput) => input.question,
      conv_history: (input: ConversationalInput) => input.conv_history ?? "",
    },
    answerChain,
  ]);

  return chain;
}

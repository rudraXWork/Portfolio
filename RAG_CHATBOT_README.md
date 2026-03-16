# RAG Chatbot Setup Guide

This is a setup guide for the RAG (Retrieval-Augmented Generation) chatbot integrated with your portfolio.

## Prerequisites

- Google API Key (for Gemini embeddings)
- Groq API Key (for chat model)
- Supabase Project (for vector store)
- Node.js and npm installed

## Step-by-Step Setup

### 1. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### 2. Get Groq API Key

1. Go to [Groq Console](https://console.groq.com/keys)
2. Create an API key
3. Copy the key

### 3. Set Up Supabase

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **API** to get:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Go to **Settings** → **API** → **Service Role Key** to get:
   - `SUPABASE_SERVICE_ROLE_KEY`

### 4. Set Up Database Tables

1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `SUPABASE_SETUP.sql`
4. Run the query

### 5. Update Environment Variables

Update `.env.local`:

```env
# Google Gemini
GOOGLE_API_KEY=your_google_gemini_api_key_here

# Groq
GROQ_API_KEY=your_groq_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 6. Initialize Vector Store

Run this in your project to populate the vector store:

```bash
npm run dev
```

The chatbot will automatically initialize on first chat message.

## File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client setup
│   ├── langchain.ts         # LangChain chains & RAG setup
│   └── documents.ts         # Portfolio documents
├── components/
│   └── ChatBot.tsx          # Chat UI component
└── app/
    └── api/
        └── chat/
            └── route.ts     # Chat API endpoint
```

## How It Works

1. **User asks a question** via the chat widget
2. **Frontend sends message** to `/api/chat`
3. **Backend retrieves** relevant portfolio documents using vector similarity search
4. **Groq generates** a response based on the retrieved context
5. **Response is sent back** and displayed in the chat

## Customization

### Adding More Documents

Edit `src/lib/documents.ts` to add more portfolio information:

```typescript
export const portfolioDocuments = [
  {
    title: "Your Title",
    content: "Your content here...",
    metadata: { section: "section-name", type: "type-name" },
  },
  // ... more documents
];
```

### Changing Chat Model

In `src/lib/langchain.ts`, change:

```typescript
export const chatModel = new ChatGroq({
  model: "llama-3.1-8b-instant", // Change model here
  maxTokens: 512,
});
```

Available models (examples):
- `llama-3.1-8b-instant` (fast)
- `llama-3.3-70b-versatile` (more capable)

### Styling the Chat

Edit `src/components/ChatBot.tsx` to customize colors, sizes, and animations.

## Troubleshooting

### "Cannot find module '@google/generative-ai'"
```bash
npm install @google/generative-ai --legacy-peer-deps
```

### API Key errors
- Verify keys are correct in `.env.local`
- Ensure `.env.local` is NOT in `.gitignore`

### No responses from chatbot
1. Check browser console for errors (F12)
2. Verify Supabase connection
3. Check that documents are initialized

### Slow responses
- Reduce `maxOutputTokens` in `langchain.ts`
- Reduce `k` parameter in `getRetriever()` (number of documents to retrieve)

## Security Notes

- Never commit `.env.local` to git
- Use `.env.local` for local development
- Deploy variables to Vercel/hosting platform secrets
- Keep API keys private

## Next Steps

- Add more portfolio projects and information
- Fine-tune the system prompt in `createRAGChain()`
- Add conversation history/memory for multi-turn chats
- Deploy to production

## Support

For issues or questions, check:
- [LangChain Docs](https://js.langchain.com)
- [Supabase Docs](https://supabase.com/docs)
- [Google Gemini Docs](https://ai.google.dev/docs)

-- Supabase SQL Setup for RAG Chatbot
-- Run this in your Supabase SQL editor

-- Enable pgvector extension (required for vector type)
create extension if not exists vector;

-- Create documents table with pgvector support
create table if not exists documents (
  id bigserial primary key,
  content text,
  embedding vector(3072),
  metadata jsonb,
  created_at timestamp default now()
);

-- Legacy compatibility: some setups used 'text' column instead of 'content'
alter table documents
  add column if not exists content text;

-- If legacy 'text' exists, copy values into 'content'
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'documents'
      and column_name = 'text'
  ) then
    execute 'update documents set content = coalesce(content, text)';
  end if;
end $$;

-- If table already existed without embedding column, add it
alter table documents
  add column if not exists embedding vector(3072);

-- Migration for older setups that used vector(768)
-- If your table is empty (as in fresh setup), this safely recreates the column.
-- If you already have data you want to keep, do not run this block without re-embedding.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'documents'
      and column_name = 'embedding'
      and udt_name = 'vector'
  ) then
    -- Recreate to guarantee correct size for gemini-embedding-001 (3072 dims)
    alter table documents drop column if exists embedding;
    alter table documents add column embedding vector(3072);
  end if;
end $$;

-- NOTE:
-- ivfflat index supports up to 2000 dimensions for 'vector' type.
-- gemini-embedding-001 returns 3072 dimensions, so ivfflat cannot be created here.
-- For small/medium datasets, sequential scan is fine.
-- If you need ANN indexing later, migrate to a 768/1536-dim model or redesign schema.

-- Create a function for searching similar documents
drop function if exists search_documents(vector(768), int);
drop function if exists search_documents(vector(3072), int);
drop function if exists search_documents(vector(3072), int, jsonb);

create or replace function search_documents (
  query_embedding vector(3072),
  match_count int,
  filter jsonb default '{}'::jsonb
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  created_at timestamp,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    documents.created_at,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where documents.embedding is not null
    and documents.metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;

-- Grant permissions
grant select on documents to anon, authenticated;
grant insert on documents to authenticated;
grant execute on function search_documents to anon, authenticated;

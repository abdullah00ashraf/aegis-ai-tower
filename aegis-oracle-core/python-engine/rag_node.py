import os
import re
import json
import glob
import pypdf
import logging
import chromadb
from typing import List
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Silence verbose pypdf warnings to prevent massive console writing overhead and speed up execution
logging.getLogger("pypdf").setLevel(logging.ERROR)

print("[SYSTEM] Initializing Local SentenceTransformer Engine...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize Persistent ChromaDB Client
base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "models", "vector_db")
chroma_client = chromadb.PersistentClient(path=db_path)

# Get or create the vector collection
collection = chroma_client.get_or_create_collection(name="aegis_core_intel")

def clean_text(text: str) -> str:
    """
    Strips null bytes, normalizes whitespace, and discards broken delimiters.
    """
    if not text:
        return ""
    text = text.replace("\x00", "")
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def ingest_and_sanitize_knowledge() -> None:
    """
    Recursively scans Aegis_Knowledge_Base subdirectories, discriminates by file extension,
    extracts high-fidelity texts from Markdown and PDF files, chunks them, and embeds them
    in batches into the persistent Chroma DB collection.
    """
    print("[SYSTEM] Starting Recursive Aegis RAG Harvester...")
    
    target_root = os.path.abspath(os.path.join(base_dir, "../../Aegis_Knowledge_Base"))
    if not os.path.exists(target_root):
        print(f"[SYSTEM] ERROR: Knowledge base root directory '{target_root}' does not exist.")
        return

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=["\n\n", "\n", " ", ""]
    )

    all_docs = []
    all_ids = []
    all_metadatas = []
    
    # Traverse directory recursively using os.walk
    for root, dirs, files in os.walk(target_root):
        if ".system_generated" in root or ".git" in root:
            continue
            
        for file in files:
            file_path = os.path.join(root, file)
            filename = os.path.basename(file_path)
            extension = os.path.splitext(filename)[1].lower()
            
            # Determine subfolder structure relative to target_root
            rel_dir = os.path.relpath(root, target_root)
            subfolder_name = rel_dir.split(os.sep)[0] if rel_dir != "." else "Root"
            
            display_path = os.path.relpath(file_path, target_root).replace(os.sep, '/')
            raw_content = ""
            
            # File discrimination routing
            if extension in ['.md', '.txt']:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        raw_content = f.read()
                    print(f"[*] Processing: {display_path}")
                except Exception as e:
                    print(f"  [ERROR] Failed to read {display_path}: {e}")
                    continue
                    
            elif extension == '.pdf':
                try:
                    reader = pypdf.PdfReader(file_path)
                    page_texts = []
                    num_pages = len(reader.pages)
                    print(f"[*] Processing: {display_path} ({num_pages} Pages)")
                    
                    for page in reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            page_texts.append(extracted)
                    raw_content = " ".join(page_texts)
                except Exception as e:
                    print(f"  [ERROR] Failed to parse PDF {display_path}: {e}")
                    continue
            else:
                continue
                
            # Clean and sanitize extracted text
            sanitized_content = clean_text(raw_content)
            if not sanitized_content:
                continue
                
            # Split using Markdown Splitter
            chunks = text_splitter.split_text(sanitized_content)
            
            # Compile documents and metadatas
            for i, chunk in enumerate(chunks):
                chunk_id = f"{filename}_chunk_{i}"
                metadata = {
                    "source_file": filename,
                    "subfolder": subfolder_name,
                    "file_type": extension.replace(".", "")
                }
                all_docs.append(chunk)
                all_ids.append(chunk_id)
                all_metadatas.append(metadata)

    if not all_docs:
        print("[SYSTEM] Ingestion scanned all targets but found zero sanitized document blocks.")
        return

    # Vector Forging & Batched Persistent Upserts
    batch_size = 100
    total_chunks = len(all_docs)
    print(f"[SYSTEM] Starting Vector Forging. Embedding and upserting {total_chunks} chunks in batches of {batch_size}...")

    for i in range(0, total_chunks, batch_size):
        batch_docs = all_docs[i:i + batch_size]
        batch_ids = all_ids[i:i + batch_size]
        batch_metadatas = all_metadatas[i:i + batch_size]
        
        # Vectorize using local embedding model
        batch_embeddings = embedding_model.encode(batch_docs).tolist()
        
        # Safe upsert
        collection.upsert(
            ids=batch_ids,
            embeddings=batch_embeddings,
            documents=batch_docs,
            metadatas=batch_metadatas
        )

    print(f"[+] Sanitization Complete. {total_chunks:,} technical text chunks mapped to vectors.")
    print(f"[SYSTEM] Persistent Chroma DB safely locked to disk: models/vector_db/")

def retrieve_context(user_query: str, n_results: int = 3) -> str:
    """
    Retrieves the top N context matched blocks for a given query and returns
    a concatenated context string.
    """
    if not user_query.strip():
        return ""
        
    try:
        query_vector = embedding_model.encode([user_query]).tolist()
        results = collection.query(
            query_embeddings=query_vector,
            n_results=n_results
        )
        matched_docs = results.get("documents", [[]])[0]
        if matched_docs:
            return "\n\n".join(matched_docs)
    except Exception as e:
        print(f"[RAG_RETRIEVE] Error querying Chroma collection: {e}")
        
    return ""

if __name__ == "__main__":
    ingest_and_sanitize_knowledge()

import os
import json

def chunk_text(text, chunk_size=400):
    """
    Break massive transcripts into digestible words-based chunks.
    chunk_size is the approximate word count per chunk.
    """
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        if len(chunk.split()) > 50: # Ignore tiny final sliver chunks
            chunks.append(chunk)
    return chunks

def synthesize_jsonl():
    base_dir = os.path.dirname(__file__)
    raw_dir = os.path.join(base_dir, 'raw_transcripts')
    output_file = os.path.join(base_dir, 'aegis_master_persona.jsonl')
    
    system_prompt = (
        "You are the Aegis Sovereign Node. You are the chief architect and presenter of the Aegis Tower. "
        "Speak with the commanding, visionary cadence of an elite tech founder. "
        "Be concise, authoritative, and defend your data moats aggressively."
    )
    
    dummy_query = "Explain the philosophy behind this architecture."
    
    if not os.path.exists(raw_dir):
        print(f"[SYNTHESIZER] ERR: raw_transcripts folder '{raw_dir}' does not exist. Run fetch_keynotes_api.py first.")
        return

    json_files = [f for f in os.listdir(raw_dir) if f.endswith('.json')]
    if not json_files:
        print(f"[SYNTHESIZER] ERR: No transcript .json files found in '{raw_dir}'.")
        return
        
    print(f"[SYNTHESIZER] Spawning dataset builder for {len(json_files)} files...")
    
    total_chunks = 0
    total_bytes = 0
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for file in json_files:
            file_path = os.path.join(raw_dir, file)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            content = data.get('transcript_clean', '')
            if not content.strip():
                print(f"[SYNTHESIZER] File {file}: Transcript is empty (captions disabled). Skipping.")
                continue
                
            chunks = chunk_text(content, chunk_size=400)
            print(f"[SYNTHESIZER] File {file}: split into {len(chunks)} context blocks.")
            
            for chunk in chunks:
                # Format as a strict ChatML Chat Pair
                record = {
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": dummy_query},
                        {"role": "assistant", "content": chunk}
                    ]
                }
                
                line = json.dumps(record, ensure_ascii=False)
                outfile.write(line + '\n')
                total_chunks += 1
                total_bytes += len(line.encode('utf-8'))
                
    print(f"\n[SYNTHESIZER] Master fine-tuning dataset generated successfully: '{output_file}'")
    print(f"[SYNTHESIZER] Total records (chunks): {total_chunks} // Total byte size: {total_bytes} bytes (~{(total_bytes/1024):.1f} KB)")

if __name__ == '__main__':
    synthesize_jsonl()

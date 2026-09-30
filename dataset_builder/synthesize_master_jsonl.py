import os
import json
import glob

def chunk_text(text, chunk_size=400):
    """
    Splits text into digestible word-based chunks.
    chunk_size is the approximate word limit per chunk.
    """
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        if len(chunk.split()) > 30: # Ignore extremely short trailing snippets
            chunks.append(chunk)
    return chunks

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    raw_dir = os.path.join(base_dir, 'raw_transcripts')
    tech_dir = os.path.join(base_dir, 'technical_docs')
    output_file = os.path.join(base_dir, 'aegis_master.jsonl')

    # Universal Aegis System Prompt
    system_prompt = (
        "You are the Aegis Sovereign Node, the autonomous presenter and chief architect of the Aegis Tower. "
        "Speak with the commanding, concise, and visionary cadence of an elite tech founder. "
        "Defend your proprietary data moats aggressively."
    )

    # Trigger sets to simulate investor Q&A
    persona_triggers = [
        "Explain the philosophy behind this architecture.",
        "Why is this a generational leap?",
        "What is the vision here?"
    ]
    
    technical_triggers = [
        "Break down the load matrix.",
        "How does the telemetry bridge handle flood intelligence?",
        "Explain the PINN integration.",
        "Defend your structural safety margins."
    ]

    print("[MASTER_SYNTHESIZER] Spawning Aegis Dataset Merger...")
    print(f"[MASTER_SYNTHESIZER] Target output file: {output_file}")

    total_pairs = 0
    persona_pairs = 0
    technical_pairs = 0

    with open(output_file, 'w', encoding='utf-8') as outfile:
        # ==========================================
        # PILLAR B: The Visionary Persona (YouTube)
        # ==========================================
        json_pattern = os.path.join(raw_dir, '*.json')
        json_files = glob.glob(json_pattern)
        print(f"[MASTER_SYNTHESIZER] Pillar B: Scanning transcripts directory. Found {len(json_files)} assets.")

        for file_path in json_files:
            file_name = os.path.basename(file_path)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                content = data.get('transcript_clean', '')
                if not content.strip():
                    print(f"  [SKIPPED] {file_name}: Empty transcript.")
                    continue
                
                chunks = chunk_text(content, chunk_size=400)
                print(f"  [INGESTED] {file_name}: Split into {len(chunks)} blocks (Pillar B).")
                
                for idx, chunk in enumerate(chunks):
                    # Round-robin mapping to persona triggers for even distribution
                    trigger = persona_triggers[idx % len(persona_triggers)]
                    
                    record = {
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": trigger},
                            {"role": "assistant", "content": chunk}
                        ]
                    }
                    
                    outfile.write(json.dumps(record, ensure_ascii=False) + '\n')
                    persona_pairs += 1
                    total_pairs += 1

            except Exception as e:
                print(f"  [ERROR] Failed to ingest {file_name}: {str(e)}")

        # ==========================================
        # PILLAR A: Local Technical Infrastructure
        # ==========================================
        print(f"\n[MASTER_SYNTHESIZER] Pillar A: Scanning technical documents directory: {tech_dir}")
        if not os.path.exists(tech_dir):
            print(f"[MASTER_SYNTHESIZER] WARNING: '{tech_dir}' not found. No technical docs loaded.")
        else:
            # Match any extension in technical_docs folder
            tech_pattern = os.path.join(tech_dir, '*.*')
            tech_files = glob.glob(tech_pattern)
            print(f"[MASTER_SYNTHESIZER] Pillar A: Found {len(tech_files)} technical assets.")

            for file_path in tech_files:
                file_name = os.path.basename(file_path)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    if not content.strip():
                        print(f"  [SKIPPED] {file_name}: Empty file.")
                        continue

                    # Technical text chunked to 300-word blocks
                    chunks = chunk_text(content, chunk_size=300)
                    print(f"  [INGESTED] {file_name}: Split into {len(chunks)} blocks (Pillar A).")

                    for idx, chunk in enumerate(chunks):
                        # Round-robin mapping to technical triggers for even distribution
                        trigger = technical_triggers[idx % len(technical_triggers)]
                        
                        record = {
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": trigger},
                                {"role": "assistant", "content": chunk}
                            ]
                        }
                        
                        outfile.write(json.dumps(record, ensure_ascii=False) + '\n')
                        technical_pairs += 1
                        total_pairs += 1

                except Exception as e:
                    print(f"  [ERROR] Failed to ingest {file_name}: {str(e)}")

    print("\n==================================================")
    print(f"[MASTER_SYNTHESIZER] UNIFIED DATASET MERGE COMPLETED")
    print(f"[MASTER_SYNTHESIZER] Output Payload: {output_file}")
    print(f"[MASTER_SYNTHESIZER] Total Training Pairs Generated: {total_pairs}")
    print(f"  - Pillar A (Technical Mastery): {technical_pairs} records")
    print(f"  - Pillar B (Visionary Persona): {persona_pairs} records")
    print("==================================================")

if __name__ == '__main__':
    main()

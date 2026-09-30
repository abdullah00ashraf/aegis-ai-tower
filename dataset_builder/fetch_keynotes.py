import os
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
from tqdm import tqdm

def harvest_transcripts():
    output_dir = os.path.join(os.path.dirname(__file__), 'raw_transcripts')
    os.makedirs(output_dir, exist_ok=True)
    
    target_ids = [
        "MnrJzXM7a6o", "VQKMoT-6XSg", "7GRv-kv5XEg", "Q4VGQPk2Dl8", 
        "OjeuXdTij4g", "YBJEiWDPyGs", "uDNXjnOqJ-A", "erhqbyvPesY", 
        "q_umfWm8J28", "XEM5qz__HOU"
    ]
    
    print(f"[HARVESTER] Launching transcript harvesting pipeline for {len(target_ids)} targets...")
    
    success_count = 0
    fail_count = 0
    
    for video_id in tqdm(target_ids, desc="Harvesting transcripts"):
        try:
            print(f"\n[HARVESTER] Fetching transcript for: {video_id}")
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            
            # Stitch entries into single string
            stitched_text = " ".join([entry['text'] for entry in transcript_list])
            
            # Write to raw_transcripts/{video_id}.txt
            out_file = os.path.join(output_dir, f"{video_id}.txt")
            with open(out_file, 'w', encoding='utf-8') as f:
                f.write(stitched_text)
                
            print(f"[HARVESTER] Successfully ingested {video_id}. Character count: {len(stitched_text)}")
            success_count += 1
            
        except (TranscriptsDisabled, NoTranscriptFound) as e:
            print(f"[HARVESTER] WARNING: Subtitles disabled or unavailable for {video_id}. Skipping.")
            fail_count += 1
        except Exception as e:
            print(f"[HARVESTER] ERR: Unexpected failure fetching {video_id}: {e}")
            fail_count += 1
            
    print(f"\n[HARVESTER] Pipeline execution finished. Ingested: {success_count} // Failed: {fail_count}")

if __name__ == '__main__':
    harvest_transcripts()

import os
import json
from dotenv import load_dotenv
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
from tqdm import tqdm

def harvest_keynotes_api():
    base_dir = os.path.dirname(__file__)
    output_dir = os.path.join(base_dir, 'raw_transcripts')
    os.makedirs(output_dir, exist_ok=True)
    
    # Load environment variables safely
    env_path = os.path.join(base_dir, '../aegis-oracle-core/.env.local')
    load_dotenv(dotenv_path=env_path)
    
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        print("[HARVESTER] ERR: YOUTUBE_API_KEY is missing from environment or .env.local.")
        return
        
    print("[HARVESTER] Google YouTube Data API v3 Client spawning...")
    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
    except Exception as e:
        print(f"[HARVESTER] FATAL: Failed to build YouTube service client: {e}")
        return
        
    target_ids = [
        "MnrJzXM7a6o", "VQKMoT-6XSg", "7GRv-kv5XEg", "Q4VGQPk2Dl8", 
        "OjeuXdTij4g", "YBJEiWDPyGs", "uDNXjnOqJ-A", "erhqbyvPesY", 
        "q_umfWm8J28", "XEM5qz__HOU"
    ]
    
    print(f"[HARVESTER] Launching robust corpus harvesting for {len(target_ids)} videos...")
    
    success_count = 0
    fail_count = 0
    
    # Initialize the transcript api instance
    transcript_api = YouTubeTranscriptApi()
    
    for video_id in tqdm(target_ids, desc="Processing videos"):
        print(f"\n[HARVESTER] Processing video ID: {video_id}")
        
        try:
            # 1. Fetch metadata using YouTube Data API
            video_request = youtube.videos().list(
                part='snippet,contentDetails',
                id=video_id
            )
            video_response = video_request.execute()
            
            if not video_response.get('items'):
                print(f"[HARVESTER] WARNING: Video {video_id} not found or restricted. Skipping.")
                fail_count += 1
                continue
                
            item = video_response['items'][0]
            snippet = item['snippet']
            
            title = snippet.get('title', '')
            description = snippet.get('description', '')
            tags = snippet.get('tags', [])
            
            print(f"[HARVESTER] Retrieved Metadata -> Title: \"{title}\"")
            
            # 2. Fetch transcript using youtube_transcript_api instance method
            transcript_clean = ""
            try:
                raw_transcript = transcript_api.fetch(video_id)
                # entry is FetchedTranscriptSnippet, access via .text attribute
                transcript_clean = " ".join([entry.text for entry in raw_transcript])
                print(f"[HARVESTER] Transcript fetched successfully. Length: {len(transcript_clean)} chars.")
            except (TranscriptsDisabled, NoTranscriptFound) as e:
                print(f"[HARVESTER] WARNING: Captions disabled or missing for {video_id}: {e}")
            except Exception as e:
                print(f"[HARVESTER] WARNING: Unexpected error fetching transcript for {video_id}: {e}")
            
            # 3. Save unified JSON container
            payload = {
                "video_id": video_id,
                "title": title,
                "description": description,
                "tags": tags,
                "transcript_clean": transcript_clean
            }
            
            out_file = os.path.join(output_dir, f"{video_id}.json")
            with open(out_file, 'w', encoding='utf-8') as f:
                json.dump(payload, f, ensure_ascii=False, indent=2)
                
            byte_size = os.path.getsize(out_file)
            print(f"[HARVESTER] Saved unified asset JSON. Size: {byte_size} bytes.")
            success_count += 1
            
        except Exception as e:
            print(f"[HARVESTER] ERR: Failed to process video {video_id}: {e}")
            fail_count += 1
            
    print(f"\n[HARVESTER] Robust Harvesting Finished. Success: {success_count} // Failed: {fail_count}")

if __name__ == '__main__':
    harvest_keynotes_api()

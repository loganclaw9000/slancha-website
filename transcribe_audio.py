import requests
import time

# Your audio file path
audio_file = '/home/admin/.openclaw/media/inbound/373b301a-4111-47ef-ba29-197f6ddd5f51.m4a'

# AssemblyAI API (free tier: 3 months, 120 mins/month)
# You'll need to get your API key from https://www.assemblyai.com/
ASSEMBLYAI_API_KEY = 'YOUR_API_KEY_HERE'  # Replace with your key

def transcribe_audio(file_path, api_key):
    """Transcribe audio using AssemblyAI"""
    
    # Step 1: Upload the audio file
    upload_url = 'https://api.assemblyai.com/v2/upload'
    
    with open(file_path, 'rb') as f:
        response = requests.post(upload_url, headers={'authorization': api_key}, data=f)
    
    upload_url = response.json()['upload_url']
    print(f"✓ File uploaded: {upload_url}")
    
    # Step 2: Start transcription
    transcript_url = 'https://api.assemblyai.com/v2/transcript'
    headers = {'authorization': api_key}
    data = {'audio_url': upload_url}
    
    response = requests.post(transcript_url, headers=headers, json=data)
    transcript_id = response.json()['id']
    print(f"✓ Transcription started: {transcript_id}")
    
    # Step 3: Poll for completion
    while True:
        time.sleep(5)
        response = requests.get(f'{transcript_url}/{transcript_id}', headers=headers)
        status = response.json()['status']
        
        if status == 'completed':
            return response.json()['text']
        elif status == 'error':
            raise Exception("Transcription error")
        else:
            print(f"  Status: {status}...")

# Usage
try:
    text = transcribe_audio(audio_file, ASSEMBLYAI_API_KEY)
    print("\n" + "="*50)
    print("TRANSCRIPT:")
    print("="*50)
    print(text)
    print("="*50)
    
    # Save to file
    with open('transcript.txt', 'w') as f:
        f.write(text)
    print("\n✓ Saved to: transcript.txt")
    
except Exception as e:
    print(f"Error: {e}")
    print("\nTo use this, get an API key from: https://www.assemblyai.com/")

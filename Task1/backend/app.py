from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from stt import transcribe_audio

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    while True:

        try:
            # Receive audio bytes
            audio_data = await websocket.receive_bytes()

            # Save temp audio file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:

                temp_audio.write(audio_data)

                temp_audio_path = temp_audio.name

            # Transcribe
            text = transcribe_audio(temp_audio_path)

            # Send text back
            await websocket.send_text(text)

            # Delete temp file
            os.remove(temp_audio_path)

        except Exception as e:
            print("Error",e)
            break
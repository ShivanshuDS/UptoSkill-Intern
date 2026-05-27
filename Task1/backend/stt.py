from faster_whisper import WhisperModel
import tempfile

#load Whisper Model
model=WhisperModel("base",device="cpu")

def transcribe_audio(audio_path):
    segments, info=model.transcribe(audio_path)
    text=""
    for segment in segments:
        text += segment.text + " "
    return text 
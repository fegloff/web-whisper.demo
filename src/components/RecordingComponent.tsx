import React, { useEffect, useState } from "react";
import { useAudioRecorder } from 'react-audio-voice-recorder';
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { speechToText } from "../api/openai";

import { AudioContainer } from "./RecordingComponent.styles";

const RecordingComponent = () => {
  const [transcription, setTranscription] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
  } = useAudioRecorder();

  useEffect(() => {
    const callWhisperModel = async (blob: Blob) =>{
      const response = await speechToText(blob);
        if (transcription) {
          setTranscription(transcription.concat(`\n${response}`));
        } else {
          setTranscription(response);
        }
    }
    if (!recordingBlob) return;
      callWhisperModel(recordingBlob)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingBlob])

  useEffect(() => {
    if (transcript) {
      setTranscription(transcript);
    }
  }, [transcript]);
  

  const resetTranscription = () => {
    setTranscription("")
    resetTranscript()
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <AudioContainer>
      <div className='recorder-panel'>
        <div className="mic-panel">
          <p>Use Whisper</p>
          <button
            onClick={() => {
              isRecording
                ? stopRecording()
                : startRecording();
            }}
            className='action-button'
            disabled={listening}
          >
            {isRecording ? 'recording' : 'record'}
          </button>
        </div>
        <div className="mic-panel">
          <p>Use SpeechRecognition</p>
          <button
            onClick={() => {
              listening
                ? SpeechRecognition.stopListening()
                : SpeechRecognition.startListening();
            }}
            className='action-button'
            disabled={isRecording}
          >
            {listening ? 'recording' : 'record'}
          </button>
        </div>
      </div>

      <div className="transcription-container">{transcription}</div>
      <div>
        <button onClick={resetTranscription} className='clear-button'>Clear</button>
      </div>
    </AudioContainer>
  );
};

export default RecordingComponent;

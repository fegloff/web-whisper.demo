import React, { useEffect, useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
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

  useEffect(() => {
    if (transcript) {
      setTranscription(transcript);
    }
  }, [transcript]);
  
  const updateTranscriptionWithWhisper = async (blob: Blob | MediaSource) => {
    try {
      if (blob) {
        const response = await speechToText(blob as Blob);
        if (transcription) {
          setTranscription(transcription.concat(`\n${response}`));
        } else {
          setTranscription(response);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

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
          <p>Using Whisper</p>
          <AudioRecorder
            onRecordingComplete={updateTranscriptionWithWhisper}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            // downloadOnSavePress={true}
            downloadFileExtension="mp3"
          />
        </div>
        <div className="mic-panel">
          <p>Using SpeechRecognition</p>
          <button
            onClick={() => {
              listening
                ? SpeechRecognition.stopListening()
                : SpeechRecognition.startListening();
            }}
          >
            {listening ? 'recording' : 'record'}
          </button>
        </div>
      </div>

      <div className="transcription-container">{transcription}</div>
      <div>
        <button onClick={resetTranscription}>Clear</button>
      </div>
    </AudioContainer>
  );
};

export default RecordingComponent;

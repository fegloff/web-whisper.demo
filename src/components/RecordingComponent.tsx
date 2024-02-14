import React, { useEffect, useState } from "react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<
    MediaRecorder | undefined
  >();
  const [isDataSent, setIsDataSent] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [mediaOptions, setMediaOptions] = useState<{} | undefined>({})
  const [mimeType, setMimeType] = useState('')

  useEffect(() => {
    if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
      setMediaOptions({mimeType: 'video/webm; codecs=vp9'});
      setMimeType('video/webm')
    } else  if (MediaRecorder.isTypeSupported('video/webm')) {
      setMediaOptions({mimeType: 'video/webm'});
      setMimeType('video/webm')
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      setMediaOptions({mimeType: 'video/mp4', videoBitsPerSecond : 100000});
      setMimeType('video/mp4')
    } else {
      setMediaOptions(undefined)
      setMimeType('audio/wav')
      console.error("no suitable mimetype found for this device");
    }
  }, [])

  useEffect(() => {
    let isStopped = false;

    const handleDataAvailable = (event: { data: BlobPart }) => {
      setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
    };

    const startRecording = async () => {
      setRecordedChunks([])
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream, mediaOptions);
      newMediaRecorder.ondataavailable = handleDataAvailable;
      newMediaRecorder.start(1000); // timeslice => send bits of audio of the specified length
      setMediaRecorder(newMediaRecorder);
    };
    const stopRecording = () => {
      if (mediaRecorder && !isStopped) {
        mediaRecorder.addEventListener('stop', () => {
          setIsRecording(false);
        });
        mediaRecorder.stop();
        isStopped = true;
        setIsDataSent(false);
      }
    };

    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopRecording();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  useEffect(() => {
    const sendAudioToWhisper = async () => {
      const audioBlob = new Blob(recordedChunks, { type: mimeType });
      const response = await speechToText(audioBlob);
      if (!!response) {
        setTranscription(response);
      }
    };
    if (recordedChunks.length > 0) {
      sendAudioToWhisper()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordedChunks, isDataSent])
  
  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    if (transcript) {
      setTranscription(transcript);
    }
  }, [transcript]);

  const resetTranscription = () => {
    setTranscription("");
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <AudioContainer>
      <div className="recorder-panel">
        <div className="mic-panel">
          <p>Use Whisper</p>
          <button onClick={handleRecordToggle} disabled={listening} className="action-button">
            {isRecording ? "Recording..." : "Record"}
          </button>
        </div>
        <div className="mic-panel">
          <p>Use SpeechRecognition</p>
          <button
            onClick={() => {
              listening
                ? SpeechRecognition.stopListening()
                : SpeechRecognition.startListening({ continuous: true });
            }}
            className="action-button"
            disabled={isRecording}
          >
            {listening ? "Recording..." : "Record"}
          </button>
        </div>
      </div>

      <div className="transcription-container">{transcription}</div>
      <div>
        <button onClick={resetTranscription} className="clear-button">
          Clear
        </button>
      </div>
    </AudioContainer>
  );
};

export default RecordingComponent;

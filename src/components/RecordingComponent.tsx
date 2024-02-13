
import { AudioRecorder } from 'react-audio-voice-recorder';
import { speechToText } from '../api/openai';
import React, { useState } from 'react'
import { AudioContainer } from './RecordingComponent.styles';

const RecordingComponent = () => {
  const [transcription, setTranscription] = useState('')

  const addAudioElement = async (blob: Blob | MediaSource) => {
    try {
      if (blob) {
        const response = await speechToText(blob as Blob)
        if (transcription) {
          setTranscription(transcription.concat(`\n${response}`))
        } else {
          setTranscription(response)
        }
      }
    } catch (e) {
      console.log(e)
    }
  };
  
  return (
    <AudioContainer>
        <AudioRecorder 
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }} 
        // downloadOnSavePress={true}
        downloadFileExtension="mp3"
      />
      <div className='transcription-container'>{transcription}</div>
      <div><button onClick={() => setTranscription('')}>Clear</button></div>
    </AudioContainer>)
}

export default RecordingComponent
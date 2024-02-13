import styled from 'styled-components'

export const AudioContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center !important;
  width: 100% !important;
  gap: 1em;

  .recorder-panel {
    display: flex;
    flex-direction: row;
    align-items: center !important;
    justify-content: center;
    width: 100% !important;
    gap: 3em;
  }

  .mic-panel {
    display: flex;
    flex-direction: column;
    align-items: center !important;
  }

  .transcription-container {
    border: 1px solid gray;
    border-radius: 15px;
    height: 100px;
    width: 400px;
    padding: 10px;
  }

  .action-button {
    padding: 0.5em 1em 0.5em;
    border-radius: 10px;
    border: 0px;
    background-color: #62c1e9;
  }

  .clear-button {
    padding: 0.5em 1em 0.5em;
    border-radius: 10px;
    border: 1px solid #62c1e9;
    background-color: transparent;
  }
`
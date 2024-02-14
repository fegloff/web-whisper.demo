import axios from 'axios';
import config from '../config';

export async function speechToText(blob: Blob): Promise<string> {
  try {
    const filename = `/voiceMemo_${Date.now()}.mp3`
    const formData = new FormData();
    formData.append('data', blob, filename);
    const request = {
      method: 'post',
      maxBodyLength: Infinity,
      url: config.openai_url,
      headers: {
        'Content-Type': 'audio/wav',
      },
      data: formData,
    };
    const response = await axios.request(request);
    return response.data;
  } catch (e) {
    console.log(e);
    return '';
  }
}

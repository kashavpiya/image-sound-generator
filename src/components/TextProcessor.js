import React, { useState } from 'react';
import axios from 'axios';
import SoundDownload from './SoundDownload'; // Assuming you have the SoundDownload component
import './TextProcessor.css'; // Import your CSS file

const TextProcessor = ({ file }) => {
  const [description, setDescription] = useState('');
  const [soundLinks, setSoundLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const processFile = async () => {
    try {
      setLoading(true);
      const fileBase64 = await fileToBase64(file);

      const visionResponse = await axios.post(
        'https://vision.googleapis.com/v1/images:annotate',
        {
          requests: [
            {
              image: { content: fileBase64 },
              features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
            },
          ],
        },
        {
          params: {
            key: 'AIzaSyCZXSnVbrEdI6KX1qnMzZAobU1hFTHCDew',
          },
        }
      );

      const labels = visionResponse.data.responses[0].labelAnnotations || [];
      const description = labels.map((label) => label.description).join(', ');
      setDescription(description);

      const soundLinks = await generateSoundEffects([description]);
      setSoundLinks(soundLinks);

      setLoading(false);
    } catch (error) {
      console.error("Error processing file:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  const generateSoundEffects = async (descriptions) => {
    const apiKey = '1ZUSDUN07HKWM72TUMEYTGZKD11XP59G8MUYVQ7G';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    const payload = {
      input: {
        descriptions: descriptions,
        duration: 3,
      },
    };

    const runResponse = await axios.post(
      'https://api.runpod.ai/v2/ex2da8soib595h/run',
      payload,
      { headers }
    );
    const jobId = runResponse.data.id;

    return await pollForSound(jobId);
  };

  const pollForSound = async (jobId) => {
    const apiKey = '1ZUSDUN07HKWM72TUMEYTGZKD11XP59G8MUYVQ7G';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    const statusUrl = `https://api.runpod.ai/v2/ex2da8soib595h/status/${jobId}`;

    while (true) {
      const statusResponse = await axios.get(statusUrl, { headers });
      const jobStatus = statusResponse.data.status;

      if (jobStatus === 'COMPLETED') {
        const audioDownloadUrls =
          JSON.parse(statusResponse.data.output).sound_generation_data.audio_download_url_list;
        return audioDownloadUrls;
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="text-processor">
      {loading ? (
        <p>Processing... please wait.</p>
      ) : (
        <button onClick={processFile} className="process-button">Describe Image and Generate Sound</button>
      )}
      {description && <div className="description">Description: {description}</div>}
      {soundLinks.length > 0 && <SoundDownload soundLinks={soundLinks} />}
    </div>
  );
};

export default TextProcessor;

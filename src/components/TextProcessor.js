import React, { useState } from 'react';
import axios from 'axios';

const TextProcessor = ({ file, onSoundGenerated }) => {
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);

  const processFile = async () => {
    try {
      setLoading(true);
  
      // Convert image to base64
      const fileBase64 = await fileToBase64(file);
  
      // 1. Send image to Google Vision API for text extraction
      const visionResponse = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=62d8923f10aecc087175c2cdbdca9ba97cf1846d`,
        {
          requests: [
            {
              image: { content: fileBase64 },
              features: [{ type: 'TEXT_DETECTION' }],
            }, 
          ],
        }
      );
  
      const text = visionResponse.data.responses[0].fullTextAnnotation?.text || '';
      const cleanedText = cleanExtractedText(text);
      setExtractedText(cleanedText);
  
      // 2. Send cleaned text to OptimizerAI API for sound generation
      const soundLinks = await generateSoundEffects([cleanedText]);
      onSoundGenerated(soundLinks);
  
      setLoading(false);
    } catch (error) {
      console.error("Error processing file:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  const cleanExtractedText = (text) => {
    // Clean up the extracted text to match OptimizerAI requirements
    const words = text.split(' ').slice(0, 8); // Take only first 8 words
    return words.join(' ').trim();
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
        duration: 3, // Set sound duration (default is 3 seconds)
      },
    };

    // Make API call to OptimizerAI to get job_id
    const runResponse = await axios.post(
      'https://api.runpod.ai/v2/ex2da8soib595h/run',
      payload,
      { headers }
    );
    const jobId = runResponse.data.id;

    // Poll the status until the job is completed
    const soundLinks = await pollForSound(jobId);
    return soundLinks;
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

      // Add delay between status checks
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s before retrying
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // This removes the prefix (data:image/jpeg;base64,...) and extracts only the base64-encoded string
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      {loading ? (
        <p>Processing... please wait.</p>
      ) : (
        <button onClick={processFile}>Extract Text and Generate Sound</button>
      )}
      <div>Extracted Text: {extractedText}</div>
    </div>
  );
};

export default TextProcessor;

import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import TextProcessor from './components/TextProcessor';
import SoundDownload from './components/SoundDownload';

function App() {
  const [file, setFile] = useState(null);
  const [soundLinks, setSoundLinks] = useState([]);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleSoundGenerated = (links) => {
    setSoundLinks(links);
  };

  return (
    <div className="App">
      <h1>Image to SoundFX Generator</h1>
      <FileUploader onUpload={handleFileUpload} />
      {file && <TextProcessor file={file} onSoundGenerated={handleSoundGenerated} />}
      {soundLinks.length > 0 && <SoundDownload soundLinks={soundLinks} />}
    </div>
  );
}

export default App;

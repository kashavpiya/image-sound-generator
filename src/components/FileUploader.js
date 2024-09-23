import React, { useState } from 'react';
import './FileUploader.css'; // Import your CSS file

const FileUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button onClick={handleUpload} className="upload-button">Upload</button>
      {file && <p className="file-name">Selected File: {file.name}</p>}
    </div>
  );
};

export default FileUploader;

import React from 'react';
import './SoundDownload.css'; // Assuming you already have this CSS file

const SoundDownload = ({ soundLinks }) => {
  return (
    <div className="sound-download">
      <h3 className="sound-download-title">Generated Sounds:</h3>
      <ul className="sound-list">
        {soundLinks.map((link, index) => (
          <li key={index} className="sound-item">
            <audio controls>
              <source src={link} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <div style={{marginTop: 5}}>
              <a href={link} download={`sound-${index + 1}.wav`} target="_blank" rel="noopener noreferrer">
                Download Sound {index + 1}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoundDownload;

import React from 'react';

const SoundDownload = ({ soundLinks }) => {
  return (
    <div>
      <h3>Generated Sounds:</h3>
      <ul>
        {soundLinks.map((link, index) => (
          <li key={index}>
            <a href={link} download={`sound-${index}.mp3`}>Download Sound {index + 1}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoundDownload;

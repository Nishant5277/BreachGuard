import { useState, useRef } from 'react';
import './BulkUploader.css';

export default function BulkUploader({ onPasswordsParsed }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setError(null);
    if (!file) return;

    // We only accept txt or csv for simplicity
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
      setError('Please upload a .txt or .csv file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      // Split by new line or comma, trim whitespace, and filter empty
      let passwords = [];
      if (file.name.endsWith('.csv')) {
        passwords = content.split(/[\n,]/).map(p => p.trim()).filter(Boolean);
      } else {
        passwords = content.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
      }

      if (passwords.length === 0) {
        setError('No passwords found in the file.');
      } else if (passwords.length > 500) {
        setError('For this demo, please upload a maximum of 500 passwords.');
      } else {
        onPasswordsParsed(passwords);
      }
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="bulk-uploader-container">
      <div 
        className={`drag-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".txt,.csv"
          onChange={handleChange} 
          style={{ display: 'none' }}
        />
        <div className="upload-icon">📄</div>
        <p className="upload-text">Drag & drop a .txt or .csv file here</p>
        <p className="upload-subtext">or click to browse your computer</p>
      </div>
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

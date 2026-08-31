import { useState } from 'react';
import { uploadImage } from '../services/api.js';
import SmartImage from './SmartImage.jsx';

export default function ImageDropzone({ label, value, onChange, multiple = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);

  async function handleFiles(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith('image/'));
    if (!files.length) {
      setError('Drop an image file, or choose one from your device.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const data = await uploadImage(file);
        uploaded.push(data.url);
      }
      if (multiple) {
        const current = String(value || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
        onChange([...current, ...uploaded].join('\n'));
      } else {
        onChange(uploaded[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="label">{label}</p>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
          over ? 'border-clay-500 bg-clay-500/10' : 'border-ink-700/20 bg-cream-50'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple={multiple}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <p className="font-semibold text-ink-800">{busy ? 'Uploading…' : 'Drag and drop an image here'}</p>
        <p className="mt-1 text-sm text-ink-700/70">or click to select from your device</p>
      </label>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {value && !multiple && (
        <SmartImage src={value} alt="Preview" className="mt-3 h-40 w-full rounded-2xl object-cover" />
      )}
      {multiple && value && (
        <div className="mt-3 flex flex-wrap gap-2">
          {String(value)
            .split('\n')
            .filter(Boolean)
            .map((src) => (
              <SmartImage key={src} src={src} alt="" className="h-16 w-16 rounded-xl object-cover" />
            ))}
        </div>
      )}
    </div>
  );
}

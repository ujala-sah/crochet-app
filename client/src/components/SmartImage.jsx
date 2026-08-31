import { useState } from 'react';

export default function SmartImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-cream-200 text-sm font-medium text-ink-700/70 ${className}`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        Image unavailable
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}

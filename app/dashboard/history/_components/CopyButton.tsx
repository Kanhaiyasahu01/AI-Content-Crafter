'use client';

import React from 'react';

interface CopyButtonProps {
  content: string | null | undefined;
}

const CopyButton: React.FC<CopyButtonProps> = ({ content }) => {
  const handleCopy = () => {
    if (typeof content === 'string' && content.trim() !== '') {
      navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    } else {
      alert('No content to copy.');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      Copy
    </button>
  );
};

export default CopyButton;

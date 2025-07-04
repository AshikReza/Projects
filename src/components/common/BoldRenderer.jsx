// src/components/common/BoldRenderer.jsx

import React from 'react';

export default function BoldRenderer({ text }) {
  if (!text) {
    return null;
  }

  // Split the text by the bold delimiter
  const parts = text.split('**');

  return (
    <>
      {parts.map((part, index) => {
        // If the index is odd, it's a bold part
        if (index % 2 === 1) {
          return <strong key={index}>{part}</strong>;
        }
        // Otherwise, it's plain text
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
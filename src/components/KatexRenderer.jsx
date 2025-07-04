// src/components/common/KatexRenderer.js (Upgraded Final Version)

import React from 'react';
import { InlineMath } from 'react-katex';
import BoldRenderer from '../components/common/BoldRenderer'; // Import our new component

export default function KatexRenderer({ text }) {
  if (!text) {
    return null;
  }

  // First, handle the math ($$)
  const parts = text.split('$$');

  return (
    <>
      {parts.map((part, index) => {
        // If the index is odd, it's a math part. Render it with KaTeX.
        if (index % 2 === 1) {
          return <InlineMath key={index} math={part} />;
        }

        // If the index is even, it's a regular text part.
        // NOW, pass this regular text to the BoldRenderer to handle any '**' inside it.
        return <BoldRenderer key={index} text={part} />;
      })}
    </>
  );
}
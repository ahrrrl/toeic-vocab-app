'use client';

import { useState, useEffect } from 'react';

const FONT_SIZES = [80, 90, 100, 110, 125, 140, 160];
const DEFAULT_INDEX = 2; // 100%

export default function FontSizeControl() {
  const [sizeIndex, setSizeIndex] = useState(DEFAULT_INDEX);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('app-font-size-index');
    if (saved !== null) {
      const idx = parseInt(saved, 10);
      if (idx >= 0 && idx < FONT_SIZES.length) {
        setSizeIndex(idx);
        applyFontSize(idx);
      }
    }
  }, []);

  const applyFontSize = (idx) => {
    document.documentElement.style.setProperty('--dynamic-font-scale', FONT_SIZES[idx] / 100);
  };

  const handleDecrease = () => {
    if (sizeIndex > 0) {
      const newIdx = sizeIndex - 1;
      setSizeIndex(newIdx);
      applyFontSize(newIdx);
      localStorage.setItem('app-font-size-index', newIdx.toString());
    }
  };

  const handleIncrease = () => {
    if (sizeIndex < FONT_SIZES.length - 1) {
      const newIdx = sizeIndex + 1;
      setSizeIndex(newIdx);
      applyFontSize(newIdx);
      localStorage.setItem('app-font-size-index', newIdx.toString());
    }
  };

  if (!mounted) return null;

  return (
    <div className="font-size-control">
      <button 
        onClick={handleDecrease} 
        disabled={sizeIndex === 0}
        className="font-btn"
        aria-label="Decrease font size"
        title="글자 크기 줄이기"
      >
        A-
      </button>
      <span className="font-indicator">{FONT_SIZES[sizeIndex]}%</span>
      <button 
        onClick={handleIncrease} 
        disabled={sizeIndex === FONT_SIZES.length - 1}
        className="font-btn"
        aria-label="Increase font size"
        title="글자 크기 키우기"
      >
        A+
      </button>
    </div>
  );
}

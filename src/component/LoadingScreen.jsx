import React from 'react';
import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="tech-spinner">
        <div className="ring"></div>
        <div className="ring inner"></div>
        <div className="glow">LOADING...</div>
      </div>
    </div>
  );
}

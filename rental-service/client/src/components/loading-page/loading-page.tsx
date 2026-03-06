import React from 'react';
import './loading-page.css';

export const LoadingPage: React.FC = () => (
  <div className="loading-page">
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
    <p>Загрузка предложений...</p>
  </div>
);
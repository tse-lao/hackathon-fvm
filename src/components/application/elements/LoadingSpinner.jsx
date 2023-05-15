import React from 'react';

const LoadingSpinner = ({ loadingText }) => (
  <div className="flex items-center justify-center space-x-2">
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
    <div>{loadingText}</div>
  </div>
);

export default LoadingSpinner;
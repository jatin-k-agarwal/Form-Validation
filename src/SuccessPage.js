import React from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const { state } = useLocation();
  return (
    <div className="form-container">
      <h2 className="form-title">Submission Successful!</h2>
      <pre className="success-preview">
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default SuccessPage;
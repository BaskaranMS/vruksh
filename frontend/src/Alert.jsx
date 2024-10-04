import React from 'react';

const Alert = ({ errorMsg, setErrorMsg }) => {
  if (!errorMsg) return null;

  return (
    <div
    className="alert alert-danger alert-dismissible fade show"
    role="alert"
    style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '9999',
      margin: '0',
    }}
  >
    {errorMsg}
    <button
      type="button"
      className="btn-close"
      aria-label="Close"
      onClick={() => setErrorMsg('')}
    ></button>
  </div>
  );
};

export default Alert;

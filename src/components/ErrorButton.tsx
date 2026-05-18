import { useState } from 'react';
import './ErrorButton.css';

function ErrorButton() {
  const [isErrorThrown, setIsErrorThrown] = useState(false);

  if (isErrorThrown) {
    throw new Error('Test error triggered by ErrorButton — this is intentional!');
  }

  return (
    <button
      className="error-trigger-button"
      onClick={() => setIsErrorThrown(true)}
      id="error-trigger-button"
      title="Click to simulate an application error"
    >
      Trigger Error
    </button>
  );
}

export default ErrorButton;

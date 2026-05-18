import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message-container" id="error-message">
      <div className="error-message-content">
        <h3 className="error-message-title">Request Failed</h3>
        <p className="error-message-text">{message}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;

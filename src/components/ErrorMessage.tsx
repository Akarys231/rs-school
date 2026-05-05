import { Component } from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}

class ErrorMessage extends Component<ErrorMessageProps> {
  render() {
    return (
      <div className="error-message-container" id="error-message">
        <div className="error-message-content">
          <h3 className="error-message-title">Request Failed</h3>
          <p className="error-message-text">{this.props.message}</p>
        </div>
      </div>
    );
  }
}

export default ErrorMessage;

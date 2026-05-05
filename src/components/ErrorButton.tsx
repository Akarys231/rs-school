import { Component } from 'react';
import type { ErrorButtonState } from '../types';
import './ErrorButton.css';

class ErrorButton extends Component<object, ErrorButtonState> {
  constructor(props: object) {
    super(props);
    this.state = {
      shouldThrow: false,
    };
  }

  handleClick = (): void => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Test error triggered by ErrorButton — this is intentional!');
    }

    return (
      <button
        className="error-trigger-button"
        onClick={this.handleClick}
        id="error-trigger-button"
        title="Click to simulate an application error"
      >
        Trigger Error
      </button>
    );
  }
}

export default ErrorButton;

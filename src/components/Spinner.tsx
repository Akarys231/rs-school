import { Component } from 'react';
import './Spinner.css';

class Spinner extends Component {
  render() {
    return (
      <div className="spinner-container" id="loading-indicator">
        <div className="spinner-portal">
          <div className="spinner-ring spinner-ring-outer" />
          <div className="spinner-ring spinner-ring-inner" />
          <div className="spinner-core" />
        </div>
        <p className="spinner-text">Loading...</p>
      </div>
    );
  }
}

export default Spinner;

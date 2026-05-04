import { Component, createRef } from 'react';
import type { SearchProps, SearchState } from '../types';
import './Search.css';

class Search extends Component<SearchProps, SearchState> {
  private wrapperRef = createRef<HTMLDivElement>();

  constructor(props: SearchProps) {
    super(props);
    this.state = {
      inputValue: props.initialSearchTerm,
      showHistory: false,
    };
  }

  componentDidMount(): void {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (e: MouseEvent): void => {
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(e.target as Node)
    ) {
      this.setState({ showHistory: false });
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inputValue: e.target.value });
  };

  handleFocus = (): void => {
    if (this.props.searchHistory.length > 0) {
      this.setState({ showHistory: true });
    }
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmedValue = this.state.inputValue.trim();
    this.setState({ showHistory: false });
    this.props.onSearch(trimmedValue);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue = this.state.inputValue.trim();
      this.setState({ showHistory: false });
      this.props.onSearch(trimmedValue);
    }
    if (e.key === 'Escape') {
      this.setState({ showHistory: false });
    }
  };

  handleHistoryItemClick = (term: string): void => {
    this.setState({ inputValue: term, showHistory: false });
    this.props.onSearch(term);
  };

  handleRemoveItem = (e: React.MouseEvent, term: string): void => {
    e.stopPropagation();
    this.props.onRemoveHistoryItem(term);
  };

  render() {
    const { isLoading, searchHistory } = this.props;
    const { inputValue, showHistory } = this.state;

    const filteredHistory = inputValue.trim()
      ? searchHistory.filter((item) =>
          item.toLowerCase().includes(inputValue.trim().toLowerCase())
        )
      : searchHistory;

    return (
      <header className="search-section" id="search-section">
        <h1 className="search-title">Rick & Morty Explorer</h1>
        <form className="search-form" onSubmit={this.handleSubmit} id="search-form">
          <div className="search-input-wrapper" ref={this.wrapperRef}>
            <input
              id="search-input"
              type="text"
              className="search-input"
              placeholder="Search characters..."
              value={inputValue}
              onChange={this.handleInputChange}
              onFocus={this.handleFocus}
              onKeyDown={this.handleKeyDown}
              disabled={isLoading}
              autoComplete="off"
            />
            {showHistory && filteredHistory.length > 0 && (
              <div className="search-history-dropdown" id="search-history">
                <div className="search-history-label">Recent searches</div>
                {filteredHistory.map((term) => (
                  <div
                    key={term}
                    className="search-history-item"
                    onClick={() => this.handleHistoryItemClick(term)}
                  >
                    <span className="search-history-text">{term}</span>
                    <button
                      type="button"
                      className="search-history-remove"
                      onClick={(e) => this.handleRemoveItem(e, term)}
                      aria-label={`Remove ${term} from history`}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            id="search-button"
            type="submit"
            className="search-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-spinner" />
            ) : (
              <span>Search</span>
            )}
          </button>
        </form>
      </header>
    );
  }
}

export default Search;

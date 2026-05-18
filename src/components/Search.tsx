import { useState, useRef, useEffect } from 'react';
import type { SearchProps } from '../types';
import './Search.css';

function Search({
  initialSearchTerm,
  onSearch,
  isLoading,
  searchHistory,
  onRemoveHistoryItem,
}: SearchProps) {
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [showHistory, setShowHistory] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    setShowHistory(false);
    onSearch(trimmedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      setShowHistory(false);
      onSearch(trimmedValue);
    }
    if (e.key === 'Escape') {
      setShowHistory(false);
    }
  };

  const handleHistoryItemClick = (term: string) => {
    setInputValue(term);
    setShowHistory(false);
    onSearch(term);
  };

  const handleRemoveItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    onRemoveHistoryItem(term);
  };

  const filteredHistory = inputValue.trim()
    ? searchHistory.filter((item) =>
        item.toLowerCase().includes(inputValue.trim().toLowerCase())
      )
    : searchHistory;

  return (
    <header className="search-section" id="search-section">
      <h1 className="search-title">Rick & Morty Explorer</h1>
      <form className="search-form" onSubmit={handleSubmit} id="search-form">
        <div className="search-input-wrapper" ref={wrapperRef}>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search characters..."
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
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
                  onClick={() => handleHistoryItemClick(term)}
                >
                  <span className="search-history-text">{term}</span>
                  <button
                    type="button"
                    className="search-history-remove"
                    onClick={(e) => handleRemoveItem(e, term)}
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

export default Search;

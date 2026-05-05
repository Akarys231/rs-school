import { Component } from 'react';
import Search from './components/Search';
import CardList from './components/CardList';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorButton from './components/ErrorButton';
import Pagination from './components/Pagination';
import { fetchCharacters } from './api';
import type { AppState } from './types';
import './App.css';

const STORAGE_KEY = 'rick-morty-search-term';
const HISTORY_KEY = 'rick-morty-search-history';
const MAX_HISTORY = 10;

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);

    const savedTerm = localStorage.getItem(STORAGE_KEY) || '';
    const savedHistory = this.loadHistory();

    this.state = {
      characters: [],
      isLoading: false,
      error: null,
      searchTerm: savedTerm,
      lastSearchedTerm: savedTerm,
      searchHistory: savedHistory,
      currentPage: 1,
      totalPages: 0,
    };
  }

  componentDidMount(): void {
    this.performSearch(this.state.searchTerm, 1);
  }

  loadHistory(): string[] {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string');
        }
      }
    } catch {
      // ignore parse errors
    }
    return [];
  }

  saveHistory(history: string[]): void {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  addToHistory(term: string): string[] {
    if (!term) return this.state.searchHistory;

    const filtered = this.state.searchHistory.filter((item) => item !== term);
    const updated = [term, ...filtered].slice(0, MAX_HISTORY);
    this.saveHistory(updated);
    return updated;
  }

  performSearch = async (term: string, page: number): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      const data = await fetchCharacters(term, page);
      this.setState({
        characters: data.results,
        isLoading: false,
        currentPage: page,
        totalPages: data.info.pages,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      this.setState({
        characters: [],
        isLoading: false,
        error: errorMessage,
        currentPage: 1,
        totalPages: 0,
      });
    }
  };

  handleSearch = (term: string): void => {
    const trimmedTerm = term.trim();

    if (trimmedTerm === this.state.lastSearchedTerm) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, trimmedTerm);
    const updatedHistory = this.addToHistory(trimmedTerm);

    this.setState(
      {
        searchTerm: trimmedTerm,
        lastSearchedTerm: trimmedTerm,
        searchHistory: updatedHistory,
      },
      () => {
        this.performSearch(trimmedTerm, 1);
      }
    );
  };

  handlePageChange = (page: number): void => {
    this.performSearch(this.state.searchTerm, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  handleRemoveHistoryItem = (term: string): void => {
    const filtered = this.state.searchHistory.filter((item) => item !== term);
    this.saveHistory(filtered);
    this.setState({ searchHistory: filtered });
  };

  render() {
    const { characters, isLoading, error, searchTerm, searchHistory, currentPage, totalPages } = this.state;

    return (
      <ErrorBoundary>
        <div className="app-layout" id="app-layout">
          <Search
            initialSearchTerm={searchTerm}
            onSearch={this.handleSearch}
            isLoading={isLoading}
            searchHistory={searchHistory}
            onRemoveHistoryItem={this.handleRemoveHistoryItem}
          />
          <main className="results-section" id="results-section">
            {isLoading && <Spinner />}
            {!isLoading && error && <ErrorMessage message={error} />}
            {!isLoading && !error && (
              <>
                <CardList characters={characters} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={this.handlePageChange}
                  isLoading={isLoading}
                />
              </>
            )}
          </main>
          <ErrorButton />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;

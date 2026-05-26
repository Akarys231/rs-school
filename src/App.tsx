import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Search from './components/Search';
import CardList from './components/CardList';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';
import ErrorButton from './components/ErrorButton';
import Pagination from './components/Pagination';
import Flyout from './components/Flyout';
import DetailsPanel from './pages/DetailsPanel';
import { fetchCharacters } from './api';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSelectedItemsStore } from './store/selectedItemsStore';
import { downloadCsv } from './utils/downloadCsv';
import type { Character } from './types';
import './App.css';

const STORAGE_KEY = 'rick-morty-search-term';
const HISTORY_KEY = 'rick-morty-search-history';
const MAX_HISTORY = 10;

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearchTerm, setLocalSearchTerm] = useLocalStorage<string>(STORAGE_KEY, '');
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(HISTORY_KEY, []);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlSearch = searchParams.get('search') ?? localSearchTerm;
  const isDetailsOpen = searchParams.has('details');

  const performSearch = useCallback(async (term: string, page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCharacters(term, page);
      setCharacters(data.results);
      setTotalPages(data.info.pages);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setCharacters([]);
      setError(errorMessage);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(urlSearch, urlPage);
  }, [urlSearch, urlPage, performSearch]);

  const handleSearch = (term: string) => {
    const trimmedTerm = term.trim();

    setLocalSearchTerm(trimmedTerm);

    if (trimmedTerm) {
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item !== trimmedTerm);
        return [trimmedTerm, ...filtered].slice(0, MAX_HISTORY);
      });
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', trimmedTerm);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveHistoryItem = (term: string) => {
    setSearchHistory((prev) => prev.filter((item) => item !== term));
  };

  const handleCardClick = (id: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('details', String(id));
    setSearchParams(newParams);
  };

  const handleDownload = () => {
    downloadCsv(Object.values(selectedItems));
  };

  return (
    <div className="app-content">
      <Search
        initialSearchTerm={urlSearch}
        onSearch={handleSearch}
        isLoading={isLoading}
        searchHistory={searchHistory}
        onRemoveHistoryItem={handleRemoveHistoryItem}
      />
      
      <div className={`main-layout ${isDetailsOpen ? 'with-details' : ''}`}>
        <section className="results-section" id="results-section">
          {isLoading && <Spinner />}
          {!isLoading && error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <>
              <CardList
                characters={characters}
                selectedItems={selectedItems}
                onCardClick={handleCardClick}
                onToggleSelect={toggleItem}
              />
              <Pagination
                currentPage={urlPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </>
          )}
        </section>
        
        {isDetailsOpen && <DetailsPanel />}
      </div>
      
      <ErrorButton />
      <Flyout onDownload={handleDownload} />
    </div>
  );
}

export default App;

export interface CharacterOrigin {
  name: string;
  url: string;
}

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: CharacterOrigin;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiResponse {
  info: ApiInfo;
  results: Character[];
}

export interface SearchProps {
  initialSearchTerm: string;
  onSearch: (term: string) => void;
  isLoading: boolean;
  searchHistory: string[];
  onRemoveHistoryItem: (term: string) => void;
}

export interface SearchState {
  inputValue: string;
  showHistory: boolean;
}

export interface CardProps {
  character: Character;
}

export interface CardListProps {
  characters: Character[];
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorButtonState {
  shouldThrow: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export interface AppState {
  characters: Character[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  lastSearchedTerm: string;
  searchHistory: string[];
  currentPage: number;
  totalPages: number;
}

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



export interface CardProps {
  character: Character;
  onCardClick?: (id: number) => void;
}

export interface CardListProps {
  characters: Character[];
  onCardClick?: (id: number) => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}



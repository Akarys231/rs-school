import Card from './Card';
import type { CardListProps } from '../types';
import './CardList.css';

function CardList({ characters, onCardClick }: CardListProps) {
  if (characters.length === 0) {
    return (
      <div className="cardlist-empty" id="no-results">
        <h3 className="empty-title">No characters found</h3>
        <p className="empty-text">
          Try a different search term or clear the search to browse all characters.
        </p>
      </div>
    );
  }

  return (
    <div className="cardlist-grid" id="results-grid">
      {characters.map((character) => (
        <Card
          key={character.id}
          character={character}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}

export default CardList;

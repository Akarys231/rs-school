import type { CardProps } from '../types';
import './Card.css';

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'alive':
      return '#10b981';
    case 'dead':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

function Card({ character, onCardClick }: CardProps) {
  const statusColor = getStatusColor(character.status);

  const handleClick = () => {
    onCardClick?.(character.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCardClick?.(character.id);
    }
  };

  return (
    <article
      className="card"
      id={`card-${character.id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onCardClick ? 0 : undefined}
      role={onCardClick ? 'button' : undefined}
      aria-label={onCardClick ? `View details for ${character.name}` : undefined}
    >
      <div className="card-image-wrapper">
        <img
          className="card-image"
          src={character.image}
          alt={character.name}
          loading="lazy"
        />
        <span
          className="card-status-badge"
          style={{ backgroundColor: statusColor }}
        >
          {character.status}
        </span>
      </div>
      <div className="card-body">
        <h3 className="card-name">{character.name}</h3>
        <p className="card-description">
          {character.species}
          {character.type ? ` · ${character.type}` : ''}
          {' — '}
          {character.gender}
        </p>
        <div className="card-meta">
          <div className="card-meta-item">
            <span className="card-meta-label">Origin</span>
            <span className="card-meta-value">{character.origin.name}</span>
          </div>
          <div className="card-meta-item">
            <span className="card-meta-label">Location</span>
            <span className="card-meta-value">{character.location.name}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default Card;

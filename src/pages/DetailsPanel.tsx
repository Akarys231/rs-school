import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCharacterById } from '../api';
import type { Character } from '../types';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

function DetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsIdStr = searchParams.get('details');
  const detailsId = detailsIdStr ? parseInt(detailsIdStr, 10) : null;

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailsId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchCharacterById(detailsId)
      .then((data) => {
        if (isMounted) {
          setCharacter(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch character details.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [detailsId]);

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('details');
    setSearchParams(newParams);
  };

  if (!detailsId) {
    return null;
  }

  return (
    <aside style={{
      width: '350px',
      borderLeft: '1px solid var(--border)',
      padding: '20px',
      backgroundColor: 'var(--bg-secondary)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--text-h)' }}>Character Details</h2>
        <button 
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            lineHeight: '1',
            cursor: 'pointer',
            color: 'var(--text)',
            padding: '0 5px'
          }}
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      {isLoading && <Spinner />}
      
      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && character && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <img 
            src={character.image} 
            alt={character.name} 
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
          />
          
          <div>
            <h3 style={{ fontSize: '24px', margin: '0 0 5px', color: 'var(--text-h)' }}>{character.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: character.status.toLowerCase() === 'alive' ? '#10b981' : character.status.toLowerCase() === 'dead' ? '#ef4444' : '#6b7280'
              }}></span>
              <span style={{ fontWeight: 'bold' }}>{character.status}</span>
              <span>- {character.species}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text)', textTransform: 'uppercase' }}>Gender</span>
                <div style={{ fontSize: '15px', color: 'var(--text-h)' }}>{character.gender}</div>
              </div>
              
              {character.type && (
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text)', textTransform: 'uppercase' }}>Type</span>
                  <div style={{ fontSize: '15px', color: 'var(--text-h)' }}>{character.type}</div>
                </div>
              )}

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text)', textTransform: 'uppercase' }}>Last known location</span>
                <div style={{ fontSize: '15px', color: 'var(--text-h)' }}>{character.location.name}</div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text)', textTransform: 'uppercase' }}>First seen in</span>
                <div style={{ fontSize: '15px', color: 'var(--text-h)' }}>{character.origin.name}</div>
              </div>
              
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text)', textTransform: 'uppercase' }}>Episodes</span>
                <div style={{ fontSize: '15px', color: 'var(--text-h)' }}>{character.episode.length} episode(s)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default DetailsPanel;

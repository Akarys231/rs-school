import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '72px', margin: '0 0 20px', color: 'var(--red)' }}>404</h1>
      <h2 style={{ marginBottom: '30px' }}>Page Not Found</h2>
      <p style={{ marginBottom: '40px', color: 'var(--text)' }}>
        Oops! The page you are looking for does not exist in this multiverse.
      </p>
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--blue)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Go Back
      </button>
    </div>
  );
}

export default NotFoundPage;

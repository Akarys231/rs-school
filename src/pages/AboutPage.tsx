function AboutPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>About This App</h1>
      <p style={{ marginTop: '20px', fontSize: '18px', color: 'var(--text)' }}>
        This application is created by a developer to explore the Rick & Morty universe.
      </p>
      <div style={{ marginTop: '30px' }}>
        <a 
          href="https://rs.school/react/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'var(--blue)', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}
        >
          Check out the RS School React Course
        </a>
      </div>
    </div>
  );
}

export default AboutPage;

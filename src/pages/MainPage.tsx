import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ErrorBoundary from '../components/ErrorBoundary';

function MainPage() {
  return (
    <div className="app-layout">
      <Navigation />
      <ErrorBoundary>
        <main className="main-content">
          <Outlet />
        </main>
      </ErrorBoundary>
    </div>
  );
}

export default MainPage;

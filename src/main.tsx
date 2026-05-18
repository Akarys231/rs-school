import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <App />, // App currently holds search, list, etc.
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

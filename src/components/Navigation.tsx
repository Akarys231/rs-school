import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="main-navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;

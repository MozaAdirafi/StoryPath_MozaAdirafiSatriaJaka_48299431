// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/">StoryPath</Link>
        </div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:underline">
            Home
          </Link>
          <Link to="/projects" className="text-white hover:underline">
            Projects
          </Link>
          <Link to="/projects/new" className="text-white hover:underline">
            Add Project
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

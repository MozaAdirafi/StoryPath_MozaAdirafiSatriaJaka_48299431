import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProjectsList from './pages/ProjectsList';
import ProjectForm from './pages/ProjectForm';
import LocationsList from './pages/LocationsList';
import LocationForm from './pages/LocationForm';
import Preview from './pages/Preview';  // Import the Preview page
import Navbar from './component/Navbar';
import Footer from './component/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectForm />} />
            <Route path="/projects/:id/locations" element={<LocationsList />} />
            <Route path="/projects/:projectId/locations/new" element={<LocationForm />} />
            <Route path="/projects/:projectId/locations/:id/edit" element={<LocationForm />} />
            {/* Add a route for the Preview page */}
            <Route path="/projects/:projectId/preview" element={<Preview />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../api';
import { useNavigate } from 'react-router-dom';


/**
 * Projects List component.
 * Fetches and displays a list of projects with options to view, edit, or delete.
 *
 * @returns {JSX.Element} A page that lists all projects and provides project management actions.
 */


const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

   /**
   * Handles project deletion.
   * Removes a project from the list without page refresh.
   * 
   * @param {number} id - The ID of the project to delete.
   */
  const handleDelete = async (id) => {
    try {
      await deleteProject(id); 
      window.location.reload();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };


   /**
   * Navigates to the list of locations for the selected project.
   * 
   * @param {number} id - The ID of the project.
   */

  const handleViewLocations = (id) => {
    navigate(`/projects/${id}/locations`); // Direct to the list of locations for this project
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="bg-white shadow-md p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{project.title}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
              {/* Published/Not Published Badge */}
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  project.is_published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {project.is_published ? 'Published' : 'Not Published'}
              </span>
            </div>
            <div className="mt-4 space-x-4">
              <a
                href={`/projects/${project.id}`}
                className="text-blue-500 hover:underline"
              >
                Edit Project
              </a>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-500 hover:underline"
              >
                Delete Project
              </button>
              <button
                onClick={() => handleViewLocations(project.id)}
                className="text-green-500 hover:underline"
              >
                View Locations
              </button>
            </div>
          </li>
        ))}
      </ul>
      <a
        href="/projects/new"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mt-8 inline-block"
      >
        Add New Project
      </a>
    </div>
  );
};

export default ProjectsList;

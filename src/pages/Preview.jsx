import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLocationsByProjectId, getProjectById } from '../api';

/**
 * Preview component.
 * Displays a preview of the project and its locations.
 *
 * @returns {JSX.Element} A page that previews the locations and their clues for the selected project.
 */



const Preview = () => {
  const { projectId } = useParams();
  const [locations, setLocations] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [initialClue, setInitialClue] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [homescreenDisplay, setHomescreenDisplay] = useState('Display initial clue'); // Manage homescreen display option

  useEffect(() => {
    console.log("Project ID:", projectId);
    
    const fetchLocations = async () => {
      try {
        const locationData = await getLocationsByProjectId(projectId);
        console.log('Fetched locations:', locationData); // Check the structure of locationData
        if (locationData && locationData.length > 0) {
          setLocations(locationData); // Set locations if data exists
          const total = locationData.reduce((acc, location) => acc + location.score_points, 0);
          setTotalPoints(total); // Calculate total points from all locations
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchProjectDetails = async () => {
      try {
        const projectData = await getProjectById(projectId);
        if (projectData && projectData.length > 0) {
          setProjectName(projectData[0].title); // Set the project name
          setProjectDescription(projectData[0].description); // Set the project description
          setInitialClue(projectData[0].initial_clue); // Set the initial clue
          setHomescreenDisplay(projectData[0].homescreen_display); // Set the homescreen display option
          setCurrentLocation(-1); // Initially show the Home Screen option
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchLocations();
    fetchProjectDetails();
  }, [projectId]);

  const handleScanLocation = (locationId) => {
    if (locationId === -1) {
      setCurrentLocation(-1); // Set Home Screen
      return;
    }
    // Check if the location is already visited
    if (!visitedLocations.includes(locationId)) {
      const location = locations.find(loc => loc.id === locationId);
      setVisitedLocations([...visitedLocations, locationId]);
      setPoints(points + location.score_points);
      setCurrentLocation(location); // Move to the scanned location
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">Exploring {projectName} - Preview</h1>

      <div className="bg-white shadow-lg p-6 rounded-lg max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4 bg-purple-600 text-white p-2 rounded">
          {projectName}
        </h2>
        <p className="text-lg font-semibold">Instructions</p>
        <p className="text-gray-600 mb-4">
          Welcome to the {projectName} location experience app. Follow the clues and scan the QR codes once you reach the correct location.
        </p>
        
        {/* Home Screen Logic */}
        {currentLocation === -1 ? (
          homescreenDisplay === 'Display initial clue' ? (
            // Display initial clue if "Display initial clue" is selected in homescreen display
            <div>
              <h3 className="text-lg font-semibold">Initial Clue</h3>
              <p className="text-gray-600 mb-6">{initialClue}</p>
            </div>
          ) : homescreenDisplay === 'Display all locations' ? (
            // Display all locations if "Display all locations" is selected in homescreen display
            <div>
              <h3 className="text-lg font-semibold">All Locations</h3>
              <ul className="text-gray-600 mb-6">
                {locations.map(location => (
                  <li key={location.id}>{location.location_name}</li>
                ))}
              </ul>
            </div>
          ) : null
        ) : currentLocation ? (
          // Display selected location's clue and location content
          <div>
            <h3 className="text-lg font-semibold">Clue</h3>
            <p className="text-gray-600 mb-6">{currentLocation.clue}</p>
            {/* Display location content */}
            {currentLocation.location_content && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-md font-semibold">Location Content</h4>
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: currentLocation.location_content }} />
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-600 text-white p-4 rounded-lg text-center">
            <h4 className="text-lg font-bold">Points</h4>
            <p>{points} / {totalPoints}</p>
          </div>
          <div className="bg-purple-600 text-white p-4 rounded-lg text-center">
            <h4 className="text-lg font-bold">Locations Visited</h4>
            <p>{visitedLocations.length} / {locations.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-lg font-semibold mb-2">Change Locations to Test Scoring:</label>
        <select
          className="border border-gray-300 p-2 rounded"
          onChange={(e) => handleScanLocation(Number(e.target.value))}
          value={currentLocation === -1 ? -1 : currentLocation?.id || ''}
        >
          {/* Home Screen Option */}
          <option value="-1">Home Screen</option>
          {locations.length > 0 ? (
            locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name}
              </option>
            ))
          ) : (
            <option value="">No Locations Available</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default Preview;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createLocation, updateLocation, getLocationById } from '../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Required for leaflet's default map styling

/**
 * Location Form component.
 * Handles creating a new location or editing an existing one for a project.
 * 
 * @returns {JSX.Element} A form to create or update a location.
 */


// Custom Leaflet Marker Icon Fix (Optional)
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const LocationForm = () => {
  const { id: locationId, projectId } = useParams(); // Get locationId and projectId from the URL
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('Location Entry');
  const [position, setPosition] = useState({ lat: -27.4977, long: 153.0129 }); // Default position (Jakarta)
  const [points, setPoints] = useState('');
  const [clue, setClue] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('s4829943');
  const navigate = useNavigate();

  useEffect(() => {
    if (locationId) {
      const fetchLocation = async () => {
        try {
          const locationData = await getLocationById(locationId);
          if (locationData.length > 0) {
            const loc = locationData[0];
            setName(loc.location_name);
            setTrigger(loc.location_trigger);

            // Handle extracting lat/long from the stored location
            const location_position = loc.location_position.replace(/[()]/g, '');
            const [lat, long] = location_position.split(',').map(coord => coord.trim());

            // Ensure lat and long are valid numbers
            if (!isNaN(lat) && !isNaN(long)) {
              setPosition({ lat: parseFloat(lat), long: parseFloat(long) });
            } else {
              setPosition({ lat: -27.4977, long: 153.0129 }); // Default to UQ 
            }

            setPoints(loc.score_points);
            setClue(loc.clue);
            setContent(loc.location_content);
          }
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      };
      fetchLocation();
    }
  }, [locationId]);


    /**
   * Handles form submission for location creation or update.
   * 
   * @param {Event} e - The form submit event.
   */
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the position as "lat,long"
    const formattedPosition = `${position.lat}, ${position.long}`;

    const newLocation = {
      location_name: name,
      location_trigger: trigger,
      location_position: formattedPosition,
      score_points: parseInt(points, 10),
      clue,
      location_content: content,
      project_id: projectId,
      username: username,
    };
    console.log("data:", newLocation);
    try {
      if (locationId) {
        // Update location
        await updateLocation(locationId, newLocation);
      } else {
        // Create new location
        await createLocation(newLocation);
      }
      navigate(`/projects/${projectId}/locations`); // Navigate back to the location list
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  // Function to handle map click
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setPosition({ lat: e.latlng.lat, long: e.latlng.lng });
      },
    });
    return <Marker position={[position.lat, position.long]}></Marker>;
  };

  // Toolbar options for React Quill
  const toolbarOptions = [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'], // link and image, others as per the screenshot
    [{ 'align': [] }],
    ['clean'], // remove formatting button
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">{locationId ? 'Edit' : 'Add'} Location</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg">

        {/* Location Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Location Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Location Trigger */}
        <div className="mb-4">
          <label className="block text-gray-700">Location Trigger</label>
          <select
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="Location Entry">Location Entry</option>
            <option value="QR Code Scan">QR Code</option>
            <option value="Both Location Entry and QR Code Scan">Both</option>
          </select>
        </div>

        {/* Location Picker */}
        <div className="mb-4">
          <label className="block text-gray-700">Select Location on Map (Latitude, Longitude)</label>
          <MapContainer
            center={[position.lat, position.long]}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
            key={position.lat + '-' + position.long}  // Ensure map re-renders when position changes
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationPicker />
          </MapContainer>
        </div>

        {/* Latitude and Longitude */}
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={position.lat || ''}
            onChange={(e) => setPosition({ ...position, lat: parseFloat(e.target.value) })}
            placeholder="Latitude"
            className="w-1/2 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            value={position.long || ''}
            onChange={(e) => setPosition({ ...position, long: parseFloat(e.target.value) })}
            placeholder="Longitude"
            className="w-1/2 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Points for Reaching Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Points for Reaching Location</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Clue */}
        <div className="mb-4">
          <label className="block text-gray-700">Clue</label>
          <textarea
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        {/* Location Content (React Quill Rich Text Editor) */}
        <div className="mb-4">
          <label className="block text-gray-700">Location Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{ toolbar: toolbarOptions }}  // Use the custom toolbar options
            className="border border-gray-300 rounded"
          />
          <small className="text-gray-500">Provide additional content that will be displayed when participants reach this location.</small>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Location
        </button>
      </form>
    </div>
  );
};

export default LocationForm;

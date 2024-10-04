import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocationsByProjectId, deleteLocation, getProjectById } from '../api';
import QRCode from 'react-qr-code'; // Importing the QR Code generator library

// Modal Component to display QR codes in a popup
const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 max-h-full overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const LocationsList = () => {
  const { id: projectId } = useParams(); // Get project ID from the URL
  const [locations, setLocations] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [showModal, setShowModal] = useState(false); // State to manage the modal visibility
  const [showAllQrCodes, setShowAllQrCodes] = useState(false); // State to show all QR codes
  const [selectedLocation, setSelectedLocation] = useState(null); // Store selected location for QR code
  const navigate = useNavigate();
  const printRef = useRef(); // Ref to store the printable QR code

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationData = await getLocationsByProjectId(projectId);
        setLocations(locationData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const fetchProjectName = async () => {
      try {
        const projectData = await getProjectById(projectId);
        if (projectData.length > 0) {
          setProjectName(projectData[0].title);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchLocations();
    fetchProjectName(); // Fetch the project name
  }, [projectId]);

  const handleDelete = async (locationId) => {
    try {
      await deleteLocation(locationId);
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== locationId)
      );
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handlePrintQrCode = (location) => {
    setSelectedLocation(location); // Set the selected location to display the QR code
    setShowModal(true); // Show the modal
  };

  const handlePrintAllQrCodes = () => {
    setShowAllQrCodes(true); // Show all QR codes modal
    setShowModal(true); // Show the modal
  };

  // This function will trigger the printing of the selected QR code
  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const newWindow = window.open('', '', 'width=600,height=400');
      newWindow.document.write(printContent);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
      newWindow.close();
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedLocation(null); // Clear the selected location
    setShowAllQrCodes(false); // Reset showAllQrCodes state
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Exploring {projectName} - Locations</h1>
        <div className="space-x-4">
          <button
            onClick={handlePrintAllQrCodes}  // Show all QR codes in modal
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600"
          >
            Print QR Codes for All
          </button>
          <button
            onClick={() => navigate(`/projects/${projectId}/preview`)}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
          >
            Preview
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate(`/projects/${projectId}/locations/new`)}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mb-6"
      >
        Add Location
      </button>

      <ul className="space-y-6">
        {locations.map((location) => (
          <li key={location.id} className="bg-white shadow-lg p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">{location.location_name}</h2>
                <p className="text-gray-600"><strong>Trigger:</strong> {location.location_trigger}</p>
                <p className="text-gray-600"><strong>Position:</strong> ({location.location_position})</p>
                <p className="text-gray-600"><strong>Points:</strong> {location.score_points}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate(`/projects/${projectId}/locations/${location.id}/edit`)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={() => handlePrintQrCode(location)}  // Show QR code in modal
                  className="text-yellow-500 hover:underline"
                >
                  Print QR Code
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal to display the QR codes */}
      <Modal show={showModal} onClose={closeModal}>
        {/* If a single location is selected, show its QR code */}
        {selectedLocation && !showAllQrCodes && (
          <div className="text-center" ref={printRef}>
            <h2 className="text-xl font-bold mb-4">{selectedLocation.location_name}</h2>
            <QRCode
              value={JSON.stringify({
                location_name: selectedLocation.location_name,
                location_position: selectedLocation.location_position,
              })}
            />
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handlePrint} // Print the single QR code
            >
              Print QR Code
            </button>
          </div>
        )}

        {/* If showAllQrCodes is true, show all QR codes */}
        {showAllQrCodes && (
          <div ref={printRef}>
            <h2 className="text-xl font-bold mb-4">QR Codes for All Locations</h2>
            <div className="grid grid-cols-2 gap-4">
              {locations.map((location) => (
                <div key={location.id} className="bg-white shadow-md p-4 rounded-lg text-center">
                  <h3 className="text-lg font-bold mb-2">{location.location_name}</h3>
                  <QRCode
                    value={JSON.stringify({
                      location_name: location.location_name,
                      location_position: location.location_position,
                    })}
                  />
                </div>
              ))}
            </div>
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handlePrint} // Print all QR codes
            >
              Print All QR Codes
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LocationsList;

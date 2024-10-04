import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProject, getProjectById, updateProject } from '../api';

/**
 * Project Form component.
 * Handles creating a new project or editing an existing one.
 * 
 * @returns {JSX.Element} A form to create or update a project.
 */


const ProjectForm = () => {
  const { id } = useParams(); // Get the project ID from the URL if it exists
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [initialClue, setInitialClue] = useState('');
  const [homescreenDisplay, setHomescreenDisplay] = useState('Display initial clue');
  const [participantScoring, setParticipantScoring] = useState('Not Scored');
  const [isPublished, setIsPublished] = useState(false);
  const [numberOfScannedQrCodes, setNumberOfScannedQrCodes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch project data if we are in edit mode (if id is available)
      const loadProject = async () => {
        try {
          const project = await getProjectById(id);
          if (project.length > 0) {
            setTitle(project[0].title);
            setDescription(project[0].description);
            setInstructions(project[0].instructions);
            setInitialClue(project[0].initial_clue);
            setHomescreenDisplay(project[0].homescreen_display);
            setParticipantScoring(project[0].participant_scoring);
            setIsPublished(project[0].is_published);
            setNumberOfScannedQrCodes(project[0].number_of_scanned_qr_codes || '');
          }
        } catch (error) {
          console.error('Error fetching project:', error);
        }
      };
      loadProject();
    }
  }, [id]);

   /**
   * Handles the submission of the project form.
   * Creates or updates a project based on the form data.
   * 
   * @param {Event} e - The form submit event.
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      title: title || 'Untitled Project',  // Ensure title is provided
      description: description || '',
      is_published: !!isPublished,         // Ensure is_published is a boolean
      participant_scoring: participantScoring || 'Not Scored', // Default to 'Not Scored' if not provided
      username: 's4829943',                // Ensure the username is sent
      instructions: instructions || '',
      initial_clue: initialClue || '',
      homescreen_display: homescreenDisplay || 'Display initial clue',
      // number_of_scanned_qr_codes: numberOfScannedQrCodes ? parseInt(numberOfScannedQrCodes, 10) : null,
    };

    console.log('Project data being sent:', projectData);

    try {
      if (id) {
        await updateProject(id, projectData);
      } else {
        await createProject(projectData);
      }
      navigate('/projects'); // Redirect to Projects List after creating/updating
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'creating'} project:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Add New'} Project</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="The name of your project"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Provide a brief description of your project. This is not displayed to participants."
          ></textarea>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-gray-700">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Instructions for participants, explaining how to engage with the project."
          ></textarea>
        </div>

        {/* Initial Clue */}
        <div>
          <label className="block text-gray-700">Initial Clue</label>
          <textarea
            value={initialClue}
            onChange={(e) => setInitialClue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="The first clue to start the project. This is optional."
          ></textarea>
        </div>

        {/* Homescreen Display */}
        <div>
          <label className="block text-gray-700">Homescreen Display</label>
          <select
            value={homescreenDisplay}
            onChange={(e) => setHomescreenDisplay(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Display initial clue">Display initial clue</option>
            <option value="Display all locations">Display all locations</option> {/* New Option Added */}
          </select>
        </div>

        {/* Participant Scoring */}
        <div>
          <label className="block text-gray-700">Participant Scoring</label>
          <select
            value={participantScoring}
            onChange={(e) => setParticipantScoring(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Number of Scanned QR Codes">Number of Scanned QR Codes</option>
            <option value="Not Scored">Not Scored</option>
          </select>
        </div>

        {/* Published */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="mr-2"
          />
          <label className="block text-gray-700">Published</label>
        </div>

        {/* Number of Scanned QR Codes */}
        {/* <div>
          <label className="block text-gray-700">Number of Scanned QR Codes</label>
          <input
            type="number"
            value={numberOfScannedQrCodes}
            onChange={(e) => setNumberOfScannedQrCodes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter number of scanned QR codes"
          />
        </div> */}

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          {id ? 'Update' : 'Save'} Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;

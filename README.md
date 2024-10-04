# StoryPath Web Application

StoryPath is a web-based platform that allows users to create, manage, and explore location-based experiences. Users can define projects with specific locations, each containing clues and content that are revealed when the location is reached or a QR code is scanned. The platform provides a dynamic and interactive way to build narratives or educational experiences tied to specific geographical locations.

## Features

### 1. **Project Management**
   - Users can create, edit, view, and delete projects.
   - Projects contain descriptions, instructions, and initial clues.
   - Users can manage project settings, including choosing what is displayed on the home screen (initial clue or all locations).

### 2. **Location Management**
   - Users can create, edit, view, and delete locations tied to a specific project.
   - Each location contains attributes such as:
     - Name
     - Trigger (Location Entry, QR Code, or both)
     - Geographical position (Latitude, Longitude)
     - Points for visiting the location
     - Clue and location content
   - Locations can be listed and managed within each project.

### 3. **QR Code Generation**
   - Each location can be linked to a QR code, which users can print.
   - A QR code can be generated for individual locations or all locations in a project.
   - QR codes are printed directly from the application via the browser’s native print function.

### 4. **Interactive Preview**
   - Users can preview a project and simulate visiting different locations.
   - The preview page shows how clues and content will be displayed as locations are visited.
   - The page includes a scoring system for tracking visited locations and points.

### 5. **Modal for QR Codes**
   - A popup modal is available for viewing and printing QR codes for individual or all locations.
   - The modal can be closed and reopened without leaving the current page, providing a smooth user experience.

## Advanced Feature

### **Location Picker with React Leaflet**
As part of the advanced feature, we have integrated a **Location Picker** using the [React Leaflet](https://react-leaflet.js.org) library. This allows users to select a geographical position for a location directly from an interactive map.

#### Key Details:
- **Map Integration:** 
  The map is displayed using React Leaflet, providing a user-friendly interface for selecting latitude and longitude coordinates.
  
- **Location Selection:**
  When adding or editing a location, users can click on the map to select the exact coordinates (latitude, longitude) for the location. This makes it easy to specify where a location is in the real world.
  
- **Default Position:**
  The map opens with a default position (in this case, Jakarta or UQ), and users can update the position by clicking on the desired location.
  
- **Marker:** 
  A marker is placed on the map at the selected position, visually indicating the chosen coordinates.

## Technologies Used
- **Frontend:** 
  - React.js
  - React Router for routing
  - Tailwind CSS for styling
  - React Leaflet for map integration
  - React Quill for rich text editing
  - react-qr-code for QR code generation
  - HTML5 and CSS3
- **Backend:**
  - API hosted on UQCloud.net

## Getting Started

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/storypath.git
    cd storypath
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm start
    ```

4. **Navigate to `http://localhost:3000`** in your browser to view the application.

### Environment Variables

To connect with the API and manage JWT tokens, make sure you update the relevant environment variables in the `src/api.js` file, including:

- `API_BASE_URL`
- `JWT_TOKEN`
- `USERNAME`

## Usage

1. **Create a Project:**
   - Navigate to the "Projects" section and click "Add New Project."
   - Fill in the project details and save it.

2. **Add Locations:**
   - For each project, you can add locations.
   - Use the interactive map to select the latitude and longitude coordinates.

3. **Preview a Project:**
   - Test the project using the "Preview" button. You can simulate visiting different locations and see how the clues and content will be displayed.

4. **Print QR Codes:**
   - You can generate QR codes for each location or all locations and print them directly from the application.

## Conclusion

StoryPath provides an innovative way to build location-based experiences using interactive maps and QR codes. With its intuitive user interface, project and location management features, and advanced map integration using React Leaflet, this platform offers a dynamic way to explore and create geographically bound narratives.
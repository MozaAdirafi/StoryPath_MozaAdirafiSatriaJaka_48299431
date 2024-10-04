/**
 * Landing Page component.
 * Displays a welcome message and a "Get Started" button that redirects users to the projects list.
 * 
 * @returns {JSX.Element} A landing page with a welcome message and a link to start creating projects.
 */

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Hero Image */}
      <div className="mb-8">
        <img 
          src="https://png.pngtree.com/png-vector/20240531/ourmid/pngtree-the-explorer-kids-camping-out-in-the-nature-png-image_12579234.png" 
          alt="Explorer Kids Camping" 
          className="w-full max-w-md mx-auto"
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">Welcome to StoryPath</h1>
        <p className="text-xl text-gray-600 mb-4">Create and explore location-based experiences</p>
        <a
          href="/projects"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default LandingPage;

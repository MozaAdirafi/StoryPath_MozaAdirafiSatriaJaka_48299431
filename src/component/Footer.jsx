// src/components/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-gray-800 p-4 mt-8">
        <div className="container mx-auto text-center text-white">
          <p>&copy; {new Date().getFullYear()} StoryPath. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
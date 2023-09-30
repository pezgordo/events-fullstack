// Componente de Home
import React, { useState, useEffect } from 'react';

function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % numberOfImages);
    }, 3000); // Change image every 3 seconds (adjust as needed)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const numberOfImages = 3; // Adjust based on the number of images

  const imageUrls = [
    'https://img.freepik.com/premium-psd/training-sport-flyer-social-media-post-banner-template_488814-357.jpg?w=900',
    'https://img.freepik.com/free-psd/club-dj-party-flyer-social-media-post_505751-3658.jpg?w=900&t=st=1696027790~exp=1696028390~hmac=2e612a49b9eacdcfc9efbe4e99690cde6d803415b4a5d44c9201a657eb485c66',
    'https://img.freepik.com/premium-vector/summer-food-festival-poster_1340-15727.jpg?w=900',
  ];

  return (
    <div>
      <h1>Bienvenido al Mundo de Eventos!</h1>

      {/* Image Gallery */}
      <div className="image-gallery">
        <img src={imageUrls[currentImage]} 
        alt={`Event Image ${currentImage + 1}`}
        />
        {/* Add more images as needed */}
      </div>

      {/* Footer */}
      <footer>
        <p>Desarrollado por Vicente Zamora</p>
      </footer>
    </div>
  );
}

export default Home;

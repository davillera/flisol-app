import { useEffect, useState } from "react";

function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Cambia la URL por la de tu backend que devuelve las imágenes
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(console.error);
  }, []);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-green-dark font-semibold">
        Cargando imágenes...
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-4 text-center">
        Álbum Virtual
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map(({ id, url }) => (
          <img
            key={id}
            src={url}
            alt="Momento del evento"
            className="rounded-lg shadow-md object-cover w-full h-48"
          />
        ))}
      </div>
    </div>
  );
}

export default Gallery;
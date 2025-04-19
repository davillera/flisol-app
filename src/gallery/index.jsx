import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://flisolfunctionapp.azurewebsites.net/api/getimages");
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.images && Array.isArray(data.images)) {
          setImages(data.images);
        } else {
          throw new Error("Respuesta no contiene el campo 'images' o no es un arreglo");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 font-semibold">
        Cargando imágenes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-semibold">
        Error al cargar imágenes: {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-4 text-center">Álbum Virtual</h2>
      {images.length === 0 ? (
        <p className="text-white text-center">No hay imágenes para mostrar.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Momento del evento ${index + 1}`}
              className="rounded-lg shadow-md object-cover w-full h-48"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}

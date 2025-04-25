import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://flisolfunctionapp.azurewebsites.net/api/getimages");

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data.images)) {
        setImages(data.images);
      } else {
        throw new Error("Respuesta inválida: no contiene 'images' como arreglo");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const response = await fetch("https://flisolfunctionapp.azurewebsites.net/api/uploadimage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();

      // ✅ Asegúrate que 'imageUrl' venga como string
      if (data.imageUrl) {
        setImages((prev) => [...prev, data.imageUrl]);
      } else {
        throw new Error("Respuesta inválida al subir imagen");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 font-semibold">
        Cargando imágenes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 font-semibold text-center px-4">
        <p>Error al cargar imágenes:</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={fetchImages}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-800 min-h-screen text-white">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-center">📸 Álbum Virtual</h2>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/"
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100"
          >
            Volver a cámara
          </Link>
          <button
            onClick={fetchImages}
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100"
          >
            Recargar álbum
          </button>
          <label className="cursor-pointer bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100">
            {uploading ? "Subiendo..." : "Subir nueva imagen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-white">No hay imágenes para mostrar.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((imgUrl, index) => (
            <div key={index} className="bg-white rounded shadow overflow-hidden">
              <img
                src={imgUrl}
                alt={`Foto ${index + 1}`}
                className="object-cover w-full h-48"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

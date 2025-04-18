import './App.css'
import { useState } from "react";
import Gallery from './gallery';
import Welcome from './welcome';
import TakePhoto from './componets/takephoto/takePhoto';

function App() {
  const [showGallery, setShowGallery] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleEnter = () => setShowGallery(true);

  const handleTakePhoto = () => setTakingPhoto(true);

  const handleCancelPhoto = () => setTakingPhoto(false);

  const handleCapturePhoto = (dataUrl) => {
    setCapturedImage(dataUrl);
    setTakingPhoto(false);
    // Aquí puedes enviar la imagen al backend o mostrarla en la galería
    console.log("Foto capturada:", dataUrl);
    alert("Foto capturada! Ahora puedes implementarla para subirla.");
  };

  return (
    <>
      {!showGallery && !takingPhoto && (
        <Welcome onEnter={handleEnter} onTakePhoto={handleTakePhoto} />
      )}

      {takingPhoto && (
        <TakePhoto onCancel={handleCancelPhoto} onCapture={handleCapturePhoto} />
      )}

      {showGallery && <Gallery />}

      {/* Opcional: mostrar la imagen capturada abajo para debug */}
      {capturedImage && (
        <div className="fixed bottom-4 right-4 border border-gray-300 rounded overflow-hidden shadow-lg w-24 h-24">
          <img src={capturedImage} alt="Capturada" className="object-cover w-full h-full" />
        </div>
      )}
    </>
  );
}

export default App;

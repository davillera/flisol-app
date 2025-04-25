import './App.css'
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Gallery from './gallery';
import Welcome from './welcome';
import TakePhoto from './componets/takephoto/takePhoto';

function App() {
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/album");
  };

  const handleTakePhoto = () => {
    setTakingPhoto(true);
  };

  const handleCancelPhoto = () => {
    setTakingPhoto(false);
  };

  const handleCapturePhoto = (dataUrl) => {
    setCapturedImage(dataUrl);
    setTakingPhoto(false);
    // Aquí puedes enviar la imagen al backend o mostrarla en la galería
    console.log("Foto capturada:", dataUrl);
    alert("Foto capturada! Ahora puedes implementarla para subirla.");
  };

  return (
    <>
      {takingPhoto && (
        <TakePhoto onCancel={handleCancelPhoto} onCapture={handleCapturePhoto} />
      )}

      {!takingPhoto && (
        <Routes>
          <Route
            path="/"
            element={<Welcome onEnter={handleEnter} onTakePhoto={handleTakePhoto} />}
          />
          <Route path="/album" element={<Gallery />} />
        </Routes>
      )}
      
    </>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function TakePhoto({ onCancel, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const navigate = useNavigate();

  useEffect(() => {
    async function startCamera() {
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
            audio: false,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          Swal.fire("Error", "No se pudo acceder a la cámara: " + err.message, "error");
        }
      } else {
        Swal.fire("Error", "Tu navegador no soporta acceso a cámara.", "error");
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleCancel = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onCancel();
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    if (width === 0 || height === 0) {
      Swal.fire("Espera", "La cámara aún no está lista. Intenta de nuevo.", "info");
      return;
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    setHasPhoto(true);
  };

  const confirmPhoto = async () => {
    if (!canvasRef.current) return;
    setUploading(true);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        Swal.fire("Error", "Error al generar la imagen.", "error");
        setUploading(false);
        return;
      }

      try {
        const response = await fetch("https://flisolfunctionapp.azurewebsites.net/api/uploadimage", {
          method: "POST",
          headers: {
            "Content-Type": blob.type,
          },
          body: blob,
        });

        if (!response.ok) {
          throw new Error("Error al subir la imagen: " + response.statusText);
        }

        const result = await response.json();

        Swal.fire("¡Éxito!", "La foto se ha subido correctamente.", "success");

        onCapture(result);
        navigate("/album");

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      } finally {
        setUploading(false);
      }
    }, "image/png");
  };

  const retakePhoto = () => {
    setHasPhoto(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 p-4 z-50">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`rounded-lg shadow-lg max-w-full max-h-[70vh] ${hasPhoto ? "hidden" : "block"}`}
      />
      <canvas
        ref={canvasRef}
        className={`rounded-lg shadow-lg max-w-full max-h-[70vh] ${!hasPhoto ? "hidden" : "block"}`}
      />

      {!hasPhoto ? (
        <div className="flex flex-col items-center">
          <button
            onClick={takePhoto}
            className="mt-6 bg-gradient-to-r from-orange to-orange/90 px-8 py-3 rounded-lg font-semibold text-white shadow-lg hover:from-orange/90 hover:to-orange transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange/50"
          >
            Tomar foto
          </button>
          <button
            onClick={() =>
              setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
            }
            className="mt-3 text-white underline focus:outline-none"
          >
            Cambiar cámara
          </button>
          <button
            onClick={handleCancel}
            className="mt-4 text-white underline focus:outline-none"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 mt-6">
          <button
            onClick={confirmPhoto}
            disabled={uploading}
            className="bg-green-light px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:bg-green-light/90 transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-light/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Subiendo..." : "Confirmar"}
          </button>
          <button
            onClick={retakePhoto}
            disabled={uploading}
            className="bg-red-600 px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:bg-red-700 transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Volver a tomar
          </button>
        </div>
      )}
    </div>
  );
}

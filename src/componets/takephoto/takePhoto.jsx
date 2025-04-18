import { useEffect, useRef, useState } from "react";

export default function TakePhoto({ onCancel, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  useEffect(() => {
    async function startCamera() {
      if (
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function"
      ) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          alert("No se pudo acceder a la cámara: " + err.message);
        }
      } else {
        alert("Tu navegador no soporta acceso a cámara.");
      }
    }
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
      alert("La cámara aún no está lista. Intenta de nuevo.");
      return;
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    setHasPhoto(true);
  };

  const confirmPhoto = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onCapture(dataUrl);
  };

  const retakePhoto = () => {
    setHasPhoto(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 p-4 z-50">
      {!hasPhoto ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-lg shadow-lg max-w-full max-h-[70vh]"
          />
          <button
            onClick={takePhoto}
            className="mt-6 bg-gradient-to-r from-orange to-orange/90 px-8 py-3 rounded-lg font-semibold text-white shadow-lg hover:from-orange/90 hover:to-orange transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange/50"
          >
            Tomar foto
          </button>
          <button
            onClick={handleCancel}
            className="mt-4 text-white underline focus:outline-none"
          >
            Cancelar
          </button>

          <canvas ref={canvasRef} className="hidden" />
        </>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-lg max-w-full max-h-[70vh]"
          />
          <div className="flex gap-6 mt-6">
            <button
              onClick={confirmPhoto}
              className="bg-green-light px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:bg-green-light/90 transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-light/50"
            >
              Confirmar
            </button>
            <button
              onClick={retakePhoto}
              className="bg-red-600 px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:bg-red-700 transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-700/50"
            >
              Volver a tomar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

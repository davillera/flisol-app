function Welcome({ onEnter, onTakePhoto }) {
  return (
    <div
      className="
        flex flex-col items-center justify-center 
        min-h-screen 
        bg-gradient-to-br from-green-light via-green-dark to-green-light 
        text-white p-safe-top p-6 space-y-10
        sm:p-8
      "
      style={{
        paddingBottom: "env(safe-area-inset-bottom)", // evita que la barra inferior de Safari tape contenido
      }}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-center drop-shadow-lg max-w-md">
        Comparte tus mejores momentos de la FliSol2025
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button
          onClick={onEnter}
          className="
            pulse-glow
            bg-gradient-to-r from-orange to-orange/90 
            px-8 py-4 rounded-xl font-semibold shadow-xl 
            hover:from-orange/90 hover:to-orange transition 
            transform hover:scale-105 active:scale-95 
            focus:outline-none focus:ring-4 focus:ring-orange/50
            drop-shadow-lg flex-1
          "
          aria-label="Entrar al álbum"
        >
          Entrar al álbum
        </button>

        <button
          onClick={onTakePhoto}
          className="
            bg-gradient-to-r from-blue to-blue/90 
            px-8 py-4 rounded-xl font-semibold shadow-xl 
            hover:from-blue/90 hover:to-blue transition 
            transform hover:scale-105 active:scale-95 
            focus:outline-none focus:ring-4 focus:ring-blue/50
            drop-shadow-lg flex-1
          "
          aria-label="Tomarse una foto"
        >
          Tomarse una foto
        </button>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 10px 0 rgba(245, 130, 32, 0.7);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(245, 130, 32, 1);
          }
        }
        .pulse-glow {
          animation: pulseGlow 2.5s infinite;
        }
      `}</style>
    </div>
  );
}

export default Welcome;

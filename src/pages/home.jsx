import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero-real w-full h-screen flex flex-col justify-center items-center text-center px-6">
      
      <h1 className="text-white font-extrabold text-5xl md:text-6xl leading-tight drop-shadow-2xl">
        AGROVA — The Future of <br /> Farming
      </h1>

      <p className="text-white/90 text-lg md:text-xl mt-4 max-w-2xl drop-shadow-lg">
        Empowering farmers, experts, and the community with modern tools.
      </p>

      <div className="flex gap-6 mt-10">
        <button
          onClick={() => navigate("/login")}
          className="px-7 py-3 bg-white text-gray-900 text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition"
        >
          Get Started
        </button>
        
        <button
          onClick={() => navigate("/about")}
          className="px-7 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

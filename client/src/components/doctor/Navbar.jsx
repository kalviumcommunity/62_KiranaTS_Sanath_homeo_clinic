import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-sm h-20 flex items-center justify-between px-8 border-b border-[#E8E8E8]">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl text-[#2C5E3E]">Doctor Dashboard</h1>
      </div>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2.5 rounded-lg bg-[#2C5E3E] text-white font-medium hover:bg-[#1E4630] transition-all duration-200 shadow-sm flex items-center"
      >
        Home
      </button>
    </div>
  );
}
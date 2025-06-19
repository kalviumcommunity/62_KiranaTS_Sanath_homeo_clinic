import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard-doctor", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Availability", path: "/dashboard-doctor/availability", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Appointments", path: "/doctor/dashboard/appointments", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Recent patients", path: "/doctor/dashboard/patients", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  ];
  
  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0"; // clear token
    navigate("/doctor/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white text-[#2C5E3E] p-6 border-r border-[#E8E8E8] relative">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-[#2C5E3E]">Doctor Panel</h2>
        <div className="w-12 h-1 bg-[#74A280] mt-2"></div>
      </div>

      <nav>
        <ul className="space-y-3">
          {menu.map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              className={`px-4 py-3 rounded-lg cursor-pointer flex items-center transition-all duration-200
                ${location.pathname === item.path
                  ? 'bg-[#2C5E3E] text-white font-medium shadow-sm'
                  : 'hover:bg-[#F2F2F2] text-[#2C5E3E]'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-6 left-0 right-0 px-6">
        <button 
          onClick={handleLogout} 
          className="w-full py-2.5 px-4 rounded-lg border border-[#E8E8E8] text-[#2C5E3E] font-medium bg-[#F2F2F2] transition-all duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
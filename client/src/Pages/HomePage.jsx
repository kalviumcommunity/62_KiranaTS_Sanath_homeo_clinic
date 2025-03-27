export default function Homepage() {
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full shadow-2xl h-38 p-4 flex items-center" style={{ backgroundColor: "#E8E669" }}>

          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="Sanath Homeo Clinic Logo" className="h-auto max-h-20 top-0" />
          </div>

        <div className="flex w-full items-center justify-center gap-3">
          <span className="text-5xl font-bold text-black ml-9" style={{ fontFamily: 'Merriweather' }}>
          SANATH HOMEO CLINIC
          </span>

          <div className="flex gap-7 ml-auto">
            <button className="text-black hover:before:bg-[#0082BA] relative h-[43px] w-32 overflow-hidden border border-bg-[#2CE663] bg-white px-3 text-[#F2F0EF] shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#2CE663] before:transition-all before:duration-500 hover:text-white hover:shadow-[#CB5BCC] hover:before:left-0 hover:before:w-full">
              <span className="relative z-10">About</span>
            </button>
            <button className="text-black hover:before:bg-[#0082BA] relative h-[43px] w-32 overflow-hidden border border-bg-[#2CE663] bg-white px-3 text-[#F2F0EF] shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#2CE663] before:transition-all before:duration-500 hover:text-white hover:shadow-[#CB5BCC] hover:before:left-0 hover:before:w-full">
              <span className="relative z-10">Contact us</span>
            </button>
            <button className="text-black hover:before:bg-[#0082BA] relative h-[43px] w-32 overflow-hidden border border-bg-[#2CE663] bg-white px-3 text-[#F2F0EF] shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#2CE663] before:transition-all before:duration-500 hover:text-white hover:shadow-[#CB5BCC] hover:before:left-0 hover:before:w-full">
              <span className="relative z-10">Login</span>
            </button>

              <button className="text-black hover:before:bg-[#0082BA] relative h-[43px] w-32 overflow-hidden border border-bg-[#2CE663] bg-white px-3 text-[#F2F0EF] shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#2CE663] before:transition-all before:duration-500 hover:text-white hover:shadow-[#CB5BCC] hover:before:left-0 hover:before:w-full">
                <span className="relative z-10">Sign up</span>
              </button>

          </div>
        </div>
      </nav>

    </div>
  );
}

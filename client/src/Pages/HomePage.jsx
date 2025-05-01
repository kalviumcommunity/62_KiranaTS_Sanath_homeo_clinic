import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <>

      <div className="min-h-screen w-full bg-[#CDBD89] flex flex-col overflow-x-hidden">
        {/* Navbar */}
        <nav
          className="fixed top-0 left-0 w-full z-50 p-4 flex flex-col md:flex-row items-center shadow-2xl bg-[#E8E669]"
          style={{ height: "100px" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-2 md:mb-0 md:mr-4">
            <img
              src="/images/logo.png"
              alt="Sanath Homeo Clinic Logo"
              className="h-12 md:h-20 max-w-full"
            />
          </div>

          {/* Title */}
          <div className="flex w-full items-center justify-center gap-3">
            <span className="text-2xl md:text-4xl font-bold text-black text-center" style={{ fontFamily: 'Merriweather' }}>
              SANATH HOMEO CLINIC
            </span>

            {/* Navbar Buttons */}
            <div className="hidden md:flex gap-4 ml-auto">
            {[
                { label: "About", path: "/about" },
                { label: "Contact us", path: "/contact-us" },
                { label: "Login", path: "/coming-soon" },
                { label: "Sign up", path: "/coming-soon" },
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="text-black hover:before:bg-[#0082BA] relative h-[40px] w-24 overflow-hidden border border-[#2CE663] bg-white px-2 text-center text-sm shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#2CE663] before:transition-all before:duration-500 hover:text-white hover:shadow-[#CB5BCC] hover:before:left-0 hover:before:w-full flex items-center justify-center"
                >
                  <span className="relative z-10">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center pt-40 md:pt-50 px-4 md:px-6 gap-20">
          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            Our Branches
          </h1>

          {/* Branch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-4 w-full">
            {[
              { name: "Horamavu", link: "/horamavu", doctor: "Dr. Hema Sanath" },
              { name: "Kammanahalli", link: "/kammanahalli", doctor: "Dr. Sanath Kumar" },
              { name: "Hennur", link: "/hennur" }
            ].map((branch) => (
              <div
                key={branch.name}
                className={`bg-white rounded-xl p-14 flex flex-col items-center justify-between transition-transform duration-300 ${
                  branch.name === "Kammanahalli"
                    ? "shadow-2xl transform scale-105"
                    : "shadow-xl"
                } hover:scale-110`}
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-black">
                  {branch.name} Branch
                </h2>

                <img
                  src={`/images/${branch.name}.png`}
                  alt={`${branch.name} Clinic`}
                  className="rounded-lg h-40 w-full object-cover mb-6"
                />

                {branch.doctor && (
                  <h3 className="text-xl md:text-1xl font-bold mb-4 text-center text-black">
                    {branch.doctor}
                  </h3>
                )}

                <Link
                  to={branch.link}
                  className="bg-[#2CE663] hover:bg-[#2CE663] text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                >
                  Contact Us
                </Link>
              </div>
            ))}
          </div>

          {/* Small screen navbar buttons */}
          <div className="flex md:hidden gap-4 mt-8">
              {[
                { label: "About", path: "/about" },
                { label: "Contact us", path: "/contact-us" },
                { label: "Login", path: "/coming-soon" },
                { label: "Sign up", path: "/coming-soon" },
              ].map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  className="text-black hover:before:bg-[#0082BA] relative h-[40px] w-24 overflow-hidden border border-[#2CE663] bg-white px-2 text-center text-sm shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-[#2CE663] before:transition-all before:duration-500 hover:text-white hover:shadow-[#CB5BCC] hover:before:left-0 hover:before:w-full flex items-center justify-center"
                >
                  <span className="relative z-10">{label}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

import { Link } from "react-router-dom";

export default function ContactUs() {
    const clinics = [
        {
            name: "Kammanahalli Clinic",
            phone: "+91 84316 65346",
            email: "kammanahalli@sanathhomeoclinic.com",
            address: "Kammanahalli Main Road, above Domino's Pizza, Bengaluru, Karnataka 560084",
            mapLink: "https://www.google.com/maps?q=sanath+homeo+clinic+kammanahalli",
            timings: "10AM-2PM, 5PM-9PM (Closed Sun)",
        },
        {
            name: "Horamavu Clinic",
            phone: "+91 94496 53483, +91 80953 11163",
            email: "horamavu@sanathhomeoclinic.com",
            address: "Near Horamavu Agara Bus Stop, 3rd Cross Rd, Kallumantapa, Horamavu, Bengaluru, Karnataka 560043",
            mapLink: "https://www.google.com/maps?q=sanath+homeo+clinic+horamavu",
            timings: "10AM–1:30PM, 6:30PM–8PM (Closed Sun)",
        },
        {
            name: "Hennur Clinic",
            phone: "+91 84316 65346",
            email: "hennur@sanathhomeoclinic.com",
            address: "Sree, Byraveshwara Layout, 85, 2nd Main Rd, Hennur Bande, Hennur Gardens, Bengaluru, Karnataka 560043",
            mapLink: "https://www.google.com/maps?s=web&lqi=CiFzYW5hdGggaG9tZW8gY2xpbmljIGhlbm51ciBicmFuY2haLSIhc2FuYXRoIGhvbWVvIGNsaW5pYyBoZW5udXIgYnJhbmNoKggIAhAAEAEQApIBCWhvbWVvcGF0aKoBSxABMiAQASIcu2oZ4rLVUuZ-pT6abI8YlLQJldGQ3LI0EtAymTIlEAIiIXNhbmF0aCBob21lbyBjbGluaWMgaGVubnVyIGJyYW5jaA",
            timings: "On Appointment (Closed Sun)",
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#CDBD89] flex flex-col items-center pt-32 pb-20 px-4 md:px-8">
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
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10" style={{ fontFamily: 'Merriweather' }}>Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl text-gray-600 ">
                {clinics.map((clinic, index) => (
                    <div key={index} className="bg-white rounded-xl p-14 flex flex-col items-center justify-between transition-transform duration-300 transform hover:scale-105">
                        <h2 className="text-2xl font-bold text-[#2CE663] text-center">{clinic.name}</h2>
                        <p><b>📞:</b> {clinic.phone}</p>
                        <p><b>✉️:</b> {clinic.email}</p>
                        <p><b>🕙:</b> {clinic.timings}</p>
                        <p><b>📍:</b> {clinic.address}</p>
                        <a
                            href={clinic.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block bg-[#2CE663] hover:bg-[#2CE663]/90 text-white font-semibold py-2 px-4 rounded-full text-sm text-center"
                        >
                            Open in Google Maps
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

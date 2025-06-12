import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Navbar from "../components/NavBar";
import Carousel from "../components/Carousel";
import TreatmentsOffered from "../components/TreatmentsOffered";
import Branches from "../components/Branches";
import CountUpNumber from "../components/CountUpComponent";
import Doctors from "../components/Doctors";

export default function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();
    const { ref: aboutRef, inView: aboutInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  

useEffect(() => {
  if (location.hash === "#branches") {
    const el = document.getElementById("branches");
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  } else if (location.hash === "#doctors") {
    const el = document.getElementById("doctors");
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }
}, [location]);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero / Carousel Section */}
      <main className="container mx-auto px-4 py-8">
        <Carousel />
      </main>

      {/* Treatments Section */}
      <section className="px-4">
        {/* Mobile Button */}
        <button
          onClick={() => navigate("/treatments")}
          className="sm:hidden w-full mb-6 px-5 py-3 bg-[#CC7A47] text-white rounded-md font-semibold shadow-md"
        >
          Treatments Offered
        </button>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="mb-6">
            <h2 className="text-[#C08A69] text-4xl font-['Poppins'] font-semibold">
              Treatments <span className="font-normal">offered</span>
            </h2>
            <div className="w-20 h-1 bg-[#C08A69]"></div>
          </div>
          <TreatmentsOffered />
        </div>
      </section>

      {/* Branches Section */}
      <section className="px-4">
        {/* Mobile Button */}
        <button
          onClick={() => navigate("/branches")}
          className="sm:hidden w-full mb-6 px-5 py-3 bg-[#429DAB] text-white rounded-md font-semibold shadow-md"
        >
          Our Branches
        </button>

        {/* Desktop View */}
        <div className="hidden sm:block" id="branches">
          <div className="mb-6">
            <h2 className="text-[#429DAB] text-4xl font-['Poppins'] font-normal">
              Our <span className="font-semibold">Branches</span>
            </h2>
            <div className="w-20 h-1 bg-[#429DAB]"></div>
          </div>
          <Branches />
        </div>
      </section>

      <section ref={aboutRef}className="px-4 py-12 max-w-4xl mx-auto">
          <div className="mb-10">
              <h2 className="text-4xl font-semibold text-[#2C5E3E] font-['Poppins'] mb-4">
                  <span className="font-semibold">About</span>
                  <span className="font-light"> Us</span>
              </h2>
              <div className="w-20 h-1 bg-[#74A280]"></div>
          </div>

          <div className="space-y-6 text-[#333333] leading-relaxed">
              <p className="text-lg">
                  Sanath Homeopathy Clinics—with locations in Horamavu, Hennur, and Kammanahalli—are 
                  <span className="font-medium"> centers of excellence in classical and predictive homeopathy</span>. 
                  Under the expert guidance of Dr. Sanathkumar and Dr. Hema Sanath, our clinics have 
                  delivered compassionate care and clinical excellence to the Bangalore community for 
                  over two decades.
              </p>

              <p className="text-lg">
                  Our <span className="font-medium">patient-centered approach</span> creates healing environments 
                  where individuals feel genuinely heard and supported. We specialize in treating 
                  everything from acute conditions to complex chronic ailments—including cases often 
                  considered challenging in other medical systems—through our whole-person methodology 
                  that addresses physical, emotional, and mental wellbeing.
              </p>

              <p className="text-lg">
                  Recognized for our <span className="font-medium">ethical practice standards</span> and 
                  <span className="font-medium"> evidence-based results</span>, Sanath Homeopathy Clinics have become 
                  trusted healthcare partners for generations of families. Our patients return not only 
                  for treatment but for the lasting relationships and hope we cultivate through 
                  personalized care.
              </p>
          </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-[#2C5E3E]">
              <CountUpNumber end={25} shouldStart={aboutInView} />+
            </div>
            <div className="text-sm uppercase tracking-wider text-[#74A280]">Years Experience</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-[#2C5E3E]">
              <CountUpNumber end={3} shouldStart={aboutInView} />
            </div>
            <div className="text-sm uppercase tracking-wider text-[#74A280]">Clinics</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-[#2C5E3E]">
              <CountUpNumber end={10000} shouldStart={aboutInView} />+
            </div>
            <div className="text-sm uppercase tracking-wider text-[#74A280]">Patients Treated</div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="px-4">
        {/* Mobile Button */}
        <button
          onClick={() => navigate("/doctors")}
          className="sm:hidden w-full mb-6 px-5 py-3 bg-[#7384B0] text-white rounded-md font-semibold shadow-md"
        >
          Our Doctors
        </button>

        {/* Desktop View */}
        <div className="hidden sm:block" id="doctors">
          <div className="mb-6">
            <h2 className="text-[#7384B0] text-4xl font-['Poppins'] font-normal">
              Our <span className="font-semibold">Doctors</span>
            </h2>
            <div className="w-20 h-1 bg-[#7384B0]"></div>
          </div>
          <Doctors/>
        </div>
      </section>
    </div>
  );
}

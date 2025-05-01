import { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const branches = [
  {
    name: 'Horamavu',
    images: ['/images/Horamavu.png'],
  },
  {
    name: 'Kammanahalli',
    images: ['images/Kammanahalli.png'],
  },
  {
    name: 'Hennur',
    images: ['/images/hennur1.jpg', '/images/hennur2.jpg'],
  },
];

const Carousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  const nextImage = () => setIndex((index + 1) % images.length);
  const prevImage = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-lg shadow-lg">
      <motion.img 
        key={index}
        src={images[index]} 
        alt={`Clinic ${index + 1}`} 
        className="w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md transition-all"
      >
        ‹
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md transition-all"
      >
        ›
      </button>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        {images.map((_, i) => (
          <div 
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function AboutUs() {
  return (
    <div className="min-h-screen w-full bg-[#CDBD89] flex flex-col">
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
      <motion.section 
        className="py-20 px-4  text-gray-800 mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold text-center mb-8 text-[#2C3E50]"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Sanath Homeopathy Clinics
        </motion.h1>

        <motion.div 
          className="max-w-3xl mx-auto text-center text-gray-700 mb-12 leading-relaxed text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="mb-6">
            Sanath Homeopathy Clinics—located in Horamavu, Hennur, and Kammanahalli—are centers of healing
            rooted in the science and philosophy of classical and predictive homeopathy. Guided by the
            experienced hands of Dr. Sanathkumar and Dr. Hema Sanath, these clinics have been serving the
            community with compassion and integrity for nearly two decades.
          </p>
          <p className="mb-6">
            Each clinic is designed to offer a warm, welcoming space where patients feel heard, supported,
            and understood. Whether it's a common cold, chronic allergy, or a condition deemed incurable
            by other systems, the doctors believe in treating the individual as a whole—addressing not just
            physical symptoms, but emotional and mental well-being too.
          </p>
          <p>
            With a strong foundation in personalized care, ethical practice, and proven results, Sanath
            Homeopathy Clinics have earned the trust of countless families across Bangalore. Patients
            return not just for treatment, but for the sense of hope and healing they find here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {branches.map((branch, i) => (
            <motion.div 
              key={branch.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-4 text-center text-[#2C3E50] border-b pb-2">
                  {branch.name}
                </h2>
                <Carousel images={branch.images} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
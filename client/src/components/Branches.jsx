import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("/api/doctors");
        const data = response.data.doctors;

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected array of doctors");
        }

        const branchData = data.flatMap(doctor => {
          const branches = Array.isArray(doctor.branch) ? doctor.branch : [doctor.branch];
          return branches.map(branchName => ({
            name: branchName,
            doctor: doctor.name,
            link: `/${branchName.toLowerCase().replace(/\s+/g, "")}`,
            image: `/images/${branchName}.png`
          }));
        });

        // Desired order array
        const desiredOrder = ["Horamavu", "Kammanahalli", "Hennur"];
        const sortedBranches = [...branchData].sort((a, b) => 
          desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name)
        );

        setBranches(sortedBranches);
      } catch (err) {
        console.error("Error fetching branch data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading branches</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
<div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-1 py-12">

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    {branches.map((branch) => (
      <div
        key={branch.name}
        className={`bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer ${
          branch.name === "Kammanahalli"
            ? "ring-4 ring-primary ring-opacity-70 transform scale-105 shadow-2xl z-10"
            : "hover:scale-105"
        }`}
        style={branch.name === "Kammanahalli" ? { zIndex: 10 } : {}}
      >
        <div className="relative h-48 w-full">
          <img
            src={branch.image}
            alt={`${branch.name} Clinic`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/images/clinic-default.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
            {branch.name}
          </h2>
        </div>

        <div className="p-6">
          {branch.doctor && (
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Consultant:</span> {branch.doctor}
            </p>
          )}

          <div className="flex justify-between items-center mt-6">
            <Link
              to={branch.link}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact Us
              <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <button className="h-10 px-6 text-white text-sm font-medium bg-gradient-to-r from-rose-600 to-rose-700 shadow-md hover:from-rose-700 hover:to-rose-800 transition-all duration-300 rounded-sm">
            Book appointment
          </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
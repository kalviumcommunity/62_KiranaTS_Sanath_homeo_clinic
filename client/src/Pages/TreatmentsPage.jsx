import Navbar from "../components/NavBar";
import TreatmentsOffered from "../components/TreatmentsOffered";

export default function TreatmentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto mt-10 px-4">
        <div className="space-x-2">
          <span className="text-[#C08A69] text-4xl font-semibold font-['Poppins']">Treatments </span>
          <span className="text-[#C08A69] text-4xl font-normal font-['Poppins']">offered</span>
        </div>
        <TreatmentsOffered />
      </main>
    </div>
  );
}

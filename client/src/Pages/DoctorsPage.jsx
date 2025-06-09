import Doctors from "../components/Doctors";
import Navbar from "../components/NavBar";

export default function DoctorsPage(){
    return(
        <div className="min-h-screen bg-white">
          <Navbar/>
          <main className="container mx-auto mt-10 px-4">
            <div className="space-x-2">
              <span className="text-[#C08A69] text-4xl font-normal font-['Poppins']">Our </span>
              <span className="text-[#C08A69] text-4xl font-semibold font-['Poppins']">Doctors</span>
            </div>
            <Doctors/>
          </main>
        </div>
    )
}
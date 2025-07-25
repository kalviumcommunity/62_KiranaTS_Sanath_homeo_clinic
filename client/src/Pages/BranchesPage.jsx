import Branches from "../components/Branches";
import Navbar from "../components/NavBar";

export default function BranchesPage(){
    return(
        <div className="min-h-screen bg-white">
          <Navbar/>
          <main className="container mx-auto mt-10 px-4">
            <div className="space-x-2">
              <span className="text-[#429DAB] text-4xl font-normal font-['Poppins']">Our </span>
              <span className="text-[#429DAB] text-4xl font-semibold font-['Poppins']">Branches</span>
            </div>
            <Branches/>
          </main>
        </div>
    )
}
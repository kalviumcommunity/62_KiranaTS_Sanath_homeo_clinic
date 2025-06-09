import { useState } from 'react';

export default function Doctors() {
  const [expandedCard, setExpandedCard] = useState(null);

  const doctors = [
    {
      name: "Dr. Sanath Kumar C",
      image: "/images/Sanath.png",
      experience: "25+ years experience",
      qualification: "Fr Muller's Homeopathic Medical College | MD | SCPH | SCPH+",
      branches: ["Kammanahalli", "Hennur"],
      description: "Dr. Sanathkumar is a skilled Homoeopathic physician with 25 years of successful clinical practice in classical Homoeopathy. A proud alumnus of the prestigious Fr. Muller’s Homoeopathic Medical College, one of India’s leading institutions in the field, Dr. Sanathkumar has been committed to holistic healing since the beginning of his career. His expertise spans a wide range of conditions—from common everyday ailments to chronic allergies and cases often labeled as incurable by other systems of medicine. Known for his patient-focused approach, he continues to make a meaningful impact in the lives of those he treats."
    },
    {
      name: "Dr. Hema Sanath C",
      image: "/images/Hema.png",
      experience: "23+ years experience",
      qualification: "Government Homeopathic Medical College | SCPH | SCPH+",
      branches: ["Horamavu", "Hennur"],
      description: "Dr. Hema Sanath C. is a dedicated and compassionate Homoeopathic physician with over 24 years of experience in restoring health through holistic healing. She completed her BHMS from Bangalore University and has been deeply committed to the principles of classical Homoeopathy ever since. She currently offers consultations at Sanath Homeopathy Clinic in Horamavu and Sanath’s Homeopathy Clinic in Hennur. Dr. Hema is a devoted follower of Predictive Homeopathy and an active member of KHMA, continuously striving to stay aligned with evolving approaches in the field. Her gentle, empathetic approach and her belief in understanding each patient beyond just their symptoms have earned her the trust and gratitude of countless individuals and families. She remains passionate about helping people heal—physically, emotionally, and holistically."
    }
  ];

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-black">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {doctors.map((doctor, index) => (
          <div 
            key={index}
            className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 ${expandedCard === index ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="p-6 cursor-pointer" onClick={() => toggleCard(index)}>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="rounded-full h-24 w-24 object-cover border-4 border-primary/20 shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-primary font-medium text-sm mt-1">{doctor.qualification}</p>
                  <div className="flex items-center mt-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {doctor.experience}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-gray-600 mt-1 px-6">
                      <span>Available at:</span>
                      {doctor.branches.map((branch, i) => (
                        <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flashcard description panel */}
            <div 
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                expandedCard === index ? 'max-h-[400px] md:max-h-[600px] overflow-y-auto' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                <p className="text-gray-600 leading-relaxed">{doctor.description}</p>
                <div className="mt-4">
                  <a 
                    href="#contact" 
                    className="inline-flex items-center px-4 py-2 bg-primary text-black rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Contact Doctor
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
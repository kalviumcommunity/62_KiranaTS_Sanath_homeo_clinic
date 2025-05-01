import { Link } from "react-router-dom";

export default function HoramavuPage() {
    return (
        <div className="min-h-screen w-full bg-[#CDBD89] flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 p-4 flex items-center shadow-2xl bg-[#E8E669]" style={{ height: "100px" }}>
                <div className="flex items-center justify-center mb-2 md:mb-0 md:mr-4">
                    <Link to='/'><img src="/images/logo.png" alt="Sanath Homeo Clinic Logo" className="h-12 md:h-20" /></Link>
                </div>
                <div className="flex w-full items-center justify-center gap-3">
                    <span className="text-2xl md:text-3xl font-bold text-black text-center" style={{ fontFamily: 'Merriweather' }}>
                        SANATH HOMEO CLINIC - Horamavu
                    </span>
                </div>
            </nav>

            {/* Page Content */}
            <div className="flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-8 gap-12 text-black">

                {/* Hero Section */}
                <section className="w-full max-w-5xl text-center">

                    {/* Contact First */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Doctor Profile */}
                            <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
                                <img
                                    src="/images/Hema.png"
                                    alt="Dr. Hema Sanath"
                                    className="rounded-full h-32 w-32 object-cover border-4 border-[#E8E669]"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Dr. Hema Sanath</h2>
                                    <p className="text-gray-700 text-sm">
                                        23+ years experience | Government Homeopathic Medical College | SCPH | SCPH<b>+</b>

                                    </p>
                                    <br />
                                    <p style={{ fontSize: "14px" }} className="text-gray-500">
                                    Dr. Hema Sanath C. is a dedicated and compassionate Homoeopathic physician with over 24 years of experience in restoring health through holistic healing. She completed her BHMS from Bangalore University and has been deeply committed to the principles of classical Homoeopathy ever since. She currently offers consultations at Sanath Homeopathy Clinic in Horamavu and Sanath’s Homeopathy Clinic in Hennur.

Dr. Hema is a devoted follower of Predictive Homeopathy and an active member of KHMA, continuously striving to stay aligned with evolving approaches in the field. Her gentle, empathetic approach and her belief in understanding each patient beyond just their symptoms have earned her the trust and gratitude of countless individuals and families. She remains passionate about helping people heal—physically, emotionally, and holistically.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-[#E8E669]/20 p-4 rounded-lg">
                                <h2 className="text-xl font-bold mb-3 text-center">Contact & Timings</h2>
                                <div className="space-y-2">
                                    <p><b>📞:</b> +91 94496 53483, +91 80953 11163</p>
                                    
                                    <p><b>✉️:</b> horamavu@sanathhomeoclinic.com</p>
                                    <p><b>🕙:</b> 10AM-1.30PM, 6.30PM-8PM (Closed Sun)</p>
                                    <a
                                        href="https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KQ-zg4uaEa47MSfM-cWOdE6u&daddr=1st+floor,+Horamavu+Main+Rd,+opposite+to+hotel+Udupi+Gardenia,+above+Axis+Bank+ATM,+Asheervad+Colony,+Horamavu+Banaswadi,+Horamavu,+Bengaluru,+Karnataka+560043"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-3 bg-[#2CE663] hover:bg-[#2CE663]/90 text-white font-semibold py-2 px-4 rounded-full text-sm transition"
                                    >
                                        📍 Open in Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinic Image */}
                    <div className="bg-white rounded-xl shadow-lg p-5 mb-10">
                        <img
                            src="/images/Horamavu.png"
                            alt="Horamavu Clinic"
                            className="rounded-lg w-full h-70 object-cover mb- shadow-md"
                        />
                    </div>
                </section>

                {/* Treatments Section */}
                <section className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Treatments Offered</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
  "Skin Disease Treatment",
  "Gall Bladder (Biliary) Stone Treatment",
  "Kidney Stone Treatment",
  "Weight Loss Diet Counseling",
  "Liver Disease Treatment",
  "Arthritis Management",
  "Hair Loss Treatment",
  "Dandruff Treatment",
  "Allergy Treatment",
  "Diabetes Management",
  "Irritable Bowel Syndrome",
  "Obesity Treatment",
  "Bronchial Asthma Treatment",
  "Infertility Evaluation / Treatment",
  "Acidity Treatment",
  "Bronchitis Treatment",
  "Cervical Spondylitis Treatment",
  "Cysts",
  "Depression Treatment",
  "Dermatitis Treatment",
  "Eczema Treatment",
  "Insomnia Treatment",
  "Dysmenorrhea Treatment",
  "Piles Treatment (Non Surgical)",
  "Migraine Treatment",
  "Psoriasis Treatment",
  "Yoga Therapy",
  "Rheumatism Treatment",
  "Thyroid Disorder Treatment",
  "Vertigo Treatment",
  "Warts",
  "Lifestyle Disorders Treatment",
  "PCOD/PCOS Treatment",
  "Skin Disorder",
  "Rheumatic Complaints",
  "Acne / Pimples Treatment",
  "Sinusitis",
  "Colitis Treatment",
  "Gastritis Treatment",
  "Youth Counselling",
  "Adult Counselling",
  "Vaccination/ Immunization",
  "Hypertension Treatment",
  "Autoimmune Disease"
]
.map((item, index) => (
                            <div key={index} className="flex items-start">
                                <span className="text-[#2CE663] mr-2">•</span>
                                <span>{item}</span>
                            </div>
                        ))}
                        <p>And more..</p>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default function TreatmentsOffered() {
  const treatments = {
    "Common Conditions": [
      "Skin Disease Treatment",
      "Hair Loss Treatment",
      "Acne / Pimples Treatment",
      "Dandruff Treatment",
      "Eczema Treatment",
      "Psoriasis Treatment",
      "Warts",
      "Skin Disorder",
      "Dermatitis Treatment"
    ],
    "Chronic & Autoimmune": [
      "Diabetes Management",
      "Hypertension Treatment",
      "Thyroid Disorder Treatment",
      "Autoimmune Disease",
      "Arthritis Management",
      "Rheumatic Complaints",
      "Cervical Spondylitis Treatment",
      "Migraine Treatment",
      "Allergy Treatment"
    ],
    "Digestive Health": [
      "Gall Bladder (Biliary) Stone Treatment",
      "Kidney Stone Treatment",
      "Irritable Bowel Syndrome",
      "Acidity Treatment",
      "Gastritis Treatment",
      "Colitis Treatment",
      "Piles Treatment (Non Surgical)",
      "Cysts",
      "Liver Disease Treatment"
    ],
    "Women’s & Hormonal Health": [
      "PCOD/PCOS Treatment",
      "Dysmenorrhea Treatment",
      "Infertility Evaluation / Treatment",
      "Obesity Treatment",
      "Weight Loss Diet Counseling",
      "Lifestyle Disorders Treatment"
    ],
    "Mental & Lifestyle Wellness": [
      "Depression Treatment",
      "Insomnia Treatment",
      "Youth Counselling",
      "Adult Counselling",
      "Skin Disease Treatment"
    ],
    "Respiratory & General Care": [
      "Bronchial Asthma Treatment",
      "Bronchitis Treatment",
      "Vertigo Treatment",
      "Immunization",
      "Sinusitis",
      "Rheumatism Treatment"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(treatments).map(([category, items]) => (
          <div
            key={category}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-stone-400 px-6 py-3">
              <h3 className="text-lg font-semibold text-white">{category}</h3>
            </div>
            <div className="p-5">
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

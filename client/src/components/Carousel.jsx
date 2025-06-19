import { useEffect, useState } from "react";

export default function Carousel() {
    const images = [
        "https://www1.racgp.org.au/getattachment/de6f8e46-91e0-4207-beb6-de5b180e5640/attachment.aspx",
        "https://www.helsana.ch/dam/assets/01-bildwelt/04-stockbilder/iStock-486645381.hlsimg.2_1.w768.jpg",
        "https://static.vecteezy.com/system/resources/thumbnails/055/219/417/small_2x/aromatic-essential-oil-and-homeopathic-medicine-with-floral-background-for-holistic-treatments-photo.jpg",
    ];
    
    const [currIndex, setCurrIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(() => {
        if (isHovered) return;
        
        const interval = setInterval(() => {
            setCurrIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length, isHovered]);

    return (
        <div 
            className="relative w-full h-[300px] sm:h-[400px] md:h-[700px] mx-auto bg-gray-50 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Carousel images */}
            <div 
                className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateX(-${currIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <div key={index} className="relative w-full flex-shrink-0 group">
                        <img 
                            src={src} 
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                            alt={`Healthcare service ${index + 1}`} 
                            loading="eager"
                        />
                        {/* Gradient overlay - more prominent on mobile */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent md:bg-gradient-to-r md:from-neutral-900/80 md:via-neutral-900/30 md:to-transparent"></div>
                    </div>
                ))}
            </div>

            {/* Branding + Text Overlay (Centered on mobile, left on desktop) */}
            <div className="absolute inset-0 flex items-end pb-8 px-4 sm:items-center sm:pb-0 sm:pl-8 md:pl-16 pointer-events-none">
                <div className="text-center sm:text-left w-full sm:max-w-md md:max-w-lg">
                    {/* Clinic Name */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-white tracking-wider mb-2 sm:mb-4">
                        SANATH HOMEO CLINIC
                    </h1>

                    {/* Tagline */}
                    <h2 className="text-4xl md:text-6xl font-cursive text-white mb-2 tracking-wide">
                        We <span className="text-yellow-200">Care</span> to <span className="text-green-100">Cure</span>
                    </h2>
                </div>
            </div>

            {/* Indicators - centered on mobile, left on desktop */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:left-16 sm:translate-x-0 flex gap-1.5">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${currIndex === index ? 'w-6 bg-white' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
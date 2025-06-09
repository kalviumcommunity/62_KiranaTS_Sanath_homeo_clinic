import { useEffect, useState } from "react";

export default function Carousel() {
    const images=[
        "https://www1.racgp.org.au/getattachment/de6f8e46-91e0-4207-beb6-de5b180e5640/attachment.aspx",
        "https://www.helsana.ch/dam/assets/01-bildwelt/04-stockbilder/iStock-486645381.hlsimg.2_1.w768.jpg",
        "https://static.vecteezy.com/system/resources/thumbnails/055/219/417/small_2x/aromatic-essential-oil-and-homeopathic-medicine-with-floral-background-for-holistic-treatments-photo.jpg",
    ]
    const [currIndex, setCurrIndex]=useState(0);
    useEffect(()=>{
        const interval=setInterval(()=>{
            setCurrIndex((prevIndex)=>prevIndex===images.length-1?0:prevIndex+1);
        },3000);
        return()=>clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
  return (
    <div className="w-full max-w-[1500px] h-[400px] md:h-[526px] mx-auto bg-zinc-300 rounded-3xl overflow-hidden">
      {/* Carousel content will go here */}
      <div className="flex h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currIndex * 100}%)` }}>
        {images.map((src, index) => (
            <img key={index} src={src} className="w-full flex-shrink-0 object-cover" alt={`slide ${index + 1}`} />
        ))}
      </div>

    </div>
  );
}
"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const heroImage = [
  { imgUrr: "/assets/images/hero-1.svg", alt: "smartwatch" },
  { imgUrr: "/assets/images/hero-2.svg", alt: "bag" },
  { imgUrr: "/assets/images/hero-3.svg", alt: "lamp" },
  { imgUrr: "/assets/images/hero-4.svg", alt: "air fryer" },
  { imgUrr: "/assets/images/hero-5.svg", alt: "chair" },
];
const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        //autoPlay
        infiniteLoop
        //interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImage.map((img) => (
          <Image
            src={img.imgUrr}
            key={img.alt}
            alt={img.alt}
            width={484}
            height={484}
            className="object-contain"
          />
        ))}
      </Carousel>
      <Image
        src="/assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="absolute -left-[17%] bottom-0 max-xl:hidden"
      />
    </div>
  );
};

export default HeroCarousel;

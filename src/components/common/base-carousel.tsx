import React from "react";
import { Carousel, CarouselContent } from "../ui/carousel";

const BaseCarousel = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent></CarouselContent>
    </Carousel>
  );
};

export default BaseCarousel;

import Lottie, { LottieComponentProps } from "lottie-react";
import React from "react";

interface LottiePlayerProps {
  lottie: any;
  loop?: boolean;
}

const LottiePlayer = ({ lottie, loop = false }: LottiePlayerProps) => {
  return <Lottie animationData={lottie} loop={loop} className="w-40 h-40" />;
};

export default LottiePlayer;

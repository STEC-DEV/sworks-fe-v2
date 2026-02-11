"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ScheduleImage from "../../public/images/banner/banner_schedule.png";
import DailyImage from "../../public/images/banner/banner_daily.png";
import VocImage from "../../public/images/banner/banner_voc.png";
import Image from "next/image";
import { bannerText } from "../../public/text";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   router.replace("/login");
  // }, [router]);
  return (
    <div className="relative overflow-x-hidden">
      <MainSection />
      <ScheduleSection />
      <DailySection />
      <VocSection />
      {/*  */}
      <Link href={"/login"} className="absolute top-15 right-0">
        <div className="text-white text-lg font-medium bg-gray-300/40 px-12 py-2 hover:scale-110 duration-150">
          로그인
        </div>
      </Link>

      <div className="fixed py-3 px-4 right-0 top-1/2 -translate-y-1/2 z-10 [writing-mode:vertical-rl] bg-[#223377] text-white text-md font-semibold">
        S-TEC SYSTEM
      </div>
    </div>
  );
}

const MainSection = () => {
  return (
    <section className="snap-start h-screen relative flex flex-col items-center justify-center p-6 text-center">
      <HeroBackground />
      <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-blue-50">
        S-Agent
      </h1>
      <p className="text-xl md:text-2xl font-light text-blue-100 max-w-2xl">
        에스텍시스템의 전문 노하우를 담은 <br />
        차세대 용역업무 통합 관리 솔루션
      </p>
      <div className="absolute bottom-10 animate-bounce text-blue-50">
        ↓ 아래로 스크롤
      </div>
    </section>
  );
};

const ScheduleSection = () => {
  return (
    <section className="relative space-y-12  md:h-screen bg-white px-5 xl:px-100 py-15 md:py-25 text-center ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xl md:text-4xl font-bold mb-4 tracking-tight">
          {bannerText.schedule.title}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-lg font-medium text-[var(--placeholder)]">
          {bannerText.schedule.description}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image src={ScheduleImage} alt="이미지" />
      </motion.div>
    </section>
  );
};

const DailySection = () => {
  return (
    <section className="relative space-y-12  bg-[#223377] px-5 xl:px-100  py-15 md:py-25 text-center ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xl md:text-4xl font-bold mb-4 tracking-tight text-blue-50">
          {bannerText.daily.title}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <p className="text-lg font-medium text-[var(--border)]">
            {bannerText.daily.subTitle}
          </p>
          <p className="text-lg font-medium text-[var(--border)]">
            {bannerText.daily.description}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image src={DailyImage} alt="이미지" />
      </motion.div>
    </section>
  );
};

const VocSection = () => {
  return (
    <section className="relative space-y-12 md:h-screen bg-white px-5 xl:px-100 py-15 md:py-25 text-center ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xl md:text-4xl font-bold mb-4 tracking-tight">
          {bannerText.voc.title}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <p className="text-lg font-medium text-[var(--placeholder)]">
            {bannerText.voc.subTitle}
          </p>
          <p className="text-lg font-medium text-[var(--placeholder)]">
            {bannerText.voc.description}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image src={VocImage} alt="이미지" />
      </motion.div>
    </section>
  );
};

export const HeroBackground = () => {
  return (
    //  bg-slate-950 bg-gradient-to-r from-blue-900  via-black to-[#0fbaee] animate-gradient
    <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-950 bg-gradient-to-r from-blue-900  via-[#040508] to-[#0fbaee] animate-gradient">
      {/* 유동적으로 움직이는 여러 개의 그라데이션 레이어 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
          x: [-10, 30, -10],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-900/50 blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -45, 0],
          x: [20, -20, 20],
          y: [30, -10, 30],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] rounded-full bg-blue-600/30 blur-[100px]"
      />

      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#1e3a8a]/20 to-[#020617]"
      />

      {/* 가독성을 위한 노이즈나 미세한 오버레이 */}
      <div
        className="absolute inset-0 min-w-full min-h-screen opacity-5 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 237 237' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.98' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "237px 237px", // 노이즈 패턴이 깨지지 않고 반복되도록 설정
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
};

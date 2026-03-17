import { useEffect } from "react";
import { motion, useAnimate, type Variants } from "framer-motion";
import { PackageOpen } from "lucide-react";

// ── 떠다니는 아이콘 ───────────────────────────────────────
const FloatingIcon = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      scope.current,
      { y: [0, -10, 0, -10, 0] },
      { duration: 3, ease: "easeInOut" },
    );
  }, []);

  return (
    <motion.div
      ref={scope}
      className="relative flex items-center justify-center"
    >
      <div className="w-36 h-36 rounded-full bg-primary-background flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-[#e2e8f0] flex items-center justify-center">
          <PackageOpen size={42} className="text-[#6b7db3]" strokeWidth={1.5} />
        </div>
      </div>
      <motion.div
        className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#c8d0e8]"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-2 left-0 w-1.5 h-1.5 rounded-full bg-[#9aa3be]"
        animate={{ scale: [1, 1.6, 1] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </motion.div>
  );
};

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ── EmptyBox ──────────────────────────────────────────────
const EmptyBox = ({
  message,
  subMessage,
}: {
  message?: string;
  subMessage?: string;
}) => {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center gap-5 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <FloatingIcon />
      </motion.div>
      <motion.div
        className="flex flex-col items-center gap-1.5"
        variants={itemVariants}
      >
        <span className="text-lg text-description-strong font-bold text-center leading-relaxed">
          {message || "데이터가 없어요"}
        </span>
        <span className="text-sm text-description-light font-medium text-center leading-relaxed">
          {subMessage || "데이터를 생성해주세요"}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default EmptyBox;

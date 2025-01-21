import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const AnimatedGridItem: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, 
    threshold: 0.2,   
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

import { motion } from 'framer-motion';

interface CircularProgressProps {
  percentage: number;
  className?: string;
}

export function CircularProgress({ percentage, className = '' }: CircularProgressProps) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`w-12 h-12 ${className}`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="none"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#e31837"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </div>
  );
}
import { FaWater } from "react-icons/fa";

interface LoaderProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  icon = <FaWater className="animate-bounce text-blue-500 text-6xl" />,
  className = "flex flex-col items-center justify-center min-h-screen bg-blue-50",
}) => {
  return (
    <div className={className}>
      {icon}
      <p className="mt-4 text-blue-600 text-lg font-semibold">{message}</p>
    </div>
  );
};

export default Loader;

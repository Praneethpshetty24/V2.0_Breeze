import { FaSpinner } from 'react-icons/fa';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <FaSpinner className="animate-spin text-4xl text-[#00ff7f] mb-4" />
      <p className="text-gray-400 text-lg">Analyzing your purchases...</p>
    </div>
  );
}


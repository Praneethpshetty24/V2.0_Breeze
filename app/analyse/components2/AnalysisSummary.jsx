import { motion } from 'framer-motion';

export default function AnalysisSummary({ summary }) {
  const formatSummary = (text) => {
    if (!text) return [];
    return text.split('\n').map((line) => {
      if (line.startsWith('##')) {
        return { 
          type: 'section', 
          content: line.replace('##', '').trim() 
        };
      }
      if (line.startsWith('- **')) {
        return { 
          type: 'subsection', 
          content: line.replace('- **', '').replace('**', '').trim() 
        };
      }
      if (line.startsWith('- ')) {
        return { 
          type: 'item', 
          content: line.replace('- ', '').trim() 
        };
      }
      return { 
        type: 'text', 
        content: line 
      };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-8">
        Analysis Summary
      </h2>
      <div className="space-y-6">
        {formatSummary(summary).map((item, index) => {
          switch (item.type) {
            case 'section':
              return (
                <div key={index} className="mt-8 first:mt-0">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                    {item.content}
                  </h3>
                </div>
              );
            case 'subsection':
              return (
                <div key={index} className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-300">
                    {item.content}
                  </h4>
                </div>
              );
            case 'item':
              return (
                <div key={index} className="ml-4 mt-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <p className="text-gray-300 text-base">
                    {item.content}
                  </p>
                </div>
              );
            default:
              return (
                <p key={index} className="text-gray-400">
                  {item.content}
                </p>
              );
          }
        })}
      </div>
    </motion.div>
  );
}


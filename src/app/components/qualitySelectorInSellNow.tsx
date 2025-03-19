import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const qualities = {
  "New with tags": "A brand new unused item with tags attached or in the original packaging.",
  "New without Tags": "A brand new, unused item without tags or original packaging.",
  "Very good": "A lightly used item that may have slight imperfections but still looks great. Include photos and a description of any flaws in your listing.",
  "Good": "A used item that may show imperfections and signs of wear. Include photos and a description of flaws in your listing.",
  "Satisfactory": "A frequently used item with imperfections and signs of wear. Include photos and a description of flaws in your listing."
};

export default function QualitySelector() {
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (quality) => {
    setSelectedQuality(quality);
    setIsOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div 
        className="w-full p-2 border rounded-lg bg-white cursor-pointer flex justify-between items-center" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">
          {selectedQuality || "Select Quality"}
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full p-2 border rounded-lg bg-white mt-2"
          >
            {Object.entries(qualities).map(([quality, description]) => (
              <motion.div
                key={quality}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleSelect(quality)}
              >
                <strong>{quality}</strong>
                <p className="text-sm text-gray-600">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

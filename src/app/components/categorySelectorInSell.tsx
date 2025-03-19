import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = {
  "Electronics": {
    "Mobiles": {
      "Samsung": { "Galaxy S21": null, "Galaxy A52": null },
      "Apple": { "iPhone 13": null, "iPhone SE": null }
    },
    "Laptops": {
      "Dell": { "XPS 13": null, "Inspiron 15": null },
      "HP": { "Pavilion": null, "Spectre x360": null }
    }
  },
  "Automotive": {
    "Cars": {
      "Toyota": { "Cross": null, "ALien": null },
      "Honda": { "Honda Civic": null, "Atlas": null }
    },
    "Bikes": {
      "Honda": { "CD-70": null, "Pridor 100": null },
      "Yamaha": { "YBR": null, "YBZ": null }
    }
  },
  "Fashion": {
    "Men": {
      "Clothing": { "Shirts": null, "Jeans": null },
      "Shoes": { "Sneakers": null, "Loafers": null }
    },
    "Women": {
      "Dresses": { "Casual": null, "Party Wear": null },
      "Bags": { "Handbags": null, "Backpacks": null }
    }
  }
};

export default function CategorySelector() {
  const [path, setPath] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const getOptions = (currentPath) => {
    let data = categories;
    for (const step of currentPath) {
      data = data?.[step];
    }
    return data && typeof data === "object" ? Object.keys(data) : [];
  };

  const handleChange = (value) => {
    if (value === "back") {
      setPath((prev) => prev.slice(0, -1));
      return;
    }
    const newPath = [...path, value];
    setPath(newPath);

    if (getOptions(newPath).length === 0) {
      setIsOpen(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="w-full p-2 border rounded-lg bg-white cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-gray-700">{path.length ? path.join(" / ") : "Select Category"}</span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full p-2 border rounded-lg bg-white mt-2"
          >
            {path.length > 0 && (
              <div
                className="cursor-pointer p-2 text-gray-600 hover:text-black flex items-center"
                onClick={() => {
                  handleChange("back");
                  setIsOpen(true);
                }}
              >
                <ArrowLeft size={25} className="bg-white" />
              </div>
            )}
            {getOptions(path).map((option) => {
              const subOptions = getOptions([...path, option]);
              return (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => handleChange(option)}
                >
                  {option} {subOptions.length > 0 && <ArrowRight size={25} className="bg-white" />}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ✅ components/ImageGallery.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  children: React.ReactNode;
}

export const ImageGallery = ({ images, children }: ImageGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images?.length) return <>{children}</>;

  const urls = images.map((img) =>
    img.startsWith("http") ? img : `http://localhost:3000${img}`,
  );

  const next = () => setIndex((i) => (i + 1) % urls.length);
  const prev = () => setIndex((i) => (i - 1 + urls.length) % urls.length);

  return (
    <>
      <div
        onClick={() => {
          setIndex(0);
          setIsOpen(true);
        }}
        className="cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="absolute top-4 left-4 text-white/80 text-sm">
              {index + 1} / {urls.length}
            </div>

            <motion.img
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={urls[index]}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {urls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

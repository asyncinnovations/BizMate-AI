"use client";

import React, { useEffect, useState } from "react";

interface TypeWriterProps {
  texts: string[];
  typingSpeed?: number; // optional, default 100ms
  deletingSpeed?: number; // optional, default 50ms
  pauseTime?: number; // optional, default 2000ms
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
}) => {
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentTextIndex];

    if (!isDeleting) {
      if (currentIndex < currentText.length) {
        const timer = setTimeout(() => {
          setTypedText(currentText.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, typingSpeed);

        return () => clearTimeout(timer);
      } else {
        const pauseTimer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);

        return () => clearTimeout(pauseTimer);
      }
    } else {
      if (currentIndex > 0) {
        const timer = setTimeout(() => {
          setTypedText(currentText.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, deletingSpeed);

        return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setCurrentTextIndex((currentTextIndex + 1) % texts.length);
      }
    }
  }, [
    currentIndex,
    isDeleting,
    currentTextIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ]);

  return (
    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3 min-h-[80px] lg:min-h-[100px]">
      {typedText}
      <span className="ml-2 w-1.5 h-6 bg-cyan-400 animate-pulse inline-block"></span>
    </h1>
  );
};

export default TypeWriter;

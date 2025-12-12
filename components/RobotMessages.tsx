'use client';

import { useEffect, useState } from 'react';

interface RobotMessagesProps {
  isVisible: boolean;
}

export default function RobotMessages({ isVisible }: RobotMessagesProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messages = [
    "Hi! Welcome to RuyaTECH 👋",
    "I'm here to help transform your digital future!",
    "Let's build something amazing together!",
    "Powered by AI & Innovation 🚀"
  ];

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('');
      setCurrentMessageIndex(0);
      setIsTyping(false);
      return;
    }

    // Wait 3.5 seconds for robot to fly in before showing first message
    const initialDelay = currentMessageIndex === 0 ? 3500 : 0;
    let typingInterval: NodeJS.Timeout;

    const delayTimeout = setTimeout(() => {
      setIsTyping(true);
      const currentMessage = messages[currentMessageIndex];
      let charIndex = 0;

      typingInterval = setInterval(() => {
        if (charIndex <= currentMessage.length) {
          setDisplayedText(currentMessage.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);

          // Wait 3 seconds before showing next message
          setTimeout(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
          }, 3000);
        }
      }, 80); // Typing speed
    }, initialDelay);

    return () => {
      clearTimeout(delayTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [currentMessageIndex, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/3 right-[15%] z-20 pointer-events-none">
      <div className="relative">
        {/* Speech bubble */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-xs relative animate-bounce-slow">
          <p className="text-lg font-medium">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-0.5 h-5 bg-white ml-1 animate-pulse" />
            )}
          </p>

          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 right-12 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-purple-800" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-2xl -z-10 animate-pulse" />
      </div>
    </div>
  );
}

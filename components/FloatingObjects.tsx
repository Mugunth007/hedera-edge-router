"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function FloatingObjects() {
  const [connections, setConnections] = useState<
    {
      from: {
        x: number;
        y: number;
      };
      to: {
        x: number;
        y: number;
      };
    }[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);
  const phoneRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile phone positions - adjusted for mobile
  const phones = isMobile
    ? [
        { id: 1, baseX: 85, baseY: 10, delay: 0 },
        { id: 2, baseX: 90, baseY: 85, delay: 2 },
        { id: 3, baseX: 10, baseY: 20, delay: 4 },
      ]
    : [
        { id: 1, baseX: 90, baseY: 15, delay: 0 },
        { id: 2, baseX: 92, baseY: 90, delay: 2 },
        { id: 3, baseX: 40, baseY: 35, delay: 4 },
        { id: 4, baseX: 45, baseY: 75, delay: 1 },
        { id: 5, baseX: 55, baseY: 15, delay: 3 },
        { id: 6, baseX: 70, baseY: 90, delay: 3 },
      ];

  // Objects - fewer for mobile
  const objects = isMobile
    ? [
        { type: "robot", baseX: 15, baseY: 5, delay: 2, image: "/robot.png" },
        {
          type: "rocket",
          baseX: 85,
          baseY: 50,
          delay: 1,
          image: "/rocket.png",
        },
        { type: "man", baseX: 10, baseY: 90, delay: 4, image: "/man.png" },
      ]
    : [
        { type: "robot", baseX: 40, baseY: 10, delay: 2, image: "/robot.png" },
        { type: "man", baseX: 40, baseY: 90, delay: 4, image: "/man.png" },
        {
          type: "rocket",
          baseX: 50,
          baseY: 45,
          delay: 1,
          image: "/rocket.png",
        },
        { type: "robot2", baseX: 92, baseY: 5, delay: 5, image: "/robot.png" },
        {
          type: "rocket3",
          baseX: 80,
          baseY: 88,
          delay: 1,
          image: "/rocket.png",
        },
        { type: "robot3", baseX: 53, baseY: 90, delay: 6, image: "/robot.png" },
        {
          type: "rocket5",
          baseX: 75,
          baseY: 5,
          delay: 2,
          image: "/rocket.png",
        },
        { type: "robot5", baseX: 65, baseY: 12, delay: 4, image: "/robot.png" },
        {
          type: "astronaut5",
          baseX: 92,
          baseY: 70,
          delay: 5,
          image: "/man.png",
        },
      ];

  useEffect(() => {
    const updateConnections = () => {
      const globeCenter = {
        x: isMobile ? window.innerWidth * 0.5 : window.innerWidth * 0.75,
        y: window.innerHeight * 0.5,
      };

      const newConnections = phoneRefs.current
        .map((phoneRef) => {
          if (!phoneRef) return null;
          const rect = phoneRef.getBoundingClientRect();
          return {
            from: {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            },
            to: globeCenter,
          };
        })
        .filter(Boolean) as Array<{
        from: { x: number; y: number };
        to: { x: number; y: number };
      }>;

      setConnections(newConnections);
    };

    updateConnections();
    window.addEventListener("resize", updateConnections);
    const interval = setInterval(updateConnections, 100);

    return () => {
      window.removeEventListener("resize", updateConnections);
      clearInterval(interval);
    };
  }, [isMobile]);

  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {/* Connection lines - only on desktop */}
      {!isMobile && (
        <svg className="absolute inset-0 w-full h-full">
          {connections.map((connection, index) => (
            <motion.line
              key={index}
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke="#038fa8"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.4"
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            />
          ))}
        </svg>
      )}

      {/* Floating phones - smaller on mobile */}
      {phones.map((phone, index) => (
        <motion.div
          key={phone.id}
          ref={(el) => (phoneRefs.current[index] = el)}
          className={`absolute ${isMobile ? "w-6 h-9" : "w-8 h-12"}`}
          style={{
            left: `${phone.baseX}%`,
            top: `${phone.baseY}%`,
          }}
          animate={{
            x: isMobile ? [0, 15, -10, 8, 0] : [0, 30, -20, 15, 0],
            y: isMobile ? [0, -12, 8, -5, 0] : [0, -25, 15, -10, 0],
            rotate: [0, 5, -3, 2, 0],
          }}
          transition={{
            duration: 12 + phone.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: phone.delay,
          }}
        >
          <Image
            src="/phone.png"
            alt="Mobile phone"
            width={isMobile ? 24 : 32}
            height={isMobile ? 36 : 48}
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </motion.div>
      ))}

      {/* Other objects - smaller on mobile */}
      {objects.map((obj, index) => (
        <motion.div
          key={obj.type}
          className={`absolute ${isMobile ? "w-8 h-8" : "w-12 h-12"}`}
          style={{
            left: `${obj.baseX}%`,
            top: `${obj.baseY}%`,
          }}
          animate={{
            x: isMobile ? [0, 20, -15, 10, 0] : [0, 40, -30, 20, 0],
            y: isMobile ? [0, -15, 10, -8, 0] : [0, -30, 20, -15, 0],
            rotate: [0, 10, -8, 5, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 15 + obj.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: obj.delay,
          }}
        >
          <Image
            src={obj.image}
            alt={obj.type}
            width={isMobile ? 32 : 48}
            height={isMobile ? 32 : 48}
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </motion.div>
      ))}

      {/* Fewer particles on mobile */}
      {Array.from({ length: isMobile ? 8 : 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* Fewer data streams on mobile */}
      {Array.from({ length: isMobile ? 2 : 5 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-franky-cyan to-transparent"
          style={{
            left: `${20 + i * 15}%`,
            top: `${Math.random() * 80}%`,
          }}
          animate={{
            x: [0, 100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

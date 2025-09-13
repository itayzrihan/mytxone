"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Sample thumbnails for the carousel
const carouselThumbnails = [
  {
    id: 1,
    title: "Weekly Team Sync",
    label: "Premium Community",
    image: "/images/meeting-thumb-1.jpg",
    bgColor: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "MYTX Community Hub",
    label: "Free Access",
    image: "/images/meeting-thumb-2.jpg", 
    bgColor: "from-orange-500 to-red-600"
  },
  {
    id: 3,
    title: "Growth Academy",
    label: "Business Network",
    image: "/images/meeting-thumb-3.jpg",
    bgColor: "from-green-500 to-teal-600"
  },
  {
    id: 4,
    title: "Future Builders",
    label: "Startup Community",
    image: "/images/meeting-thumb-4.jpg",
    bgColor: "from-purple-500 to-pink-600"
  },
  {
    id: 5,
    title: "Innovation Hub",
    label: "Tech Meetup",
    image: "/images/meeting-thumb-5.jpg",
    bgColor: "from-cyan-500 to-blue-600"
  }
];

export default function CreateMeetingPage() {
  const [selectedThumbnail, setSelectedThumbnail] = useState(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-20">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* MYTX Logo - Smaller and with more space above */}
        <div className="text-4xl font-bold mt-8">
          <span className="text-cyan-400">MYT</span>
          <span className="text-white">X</span>
        </div>

        {/* Inspirational Statement */}
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl text-white leading-relaxed">
            Build, connect, and grow with{" "}
            <span className="text-cyan-400">tomorrow's community leaders.</span>
          </p>
        </div>

        {/* Glassmorphism Card with Carousel */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
          <div className="relative p-6 space-y-1 overflow-hidden">
            
            {/* Carousel Container - with overflow hidden */}
            <div className="relative h-72 flex items-center justify-center overflow-hidden">
              
              {/* Show only previous, current, and next thumbnails */}
              {carouselThumbnails.map((thumb, index) => {
                const isSelected = thumb.id === selectedThumbnail;
                const selectedIndex = carouselThumbnails.findIndex(t => t.id === selectedThumbnail);
                
                // Only show current, previous, and next
                const isPrevious = index === selectedIndex - 1;
                const isNext = index === selectedIndex + 1;
                
                // Don't render if not in visible range
                if (!isSelected && !isPrevious && !isNext) {
                  return null;
                }
                
                let transform = '';
                let zIndex = 10;
                let opacity = 0.3;
                let scale = 0.7;
                let blur = 'blur(2px)';
                
                if (isSelected) {
                  transform = 'translateX(0px)';
                  zIndex = 30;
                  opacity = 1;
                  scale = 1;
                  blur = 'blur(0px)';
                } else if (isPrevious) {
                  transform = 'translateX(-70px)';
                  zIndex = 20;
                  opacity = 0.3;
                  scale = 0.7;
                  blur = 'blur(1px)';
                } else if (isNext) {
                  transform = 'translateX(70px)';
                  zIndex = 20;
                  opacity = 0.3;
                  scale = 0.7;
                  blur = 'blur(1px)';
                }

                return (
                  <div
                    key={thumb.id}
                    className="absolute transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      transform: `${transform} scale(${scale})`,
                      zIndex,
                      opacity,
                      filter: blur
                    }}
                    onClick={() => setSelectedThumbnail(thumb.id)}
                  >
                    <div className="relative w-56 h-36 rounded-2xl overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${thumb.bgColor}`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-white font-bold text-lg text-center px-4">
                          {thumb.title}
                        </h3>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          {thumb.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Dots - Much closer to carousel */}
            <div className="flex justify-center space-x-2 -mt-6">
              {carouselThumbnails.map((thumb) => (
                <button
                  key={thumb.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    thumb.id === selectedThumbnail
                      ? 'bg-cyan-400'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => setSelectedThumbnail(thumb.id)}
                />
              ))}
            </div>

            {/* Create New Meeting Button */}
            <div className="pt-1">
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-lg"
              >
                CREATE A MEETING
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
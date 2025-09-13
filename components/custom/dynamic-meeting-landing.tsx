"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { HorizontalScrollGallery } from "./horizontal-scroll-gallery";

interface GalleryItem {
  id: string;
  type: 'video' | 'image';
  src: string;
  thumbnail?: string;
  title?: string;
  duration?: string; // For videos
}

interface MeetingData {
  title: string;
  subtitle: string;
  description: string;
  memberCount: string;
  onlineCount: string;
  adminCount: string;
  isPrivate: boolean;
  isFree: boolean;
  instructor: string;
  hasVerifiedBadge: boolean;
  features: string[];
  backgroundVideo?: string;
  thumbnailImage?: string;
  poweredBy: string;
  gallery?: GalleryItem[];
}

interface DynamicMeetingLandingProps {
  meetingData: MeetingData;
  pageName: string;
}

export function DynamicMeetingLanding({ meetingData, pageName }: DynamicMeetingLandingProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeGalleryItem, setActiveGalleryItem] = useState<GalleryItem | null>(
    meetingData.gallery && meetingData.gallery.length > 0 ? meetingData.gallery[0] : null
  );

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleGalleryItemClick = (item: GalleryItem) => {
    setActiveGalleryItem(item);
    setIsVideoPlaying(false); // Reset video playing state when switching
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Video/Image Container */}
        <div className="absolute inset-0 -z-10">
          {meetingData.backgroundVideo ? (
            <video
              className="w-full h-full object-cover"
              poster={meetingData.thumbnailImage}
              muted
              loop
              autoPlay={isVideoPlaying}
            >
              <source src={meetingData.backgroundVideo} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20" />
          )}
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 py-20">
            <div className="max-w-6xl mx-auto">
              
              {/* Title Section */}
              <div className="text-center mb-12">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  {meetingData.title}
                </h1>
                <p className="text-xl text-cyan-300 font-medium mb-6">
                  {meetingData.subtitle}
                </p>
                <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl mx-auto">
                  {meetingData.description}
                </p>
              </div>

            {/* Main Video Section */}
            {(activeGalleryItem || meetingData.backgroundVideo) && (
              <div className="mb-8">
                <div className="max-w-4xl mx-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden">
                      {activeGalleryItem ? (
                        activeGalleryItem.type === 'video' ? (
                          <video
                            className="w-full h-full object-cover"
                            poster={activeGalleryItem.thumbnail}
                            controls={isVideoPlaying}
                            muted={!isVideoPlaying}
                            autoPlay={isVideoPlaying}
                          >
                            <source src={activeGalleryItem.src} type="video/mp4" />
                          </video>
                        ) : (
                          <img 
                            src={activeGalleryItem.src} 
                            alt={activeGalleryItem.title || "Gallery image"}
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <video
                          className="w-full h-full object-cover"
                          poster={meetingData.thumbnailImage}
                          controls={isVideoPlaying}
                          muted={!isVideoPlaying}
                          autoPlay={isVideoPlaying}
                        >
                          <source src={meetingData.backgroundVideo} type="video/mp4" />
                        </video>
                      )}
                      
                      {/* Play Button Overlay for Videos */}
                      {((activeGalleryItem?.type === 'video') || (!activeGalleryItem && meetingData.backgroundVideo)) && !isVideoPlaying && (
                        <button
                          onClick={handlePlayVideo}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 16 16">
                              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                          </div>
                        </button>
                      )}
                      
                      {/* Duration Badge for Videos */}
                      {(activeGalleryItem?.duration || (activeGalleryItem?.type === 'video' && !activeGalleryItem?.duration)) && (
                        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black/70 text-white px-2 py-1 rounded text-xs md:text-sm">
                          {activeGalleryItem?.duration || "15:21"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Scrollbar */}
            {meetingData.gallery && meetingData.gallery.length > 0 && (
              <div className="mb-12">
                <div className="max-w-4xl mx-auto">
                  <HorizontalScrollGallery 
                    className="mb-4"
                    itemsClassName="items-center"
                  >
                    {meetingData.gallery.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleGalleryItemClick(item)}
                        className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                          activeGalleryItem?.id === item.id 
                            ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/30' 
                            : 'hover:ring-2 hover:ring-white/30'
                        }`}
                      >
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
                        <div className="relative w-full h-full">
                          <img 
                            src={item.thumbnail || item.src} 
                            alt={item.title || "Gallery item"}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Video Play Icon Overlay */}
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="w-4 h-4 md:w-6 md:h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 md:w-3 md:h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                </svg>
                              </div>
                            </div>
                          )}
                          
                          {/* Duration Badge */}
                          {item.duration && (
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                              {item.duration}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </HorizontalScrollGallery>
                </div>
              </div>
            )}

            {/* Content Grid - Meeting Info and Join Card */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
            
              {/* Left Column - Meeting Info */}
              <div className="space-y-8">
                {/* Meeting Stats with Glassmorphism */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
                  <div className="relative p-6 grid grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-white">{meetingData.memberCount}</div>
                      <div className="text-sm text-zinc-400">Members</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-green-400">{meetingData.onlineCount}</div>
                      <div className="text-sm text-zinc-400">Online</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-blue-400">{meetingData.adminCount}</div>
                      <div className="text-sm text-zinc-400">Admins</div>
                    </div>
                  </div>
                </div>

              {/* Meeting Features */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
                <div className="relative p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    👍 Join {meetingData.title} to...
                  </h3>
                  <ul className="space-y-3">
                    {meetingData.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3 text-zinc-300">
                        <span className="text-cyan-400 font-bold">{index + 1}.</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Meeting Badges */}
              <div className="flex flex-wrap gap-3">
                {meetingData.isPrivate && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20"></div>
                    <div className="relative px-4 py-2 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-zinc-300" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zM3 6V3a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1z"/>
                      </svg>
                      <span className="text-sm text-zinc-300">Private</span>
                    </div>
                  </div>
                )}
                
                {meetingData.isFree && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 backdrop-blur-md rounded-full border border-green-400/30"></div>
                    <div className="relative px-4 py-2 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.5 4A1.5 1.5 0 0 0 1 5.5v.793c0 .026.009.051.025.076L8.25 15.5a.5.5 0 0 0 .5 0l7.225-9.131c.016-.025.025-.05.025-.076V5.5A1.5 1.5 0 0 0 14.5 4h-12z"/>
                      </svg>
                      <span className="text-sm text-green-400">Free</span>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-md rounded-full border border-blue-400/30"></div>
                  <div className="relative px-4 py-2 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.93 9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                    <span className="text-sm text-blue-400">By {meetingData.instructor}</span>
                    {meetingData.hasVerifiedBadge && (
                      <span className="text-yellow-400">⭐</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Join Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                {/* Main Join Card with Glassmorphism */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl shadow-black/30"></div>
                  <div className="relative p-8 text-center space-y-6">
                    {/* Logo/Avatar */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
                      <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {meetingData.title.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white">
                      {meetingData.title}
                    </h2>
                    <p className="text-sm text-zinc-400">
                      {meetingData.subtitle}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{meetingData.memberCount}</div>
                        <div className="text-xs text-zinc-400">Members</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-400">{meetingData.onlineCount}</div>
                        <div className="text-xs text-zinc-400">Online</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">{meetingData.adminCount}</div>
                        <div className="text-xs text-zinc-400">Admins</div>
                      </div>
                    </div>

                    {/* Join Button */}
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-lg">
                      JOIN GROUP
                    </Button>

                    {/* Powered by */}
                    <div className="flex items-center justify-center space-x-2 text-sm text-zinc-500">
                      <span>Powered by</span>
                      <span className="font-semibold text-zinc-400">{meetingData.poweredBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            </div> {/* Close Content Grid */}
          </div> {/* Close max-w-6xl mx-auto */}
        </div> {/* Close hero section */}
        </div> {/* Close Desktop Layout */}

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="relative z-10 px-4 py-20 space-y-6">
            
            {/* 1. Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white leading-tight mb-4">
                {meetingData.title}
              </h1>
            </div>

            {/* 2. URL */}
            <div className="text-center">
              <p className="text-lg text-cyan-300 font-medium">
                {meetingData.subtitle}
              </p>
            </div>

            {/* 3. Video */}
            {(activeGalleryItem || meetingData.backgroundVideo) && (
              <div className="px-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden">
                    {activeGalleryItem ? (
                      activeGalleryItem.type === 'video' ? (
                        <video
                          className="w-full h-full object-cover"
                          poster={activeGalleryItem.thumbnail}
                          controls={isVideoPlaying}
                          muted={!isVideoPlaying}
                          autoPlay={isVideoPlaying}
                        >
                          <source src={activeGalleryItem.src} type="video/mp4" />
                        </video>
                      ) : (
                        <img 
                          src={activeGalleryItem.src} 
                          alt={activeGalleryItem.title || "Gallery image"}
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <video
                        className="w-full h-full object-cover"
                        poster={meetingData.thumbnailImage}
                        controls={isVideoPlaying}
                        muted={!isVideoPlaying}
                        autoPlay={isVideoPlaying}
                      >
                        <source src={meetingData.backgroundVideo} type="video/mp4" />
                      </video>
                    )}
                    
                    {/* Play Button Overlay for Videos */}
                    {((activeGalleryItem?.type === 'video') || (!activeGalleryItem && meetingData.backgroundVideo)) && !isVideoPlaying && (
                      <button
                        onClick={handlePlayVideo}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all duration-300 group"
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                          </svg>
                        </div>
                      </button>
                    )}
                    
                    {/* Duration Badge for Videos */}
                    {(activeGalleryItem?.duration || (activeGalleryItem?.type === 'video' && !activeGalleryItem?.duration)) && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {activeGalleryItem?.duration || "15:21"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Gallery */}
            {meetingData.gallery && meetingData.gallery.length > 0 && (
              <div className="px-2">
                <HorizontalScrollGallery 
                  className="mb-4"
                  itemsClassName="items-center"
                >
                  {meetingData.gallery.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleGalleryItemClick(item)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                        activeGalleryItem?.id === item.id 
                          ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/30' 
                          : 'hover:ring-2 hover:ring-white/30'
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
                      <div className="relative w-full h-full">
                        <img 
                          src={item.thumbnail || item.src} 
                          alt={item.title || "Gallery item"}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Video Play Icon Overlay */}
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-4 h-4 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-white ml-0.5" fill="currentColor" viewBox="0 0 16 16">
                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        {/* Duration Badge */}
                        {item.duration && (
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                            {item.duration}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </HorizontalScrollGallery>
              </div>
            )}

            {/* 5. Tags (Free and by Instructor) */}
            <div className="flex flex-wrap justify-center gap-3 px-4">
              {meetingData.isPrivate && (
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20"></div>
                  <div className="relative px-4 py-2 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-zinc-300" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zM3 6V3a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1z"/>
                    </svg>
                    <span className="text-sm text-zinc-300">Private</span>
                  </div>
                </div>
              )}
              
              {meetingData.isFree && (
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 backdrop-blur-md rounded-full border border-green-400/30"></div>
                  <div className="relative px-4 py-2 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2.5 4A1.5 1.5 0 0 0 1 5.5v.793c0 .026.009.051.025.076L8.25 15.5a.5.5 0 0 0 .5 0l7.225-9.131c.016-.025.025-.05.025-.076V5.5A1.5 1.5 0 0 0 14.5 4h-12z"/>
                    </svg>
                    <span className="text-sm text-green-400">Free</span>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-md rounded-full border border-blue-400/30"></div>
                <div className="relative px-4 py-2 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm.93 9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                  <span className="text-sm text-blue-400">By {meetingData.instructor}</span>
                  {meetingData.hasVerifiedBadge && (
                    <span className="text-yellow-400">⭐</span>
                  )}
                </div>
              </div>
            </div>

            {/* 6. Join Group Button */}
            <div className="px-4">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl text-lg">
                JOIN GROUP
              </Button>
            </div>

            {/* 7. Members/Online/Admins Indicators */}
            <div className="px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
                <div className="relative p-6 grid grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">{meetingData.memberCount}</div>
                    <div className="text-sm text-zinc-400">Members</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-400">{meetingData.onlineCount}</div>
                    <div className="text-sm text-zinc-400">Online</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-400">{meetingData.adminCount}</div>
                    <div className="text-sm text-zinc-400">Admins</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Join to for X reasons Card */}
            <div className="px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
                <div className="relative p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    👍 Join {meetingData.title} to...
                  </h3>
                  <ul className="space-y-3">
                    {meetingData.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3 text-zinc-300">
                        <span className="text-cyan-400 font-bold">{index + 1}.</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 9. Short Description */}
            <div className="px-4 text-center">
              <p className="text-base text-zinc-300 leading-relaxed">
                {meetingData.description}
              </p>
            </div>

            {/* 10. Regular Join Group Card (at bottom) */}
            <div className="px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl shadow-black/30"></div>
                <div className="relative p-8 text-center space-y-6">
                  {/* Logo/Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
                    <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {meetingData.title.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-white">
                    {meetingData.title}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {meetingData.subtitle}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{meetingData.memberCount}</div>
                      <div className="text-xs text-zinc-400">Members</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">{meetingData.onlineCount}</div>
                      <div className="text-xs text-zinc-400">Online</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">{meetingData.adminCount}</div>
                      <div className="text-xs text-zinc-400">Admins</div>
                    </div>
                  </div>

                  {/* Join Button */}
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-lg">
                    JOIN GROUP
                  </Button>

                  {/* Powered by */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-zinc-500">
                    <span>Powered by</span>
                    <span className="font-semibold text-zinc-400">{meetingData.poweredBy}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div> {/* Close Mobile Layout */}
      </div> {/* Close hero container */}

      {/* Navigation Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300"
                >
                  ← Back to Meetings
                </Button>
              </Link>
              
              <Link href="/mytx/create">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300 flex items-center space-x-2"
                >
                  <CalendarIcon size={16} />
                  <span>Create Meeting</span>
                </Button>
              </Link>
              
              <Link href="/mytx/example">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300"
                >
                  View Example
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import Image from 'next/image';

interface MusicPlayerProps {
  title?: string;
  artist?: string;
  imageUrl?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  title = "All Of Me",
  artist = "Nao",
  imageUrl = "https://images.unsplash.com/photo-1619983081593-e2ba5b543168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDk1NzAwNDV8&ixlib=rb-4.1.0&q=80&w=400"
}) => {
  return (
    <div className="glass-container glass-container--rounded glass-container--large">
      <div className="glass-filter"></div>
      <div className="glass-overlay"></div>
      <div className="glass-specular"></div>
      <div className="glass-content">
        <div className="player">
          <div className="player__thumb">
            <Image
              className="player__img"
              src={imageUrl}
              alt={`${title} by ${artist}`}
              width={120}
              height={120}
              priority
            />
            <div className="player__legend">
              <h3 className="player__legend__title">{title}</h3>
              <span className="player__legend__sub-title">{artist}</span>
            </div>
          </div>
          <div className="player__controls">
            <svg viewBox="0 0 448 512" width="24">
              <path fill="black" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
            <svg viewBox="0 0 448 512" width="24">
              <path fill="black" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
            <svg viewBox="0 0 448 512" width="24">
              <path fill="black" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
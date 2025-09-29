import React from 'react';
import Image from 'next/image';

interface AppIcon {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}

export const AppDock: React.FC = () => {
  const apps: AppIcon[] = [
    {
      id: 'finder',
      name: 'Finder',
      imageUrl: 'https://assets.codepen.io/923404/finder.png',
      href: '#'
    },
    {
      id: 'maps',
      name: 'Maps',
      imageUrl: 'https://assets.codepen.io/923404/map.png',
      href: '#'
    },
    {
      id: 'messages',
      name: 'Messages',
      imageUrl: 'https://assets.codepen.io/923404/messages.png',
      href: '#'
    },
    {
      id: 'safari',
      name: 'Safari',
      imageUrl: 'https://assets.codepen.io/923404/safari.png',
      href: '#'
    },
    {
      id: 'books',
      name: 'Books',
      imageUrl: 'https://assets.codepen.io/923404/books.png',
      href: '#'
    }
  ];

  return (
    <div className="glass-container">
      <div className="glass-filter"></div>
      <div className="glass-overlay"></div>
      <div className="glass-specular"></div>
      <div className="glass-content">
        {apps.map((app) => (
          <a key={app.id} className="glass-content__link" href={app.href}>
            <Image src={app.imageUrl} alt={app.name} width={64} height={64} />
          </a>
        ))}
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <filter id="lensFilter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap in="SourceGraphic" in2="blur" scale="50" xChannelSelector="A" yChannelSelector="A" />
        </filter>
      </svg>
    </div>
  );
};
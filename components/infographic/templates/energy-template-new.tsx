export interface EnergyTemplateProps {
  orientation?: 'horizontal' | 'vertical';
}

export const getEnergyTemplate = ({ orientation = 'horizontal' }: EnergyTemplateProps = {}) => {
  const isVertical = orientation === 'vertical';
  
  return `<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  position: relative;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
}

.energy-core {
  width: ${isVertical ? '30vw' : '15vw'};
  height: ${isVertical ? '30vw' : '15vw'};
  border-radius: 50%;
  background: radial-gradient(circle, #00ffff 0%, #0080ff  50%, #4000ff 100%);
  position: relative;
  animation: pulse 2s infinite ease-in-out;
  box-shadow: 
    0 0 ${isVertical ? '8vw' : '4vw'} #00ffff,
    0 0 ${isVertical ? '15vw' : '8vw'} #0080ff,
    0 0 ${isVertical ? '25vw' : '12vw'} #4000ff;
  margin: ${isVertical ? '4vh' : '2vh'} 0;
}

.energy-ring {
  position: absolute;
  border: ${isVertical ? '3px' : '2px'} solid transparent;
  border-radius: 50%;
  animation: rotate 3s linear infinite;
}

.ring-1 {
  width: ${isVertical ? '35vw' : '18vw'};
  height: ${isVertical ? '35vw' : '18vw'};
  top: ${isVertical ? '-2.5vw' : '-1.5vw'};
  left: ${isVertical ? '-2.5vw' : '-1.5vw'};
  border-top-color: #00ffff;
  border-right-color: #00ffff;
}

.ring-2 {
  width: ${isVertical ? '40vw' : '21vw'};
  height: ${isVertical ? '40vw' : '21vw'};
  top: ${isVertical ? '-5vw' : '-3vw'};
  left: ${isVertical ? '-5vw' : '-3vw'};
  border-bottom-color: #0080ff;
  border-left-color: #0080ff;
  animation-direction: reverse;
  animation-duration: 4s;
}

.ring-3 {
  width: ${isVertical ? '45vw' : '24vw'};
  height: ${isVertical ? '45vw' : '24vw'};
  top: ${isVertical ? '-7.5vw' : '-4.5vw'};
  left: ${isVertical ? '-7.5vw' : '-4.5vw'};
  border-top-color: #4000ff;
  border-bottom-color: #4000ff;
  animation-duration: 5s;
}

.title {
  color: #00ffff;
  font-size: ${isVertical ? '7vw' : '4vw'};
  font-weight: bold;
  text-align: center;
  margin-bottom: ${isVertical ? '2vh' : '1vh'};
  text-shadow: 0 0 ${isVertical ? '2vw' : '1vw'} #00ffff;
  animation: textPulse 2s infinite ease-in-out;
}

.subtitle {
  color: #80c0ff;
  font-size: ${isVertical ? '4vw' : '2.5vw'};
  text-align: center;
  text-shadow: 0 0 ${isVertical ? '1vw' : '0.5vw'} #80c0ff;
  animation: subtitleGlow 3s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 ${isVertical ? '8vw' : '4vw'} #00ffff,
      0 0 ${isVertical ? '15vw' : '8vw'} #0080ff,
      0 0 ${isVertical ? '25vw' : '12vw'} #4000ff;
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 
      0 0 ${isVertical ? '12vw' : '6vw'} #00ffff,
      0 0 ${isVertical ? '20vw' : '12vw'} #0080ff,
      0 0 ${isVertical ? '35vw' : '18vw'} #4000ff;
  }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes textPulse {
  0%, 100% { 
    color: #00ffff;
    text-shadow: 0 0 ${isVertical ? '2vw' : '1vw'} #00ffff;
  }
  50% { 
    color: #ffffff;
    text-shadow: 0 0 ${isVertical ? '4vw' : '2vw'} #00ffff, 0 0 ${isVertical ? '6vw' : '3vw'} #0080ff;
  }
}

@keyframes subtitleGlow {
  0%, 100% { 
    opacity: 0.8;
    text-shadow: 0 0 ${isVertical ? '1vw' : '0.5vw'} #80c0ff;
  }
  50% { 
    opacity: 1;
    text-shadow: 0 0 ${isVertical ? '2vw' : '1vw'} #80c0ff, 0 0 ${isVertical ? '3vw' : '1.5vw'} #4000ff;
  }
}

.lightning {
  position: absolute;
  width: ${isVertical ? '0.5vw' : '0.3vw'};
  height: ${isVertical ? '20vh' : '15vh'};
  background: linear-gradient(180deg, transparent 0%, #00ffff 50%, transparent 100%);
  animation: lightning 0.1s infinite linear;
}

.lightning-1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
  animation-duration: 0.15s;
}

.lightning-2 {
  top: 20%;
  right: 25%;
  animation-delay: 0.5s;
  animation-duration: 0.12s;
}

.lightning-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: 1s;
  animation-duration: 0.18s;
}

.lightning-4 {
  bottom: 20%;
  right: 20%;
  animation-delay: 1.5s;
  animation-duration: 0.14s;
}

@keyframes lightning {
  0%, 90%, 100% { opacity: 0; }
  95% { opacity: 1; }
}

.energy-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.particle {
  position: absolute;
  width: ${isVertical ? '1vw' : '0.6vw'};
  height: ${isVertical ? '1vw' : '0.6vw'};
  background: #00ffff;
  border-radius: 50%;
  box-shadow: 0 0 ${isVertical ? '2vw' : '1vw'} #00ffff;
  animation: energyFloat 4s infinite ease-in-out;
}

.particle:nth-child(odd) {
  background: #0080ff;
  box-shadow: 0 0 ${isVertical ? '2vw' : '1vw'} #0080ff;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 0.5s; }
.particle:nth-child(3) { left: 30%; animation-delay: 1s; }
.particle:nth-child(4) { left: 40%; animation-delay: 1.5s; }
.particle:nth-child(5) { left: 50%; animation-delay: 2s; }
.particle:nth-child(6) { left: 60%; animation-delay: 2.5s; }
.particle:nth-child(7) { left: 70%; animation-delay: 3s; }
.particle:nth-child(8) { left: 80%; animation-delay: 3.5s; }

@keyframes energyFloat {
  0% { 
    transform: translateY(${isVertical ? '20vh' : '15vh'}) scale(0);
    opacity: 0;
  }
  50% { 
    transform: translateY(${isVertical ? '-10vh' : '-7vh'}) scale(1);
    opacity: 1;
  }
  100% { 
    transform: translateY(${isVertical ? '-40vh' : '-30vh'}) scale(0);
    opacity: 0;
  }
}
</style>
</head>
<body>
<div class="container">
  <div class="title">Pure Energy</div>
  <div class="energy-core">
    <div class="energy-ring ring-1"></div>
    <div class="energy-ring ring-2"></div>
    <div class="energy-ring ring-3"></div>
  </div>
  <div class="subtitle">Unleashing unlimited potential</div>
</div>

<div class="lightning lightning-1"></div>
<div class="lightning lightning-2"></div>
<div class="lightning lightning-3"></div>
<div class="lightning lightning-4"></div>

<div class="energy-particles">
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
</div>
</body>
</html>`;
};

export const EnergyTemplate = ({ orientation = 'horizontal' }: EnergyTemplateProps) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: getEnergyTemplate({ orientation }) 
      }} 
    />
  );
};

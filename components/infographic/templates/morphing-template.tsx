export interface MorphingTemplateProps {
  orientation?: 'horizontal' | 'vertical';
}

export const getMorphingTemplate = ({ orientation = 'horizontal' }: MorphingTemplateProps = {}) => {
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
  background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  text-align: center;
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.morph-container {
  width: ${isVertical ? '40vw' : '20vw'};
  height: ${isVertical ? '40vw' : '20vw'};
  position: relative;
  margin: ${isVertical ? '4vh' : '2vh'} 0;
}

.shape {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: absolute;
  animation: morph 6s infinite ease-in-out;
  box-shadow: 0 ${isVertical ? '2vh' : '1vh'} ${isVertical ? '4vh' : '2vh'} rgba(0,0,0,0.2);
}

.title {
  color: #333;
  font-size: ${isVertical ? '7vw' : '4vw'};
  font-weight: bold;
  margin-bottom: ${isVertical ? '2vh' : '1vh'};
  animation: textGlow 3s infinite ease-in-out;
}

.subtitle {
  color: #666;
  font-size: ${isVertical ? '4vw' : '2.5vw'};
  margin-top: ${isVertical ? '2vh' : '1vh'};
  animation: fadeInOut 4s infinite ease-in-out;
}

@keyframes morph {
  0% { 
    border-radius: 50%;
    transform: rotate(0deg) scale(1);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  25% { 
    border-radius: 20%;
    transform: rotate(90deg) scale(1.1);
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  50% { 
    border-radius: 0%;
    transform: rotate(180deg) scale(0.9);
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  75% { 
    border-radius: 30%;
    transform: rotate(270deg) scale(1.2);
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }
  100% { 
    border-radius: 50%;
    transform: rotate(360deg) scale(1);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}

@keyframes textGlow {
  0%, 100% { 
    text-shadow: 0 0 ${isVertical ? '2vw' : '1vw'} rgba(102, 126, 234, 0.5);
    color: #333;
  }
  50% { 
    text-shadow: 0 0 ${isVertical ? '4vw' : '2vw'} rgba(102, 126, 234, 0.8);
    color: #667eea;
  }
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: ${isVertical ? '1.5vw' : '0.8vw'};
  height: ${isVertical ? '1.5vw' : '0.8vw'};
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
  animation: float 8s infinite ease-in-out;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 1s; }
.particle:nth-child(3) { left: 30%; animation-delay: 2s; }
.particle:nth-child(4) { left: 40%; animation-delay: 3s; }
.particle:nth-child(5) { left: 50%; animation-delay: 4s; }
.particle:nth-child(6) { left: 60%; animation-delay: 1.5s; }
.particle:nth-child(7) { left: 70%; animation-delay: 2.5s; }
.particle:nth-child(8) { left: 80%; animation-delay: 3.5s; }

@keyframes float {
  0%, 100% { 
    transform: translateY(${isVertical ? '15vh' : '10vh'}) scale(0);
    opacity: 0;
  }
  50% { 
    transform: translateY(${isVertical ? '-15vh' : '-10vh'}) scale(1);
    opacity: 1;
  }
}
</style>
</head>
<body>
<div class="container">
  <div class="title">Constant Evolution</div>
  <div class="morph-container">
    <div class="shape"></div>
  </div>
  <div class="subtitle">Adapting and growing every day</div>
  <div class="particles">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
  </div>
</div>
</body>
</html>`;
};

export const MorphingTemplate = ({ orientation = 'horizontal' }: MorphingTemplateProps) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: getMorphingTemplate({ orientation }) 
      }} 
    />
  );
};

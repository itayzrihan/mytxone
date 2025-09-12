export interface ClimbingTemplateProps {
  orientation?: 'horizontal' | 'vertical';
}

export const getClimbingTemplate = ({ orientation = 'horizontal' }: ClimbingTemplateProps = {}) => {
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mountain {
  width: ${isVertical ? '60vw' : '25vw'};
  height: ${isVertical ? '30vh' : '25vh'};
  background: linear-gradient(45deg, #2c3e50 0%, #34495e 100%);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  position: relative;
  margin-bottom: ${isVertical ? '5vh' : '3vh'};
}

.climber {
  width: ${isVertical ? '6vw' : '3vw'};
  height: ${isVertical ? '6vw' : '3vw'};
  background: #e74c3c;
  border-radius: 50%;
  position: absolute;
  bottom: ${isVertical ? '20vh' : '15vh'};
  left: 50%;
  transform: translateX(-50%);
  animation: climb 4s infinite ease-in-out;
}

.climber::after {
  content: '';
  width: 2px;
  height: ${isVertical ? '4vw' : '2vw'};
  background: #c0392b;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.title {
  color: white;
  font-size: ${isVertical ? '6vw' : '4vw'};
  font-weight: bold;
  text-align: center;
  margin-bottom: ${isVertical ? '2vh' : '1vh'};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: fadeIn 2s ease-in;
}

.subtitle {
  color: rgba(255,255,255,0.9);
  font-size: ${isVertical ? '4vw' : '2.5vw'};
  text-align: center;
  animation: fadeIn 3s ease-in;
}

@keyframes climb {
  0% { transform: translateX(-50%) translateY(0px); }
  25% { transform: translateX(-40%) translateY(-5vh); }
  50% { transform: translateX(-60%) translateY(-10vh); }
  75% { transform: translateX(-35%) translateY(-15vh); }
  100% { transform: translateX(-50%) translateY(-20vh); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.progress-bar {
  width: 80%;
  height: ${isVertical ? '1.5vh' : '1vh'};
  background: rgba(255,255,255,0.2);
  border-radius: ${isVertical ? '1vh' : '0.5vh'};
  margin-top: ${isVertical ? '4vh' : '2vh'};
  overflow: hidden;
}

.progress-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #f39c12, #e67e22);
  border-radius: ${isVertical ? '1vh' : '0.5vh'};
  animation: progress 4s ease-in-out infinite;
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}
</style>
</head>
<body>
<div class="container">
  <div class="title">Reaching New Heights</div>
  <div class="mountain">
    <div class="climber"></div>
  </div>
  <div class="subtitle">Every step forward is progress</div>
  <div class="progress-bar">
    <div class="progress-fill"></div>
  </div>
</div>
</body>
</html>`;
};

export const ClimbingTemplate = ({ orientation = 'horizontal' }: ClimbingTemplateProps) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: getClimbingTemplate({ orientation }) 
      }} 
    />
  );
};

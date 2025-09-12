export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const generateVideoFromCanvas = async (
  canvas: HTMLCanvasElement,
  duration: number,
  fps: number = 30
): Promise<Blob> => {
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
  const chunks: Blob[] = [];

  return new Promise((resolve, reject) => {
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
    recorder.onerror = reject;

    recorder.start();
    setTimeout(() => {
      recorder.stop();
    }, duration * 1000);
  });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const animationSteps = {
  fadeIn: (progress: number) => ({ opacity: progress }),
  fadeOut: (progress: number) => ({ opacity: 1 - progress }),
  slideInTop: (progress: number) => ({ yOffset: (progress - 1) * 100 }),
  slideInBottom: (progress: number) => ({ yOffset: (1 - progress) * 100 }),
  slideInLeft: (progress: number) => ({ xOffset: (progress - 1) * 100 }),
  slideInRight: (progress: number) => ({ xOffset: (1 - progress) * 100 }),
  slideOutTop: (progress: number) => ({ yOffset: -progress * 100 }),
  slideOutBottom: (progress: number) => ({ yOffset: progress * 100 }),
  slideOutLeft: (progress: number) => ({ xOffset: -progress * 100 }),
  slideOutRight: (progress: number) => ({ xOffset: progress * 100 }),
  zoomIn: (progress: number) => ({ scale: progress }),
  zoomOut: (progress: number) => ({ scale: 1 - progress }),
  rotateIn: (progress: number) => ({ rotation: progress * 360 }),
  rotateOut: (progress: number) => ({ rotation: progress * 360 }),
  bounceIn: (progress: number) => {
    const bounce = progress < 0.5 ? 2 * progress * progress : 1 - 2 * (1 - progress) * (1 - progress);
    return { scale: bounce };
  },
  bounceOut: (progress: number) => {
    const bounce = progress < 0.5 ? 1 - 2 * progress * progress : 2 * (1 - progress) * (1 - progress);
    return { scale: bounce };
  },
};

export type AnimationStepResult = {
  opacity?: number;
  scale?: number;
  xOffset?: number;
  yOffset?: number;
  rotation?: number;
};

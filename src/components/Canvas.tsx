import React, { useRef, useEffect } from 'react';

export interface CanvasProps {
  width: number;
  height: number;
  r: number[];
  g: number[];
  b: number[];
}

export default function Canvas({ width, height, r, g, b }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const length = width * height;

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    const imageData = new ImageData(width, height);

    for (let i = 0; i < length; i += 1) {
      const idx = i * 4;

      imageData.data[idx] = r[i];
      imageData.data[idx + 1] = g[i];
      imageData.data[idx + 2] = b[i];
      imageData.data[idx + 3] = 255;
    }
    canvasRef.current.getContext('2d').putImageData(imageData, 0, 0);
  }, [width, height, r, g, b, canvasRef]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

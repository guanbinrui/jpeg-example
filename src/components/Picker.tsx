import React, { useRef, useCallback } from 'react';
import { rgb2yuv } from '../helpers';

export interface PickerData {
  r: number[];
  g: number[];
  b: number[];
  y: number[];
  cb: number[];
  cr: number[];
  width: number;
  height: number;
}

export interface PickerProps {
  onChange(data: PickerData): void;
}

export default function Picker({ onChange }: PickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFileChange = useCallback(() => {
    if (!canvasRef.current || !fileRef.current) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', ({ target }) => {
      const data = target.result as string;
      const image = new Image();

      image.addEventListener('load', () => {
        const context = canvasRef.current.getContext('2d');
        const { width, height } = image;

        canvasRef.current.width = width;
        canvasRef.current.height = height;
        context.drawImage(image, 0, 0, width, height);

        const { data } = context.getImageData(0, 0, width, height);
        const r = Array.from(data.filter((_, i) => i % 4 === 0));
        const g = Array.from(data.filter((_, i) => i % 4 === 1));
        const b = Array.from(data.filter((_, i) => i % 4 === 2));
        const y: number[] = [];
        const cb: number[] = [];
        const cr: number[] = [];

        for (let i = 0; i < data.length / 4; i += 1) {
          const [c1, c2, c3] = rgb2yuv(
            data[i * 4],
            data[i * 4 + 1],
            data[i * 4 + 2]
          );

          y.push(c1);
          cb.push(c2);
          cr.push(c3);
        }
        onChange({
          width,
          height,
          r,
          g,
          b,
          y,
          cb,
          cr,
        });
      });
      image.src = data;
    });
    reader.readAsDataURL(fileRef.current.files[0]);
  }, []);

  return (
    <>
      <canvas style={{ display: 'none' }} ref={canvasRef} />
      <input ref={fileRef} type="file" onChange={handleFileChange} />
    </>
  );
}

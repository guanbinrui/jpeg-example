import Canvas from './Canvas';
import {
  divide,
  shift,
  apply,
  unshift,
  quantize,
  dequantize,
  yuv2rgb,
  rgb2yuv,
} from '../helpers';
import React, { useState, useCallback } from 'react';
import Input from './Input';
import { dct, idct, QUANTIZATION_MATRIX } from '../dct';

export interface JPEGCanvasProps {
  width: number;
  height: number;
  r: number[];
  g: number[];
  b: number[];
}

export default function JPEGCanvas({
  width,
  height,
  r,
  g,
  b,
}: JPEGCanvasProps) {
  const [size, setSize] = useState(8);
  const [c1, setC1] = useState<number[]>([]);
  const [c2, setC2] = useState<number[]>([]);
  const [c3, setC3] = useState<number[]>([]);
  const [quality, setQuality] = useState(100);
  const handleButtonClick = useCallback(() => {
    const channels = [r.slice(0), g.slice(0), b.slice(0)];

    // rgb => yuv
    for (let i = 0; i < channels[0].length; i += 1) {
      [channels[0][i], channels[1][i], channels[2][i]] = rgb2yuv(
        channels[0][i],
        channels[1][i],
        channels[2][i]
      );
    }

    // dct
    channels
      .map(c => divide(width, height, size, c))
      .forEach((blocks, i) => {
        blocks.forEach(block => {
          shift(block);
          dct(block, size);
          quantize(block, QUANTIZATION_MATRIX, quality);
          dequantize(block, QUANTIZATION_MATRIX, quality);
          idct(block, size);
          unshift(block);
        });
        apply(width, height, size, channels[i], blocks);
      });

    // yuv => rgb
    for (let i = 0; i < channels[0].length; i += 1) {
      [channels[0][i], channels[1][i], channels[2][i]] = yuv2rgb(
        channels[0][i],
        channels[1][i],
        channels[2][i]
      );
    }

    // update
    setC1(channels[0]);
    setC2(channels[1]);
    setC3(channels[2]);
  }, [width, height, r, g, b, size, quality]);

  return (
    <>
      <Canvas r={c1} g={c2} b={c3} width={width} height={height} />
      <br />
      <Input
        label="Size: "
        type="number"
        defaultValue={String(size)}
        onChange={useCallback(
          ({ currentTarget }) => setSize(parseInt(currentTarget.value, 10)),
          []
        )}
      />
      <Input
        label="Quality: "
        type="number"
        defaultValue={String(quality)}
        onChange={useCallback(
          ({ currentTarget }) => setQuality(parseInt(currentTarget.value, 10)),
          []
        )}
      />
      <button onClick={handleButtonClick}>Generate</button>
    </>
  );
}

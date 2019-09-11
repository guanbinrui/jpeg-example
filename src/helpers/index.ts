export function rgb2yuv(r: number, g: number, b: number) {
  return [
    (77 / 256) * r + (150 / 256) * g + (29 / 256) * b,
    -(44 / 256) * r - (87 / 256) * g + (131 / 256) * b + 128,
    (131 / 256) * r - (110 / 256) * g - (21 / 256) * b + 128,
  ];
}

export function yuv2rgb(y: number, cb: number, cr: number) {
  return [
    y + 1.4075 * (cr - 128),
    y - 0.3455 * (cb - 128) - 0.7169 * (cr - 128),
    y + 1.779 * (cb - 128),
  ];
}

export function divide(
  width: number,
  height: number,
  size: number,
  data: number[]
) {
  const blocks: number[][] = [];

  for (let h = 0; h < height; h += size) {
    for (let w = 0; w < width; w += size) {
      const block: number[] = [];

      for (let h1 = 0; h1 < size; h1 += 1) {
        for (let w1 = 0; w1 < size; w1 += 1) {
          if (h + h1 < height && w + w1 < width) {
            block[h1 * size + w1] = data[(h + h1) * width + w + w1];
          } else {
            break;
          }
        }
      }
      if (block.length === size * size) {
        blocks.push(block);
      }
    }
  }
  return blocks;
}

export function apply(
  width: number,
  height: number,
  size: number,
  data: number[],
  blocks: number[][]
) {
  for (let i = 0; i < blocks.length; i += 1) {
    const h1 = Math.floor(i / Math.floor(width / size)) * size;
    const w1 = (i % Math.floor(width / size)) * size;

    for (let j = 0; j < size * size; j += 1) {
      const h2 = Math.floor(j / size);
      const w2 = j % size;

      data[(h1 + h2) * width + w1 + w2] = blocks[i][j];
    }
  }
}

export function shift(nums: number[]) {
  nums.forEach((num, i) => {
    nums[i] = num - 128;
  });
}

export function unshift(nums: number[]) {
  nums.forEach((num, i) => {
    nums[i] = num + 128;
  });
}

export function quantize(block: number[], matrix: number[], quality: number) {
  const alpha = quality <= 50 ? 50 / quality : 2 - quality / 50;

  for (let i = 0; i < block.length; i += 1) {
    block[i] = alpha ? Math.round(block[i] / (matrix[i] * alpha)) : block[i];
  }
}

export function dequantize(block: number[], matrix: number[], quality: number) {
  const alpha = quality <= 50 ? 50 / quality : 2 - quality / 50;

  for (let i = 0; i < block.length; i += 1) {
    block[i] = alpha ? block[i] * (matrix[i] * alpha) : block[i];
  }
}

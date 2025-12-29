// Jest setup file for browser environment simulation
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(callback, 16) as unknown as number;
};

global.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

// Mock canvas context
HTMLCanvasElement.prototype.getContext = function(
  type: string,
  ...args: any[]
): RenderingContext | null {
  if (type === '2d') {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      fillRect: jest.fn(),
      arc: jest.fn(),
      ellipse: jest.fn(),
      clearRect: jest.fn()
    } as unknown as CanvasRenderingContext2D;
  }
  return null;
};


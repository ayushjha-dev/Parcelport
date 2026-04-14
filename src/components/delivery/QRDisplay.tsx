'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRDisplayProps {
  data: string;
  size?: number;
}

export function QRDisplay({ data, size = 256 }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#04122e',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR Code generation failed:', error);
        }
      );
    }
  }, [data, size]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="rounded-xl shadow-lg" />
    </div>
  );
}

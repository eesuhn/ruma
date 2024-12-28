'use client';

import React, { useState, useCallback, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Result } from '@zxing/library';

interface QRScannerProps {
  onScan?: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scannerRef = useRef<any>(false);

  const handleScan = useCallback(
    (result: Result | null | undefined, error: Error | null | undefined) => {
      if (error) return;
      if (result && !scannerRef.current) {
        const text = result.getText();
        onScan?.(text);
        setIsOpen(false);
        scannerRef.current.stop();
      }
    },
    [onScan]
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-black text-white">
          <Camera className="mr-2 h-4 w-4" /> Scan Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          {isOpen && (
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              videoStyle={{ width: '100%', height: '100%' }}
              scanDelay={500}
              videoId="qr-reader-video"
            />
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Position the QR code in the center of the camera
        </p>
      </DialogContent>
    </Dialog>
  );
}

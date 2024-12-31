import { Ticket } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import Image from 'next/image';

export function QRTicket({
  qrUri,
  disabled,
}: {
  qrUri: string;
  disabled?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-black text-white"
          disabled={disabled}
        >
          <Ticket className="mr-2 h-4 w-4" />
          View Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Event Ticket</DialogTitle>
        </DialogHeader>
        <div className="aspect-auto w-full overflow-hidden rounded-lg flex justify-center">
          <Image src={qrUri} alt="Event ticket" width={300} height={300} />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Present this QR code to be scanned and checked-in
        </p>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Clock, QrCode, Tag } from 'lucide-react';

export function WhenAndWhere() {
  return (
    <Card className="overflow-hidden pb-4">
      <div className="relative h-48 w-full">
        <Image
          src="/landingimg.jpg?height=192&width=768"
          alt="Event Image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">Tech Innovation Summit 2024</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="h-4 w-4 mr-1" />
          <span>Technology, Innovation, Future</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex items-center space-x-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span>July 15, 2024</span>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>7:00 PM - 11:00 PM</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>123 Main St, Anytown, USA</span>
          </div>
        </div>
        <Button className="w-60 float-right mb-6">
          <QrCode className="mr-2 h-5 w-5" /> Check In Guest
        </Button>
      </CardContent>
    </Card>
  );
}

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhenAndWhere } from './WhenAndWhere';
import { GuestCheckIn } from './GuestCheckIn';
import { GuestManagement } from './GuestManagement';

export function OrganizerEventOverview() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-6">Event Overview</h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guests">Manage Guests</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <WhenAndWhere />
        </TabsContent>
        <TabsContent value="guests" className="mt-6">
          <GuestManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/EventCard';
import { useAnchorProgram } from '@/hooks/useAnchorProgram';

export default function Page() {
  const { getAllEventAcc } = useAnchorProgram();
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  return (
    <div className="container mx-auto px-72">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="upcoming" className="space-y-4">
          {UPCOMING_EVENTS.map((event) => (
            <EventCard
              key={event.name}
              {...event}
              showManage={event.showManage}
            />
          ))}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {PAST_EVENTS.map((event) => (
            <EventCard key={event.name} {...event} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

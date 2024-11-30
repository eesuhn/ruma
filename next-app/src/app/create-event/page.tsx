import { EventCreationForm } from '@/components/EventCreationForm';

export default function Page() {
  return (
    <main className="container mx-auto">
      <h1 className="ml-8 mt-6 text-3xl font-bold">Create a New Event</h1>
      <EventCreationForm />
    </main>
  );
}

import { EventCreationForm } from "@/components/EventCreationForm"

export default function CreateEvent() {
  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold ml-8 mt-6">Create a New Event</h1>
      <EventCreationForm />
    </main>
  )
}

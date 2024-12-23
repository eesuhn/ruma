import { EventData } from "@/types/state";
interface EventDetails {
  id: number;
  title: string;
  event_img: string;
  venue: string;
  address: string;
  time: number;
  date: Date;
  description: string;
  organizer: string;
  organizerimg: string;
}

export const events: EventData[] = [
  {
    bump: 1, // Example value
    isPublic: true, // Example value
    needsApproval: false, // Example value
    name: "Sample Event", // Example value
    image: "sample-image-url", // Example value
    capacity: 100, // Example value, or null/undefined
    startTimestamp: 1672531200, // Example value (timestamp), or null/undefined
    endTimestamp: 1672617600, // Example value (timestamp), or null/undefined
    location: "123 Event Street, City", // Example value, or null/undefined
    about: "This is a sample event description."
  },
  {
    bump: 2, // Example value
    isPublic: true, // Example value
    needsApproval: false, // Example value
    name: "Another Sample Event", // Example value
    image: "sample-image-url", // Example value
    capacity: 50, // Example value, or null/undefined
    startTimestamp: 1672531200, // Example value (timestamp), or null/undefined
    endTimestamp: 1672617600, // Example value (timestamp), or null/undefined
    location: "456 Event Street, City", // Example value, or null/undefined
    about: "This is another sample event description."
  }
];

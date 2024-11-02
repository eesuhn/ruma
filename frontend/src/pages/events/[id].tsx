import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoCalendarOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";


interface Event{
    id:number;
    title: string;
    event_img: string;
    venue: string;
    address:string;
    time: number; // Assuming time is in 24-hour format, e.g., 1300 for 1:00 PM
    date: Date;
    description:string;
    organizer:string;
    organizerimg:string
}


const events:Event[]=[
    {
        id:1,
        title: "Community Meetup",
        event_img: "/img/event1.png", // Example image path
        venue: "Tech Conference Center",
        address:"123, orchard road, merlion den",
        time: 1400,
        date: new Date("2024-12-12"),
        description:"test123",
        organizer:"gdsc_logo",
        organizerimg:"/img/gdsc_logo.png"
      },
      {
        id:2,
        title: "Annual Tech Summit",
        event_img: "/images/event2.jpg",
        venue: "Innovation Hub",
        address:"123, orchard road, merlion den",
        time: 900,
        date: new Date("2024-11-05"),
        description:"test123",
        organizer:"stc",
        organizerimg:"/img/gdsc_logo.png"
      },
      {
        id:3,
        title: "Startup Pitch Night",
        event_img: "/images/event3.jpg",
        venue: "Entrepreneurship Lounge",
        address:"123, orchard road, merlion den",
        time: 1830,
        date: new Date("2024-10-25"),
        description:"test123",
        organizer:"stc",
        organizerimg:"/img/gdsc_logo.png"
      },
      {
        id:4,
        title: "Startup Pitch Night",
        event_img: "/images/event3.jpg",
        venue: "Entrepreneurship Lounge",
        address:"123, orchard road, merlion den",
        time: 1830,
        date: new Date("2024-10-25"),
        description:"test123",
        organizer:"stc",
        organizerimg:"/img/gdsc_logo.png"
        },
      {
        id:5,
        title: "Startup Pitch Night",
        event_img: "/images/event3.jpg",
        venue: "Entrepreneurship Lounge",
        address:"123, orchard road, merlion den",
        time: 1830,
        date: new Date("2024-10-25"),
        description:"test123",
        organizer:"stc",
        organizerimg:"/img/gdsc_logo.png"
      },
      {
        id:6,
        title: "Startup Pitch Night",
        event_img: "/images/event3.jpg",
        venue: "Entrepreneurship Lounge",
        address:"123, orchard road, merlion den",
        description:"test123",
        organizer:"stc",
        time: 1830,
        date: new Date("2024-10-25"),
        organizerimg:"/img/gdsc_logo.png"
      },
      {
        id:7,
        title: "Startup Pitch Night",
        event_img: "/images/event3.jpg",
        venue: "Entrepreneurship Lounge",
        address:"123, orchard road, merlion den",
        description:"test123",
        time: 1830,
        date: new Date("2024-10-25"),
        organizer:"stc",
        organizerimg:"/img/gdsc_logo.png"
      },
];

export default function EventDetail(){
    const router = useRouter();
    const {id} =router.query;

    const event=events[Number(id)];

    if(!event){
        return <p>Loading....</p>
    }

    return(
        <div className="flex flex-row">
            <div>
                <img src={event.event_img} alt={event.title} className='w-full h-80 object-contain mb-2'/>
                <p className='font-bold text-[14px]'>Hosted by:</p>
                <div className='flex flex-row items-center ml-2'>
                    <Avatar className="w-12 h-12 mr-2">
                        <AvatarImage src={event.organizerimg} alt={event.organizer}/>
                        <AvatarFallback>
                            {event.organizer}
                        </AvatarFallback>
                    </Avatar>
                    <p className='font-semibold text-[18px]'>{event.organizer}</p>
                </div>
                
            </div>
            <div className='p-8 w-[600px]'>
                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                <div className='flex flex-row items-center ml-4 mb-2'>
                    <IoCalendarOutline className='text-[35px] mr-3 '/>
                    <div className='leading-6 '>
                        <p className='text-[24px] font-semibold'>{event.date.toDateString()}</p>
                        <p className='text-[16px] font-light '>{event.time}</p>
                    </div> 
                </div>
                <div className='flex flex-row items-center ml-4 mb-2 '>
                    <IoLocationOutline className='text-[35px] mr-3 '/>
                    <div className='leading-6 '>
                        <p className='text-[24px] font-semibold'>{event.venue}</p>
                        <p className='text-[16px] font-light '>{event.address}</p>
                    </div> 
                </div>

                <div className=' p-4 rounded-lg shadow-lg mb-2'>
                    <div className='bg-[#545454]/10 rounded-t-lg '>
                        <p className='font-semibold p-2'>Registration</p>
                    </div>
                    <p className='p-2 my-2'>Welcome! To join the event, please register below.</p>
                    <div className='bg-[#00A9DD] rounded-xl w-[60%] justify-self-center p-2 text-center hover:bg-blue-500 hover:cursor-pointer hover:scale-105'>
                       <p className='text-white font-semibold'>Request to join!</p> 
                    </div>
                </div>
                <p className='font-semibold'>About Event:</p>
                <p>{event.description}</p>
                
            </div>
            
        </div>
    )
}
export interface EventProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    status?: 'pending' | 'active';
    description?: string;
    endTime?: string;
    condition: 'registered' | '' | 'manage';
    registrationStatus?: 'pending' | 'going' | 'checked-in' | 'rejected';
  };
  showManage?: boolean;
}

import BookingSeat from '@/components/booking/booking';
import { sendRequest } from '../../../../utils/api';

const BookingPage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;

  const res = await sendRequest<IBackendRes<ISchedule>>({
    url: `${process.env.customURL}/schedule/getScheduleId/${slug}`,
    method: 'GET',
  });

  const res1 = await sendRequest<IBackendRes<IListSeat>>({
    url: `${process.env.customURL}/room-state/${slug}`,
    method: 'GET',
    nextOption: {
      next: { tags: ['handle-list-seat'] },
    },
  });

  return <BookingSeat movieSchedule={res.data!} listSeat={res1.data!} />;
};

export default BookingPage;

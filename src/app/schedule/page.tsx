import Schedule from '@/components/schedule/schedule';
import { sendRequest } from '../../../utils/api';

const SchedulePage = async () => {
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.BASE_URL}/movie/getDailyDates`,
    method: 'GET',
    nextOption: {
      cache: 'no-store',
    },
  });

  return <Schedule dailyDates={res.data ?? []} />;
};

export default SchedulePage;

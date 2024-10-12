import Home from '@/components/home/home';
import { sendRequest } from '../../utils/api';

const HomePage = async () => {
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.customURL}/movie/getAllMovie`,
    method: 'GET',
    queryParams: {
      page: 1,
      limit: 10,
      orderBy: 'desc',
      option: 'today',
    },
    nextOption: { cache: 'no-store' },
  });

  const res1 = await sendRequest<IBackendRes<any>>({
    url: `${process.env.customURL}/movie/getAllMovie`,
    method: 'GET',
    queryParams: {
      page: 1,
      limit: 10,
      orderBy: 'desc',
      option: 'upcoming',
    },
    nextOption: { cache: 'no-store' },
  });

  return <Home listMovieToday={res?.data ?? []} listMovieSoon={res1?.data ?? []} />;
};

export default HomePage;

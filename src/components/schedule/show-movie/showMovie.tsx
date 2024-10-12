import { useUserContext } from '@/lib/user.wrapper';
import { useCookies } from 'next-client-cookies';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';

interface IShowTime {
  date: string;
  roomName: string;
  timeStart: string;
  timeEnd: string;
}

interface IShowMovies {
  id: number;
  name: string;
  imageId: string;
  showTimes: IShowTime[];
}

interface Iprops {
  showMovie: IListMovie;
}

const ShowMovie = ({ showMovie }: Iprops) => {
  console.log('🚀 ~ ShowMovie ~ showMovie:', showMovie);
  const cookies = useCookies();
  const accessToken = cookies.get('accessToken');
  const router = useRouter();
  const { infoBooking, setInfoBooking } = useUserContext() as IBookingContext;

  const handleSchedule = (showTime: any) => {
    localStorage.setItem('scheduleId', JSON.stringify(showTime.id));
    if (!accessToken) {
      return router.push('/auth/login');
    }
    localStorage.removeItem('infoBooking');
    setInfoBooking({
      seatIds: [],
      seatNames: [],
      price: 0,
    });
    router.push(`/booking/${showTime.id}`);
  };

  return (
    <div className="md:mx-[85px] mx-[50px] mb-8">
      <h3 className="text-base truncate font-bold uppercase text-[#0E1D2F] pt-4 pb-5">
        {showMovie.name}
      </h3>
      <div className="md:flex pl-4">
        {/* <img src={showMovie.imagePath} className="w-[117px] h-[166px] mr-16" alt=""></img> */}
        <div className="w-[117px] h-[166px] mr-16">
          <img
            className="w-full h-full bg-cover object-cover"
            src={showMovie.imagePath}
            alt=""
          />
        </div>
        <div className="md:h-1/2 md:flex grid grid-cols-2">
          {showMovie.schedule.map((showTime) => (
            <div key={showTime.timeStart} onClick={() => handleSchedule(showTime)}>
              <div className="hover:bg-[#ff5400] transition duration-500 ease-in-out hover:text-white cursor-pointer h-full mt-3 md:mt-0">
                <div className="border border-solid border-[#e5e5e5]  px-3 py-1 text-lg font-medium whitespace-nowrap text-center">
                  <span>{showTime.timeStart}</span>-<span>{showTime.timeEnd}</span>
                </div>
                <div className="border border-t-0 border-solid border-[#e5e5e5]  px-3 text-center whitespace-nowrap">
                  <p>Phòng chiếu</p>
                  {/* <p>{showTime.room.roomName}</p> */}
                  <p>01</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowMovie;

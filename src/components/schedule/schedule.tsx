'use client';
import { useEffect, useState } from 'react';
import ShowMovie from './show-movie/showMovie';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { sendRequest } from '../../../utils/api';

interface IProps {
  dailyDates: string[];
}

const Schedule = ({ dailyDates }: IProps) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [pickDate, setPickDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [showMovies, setShowMovies] = useState<IListMovie[]>();

  const fetchSchedule = async () => {
    if (pickDate) {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/movie/getMovieFollowDay`,
        method: 'POST',
        body: { date: dayjs(pickDate).format('YYYY-MM-DD') },
        nextOption: {
          cache: 'no-store',
        },
      });

      if (res.data) {
        setShowMovies(res.data);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [pickDate]);

  const handleNextWeek = () => {
    setStartDate(startDate.add(7, 'day'));
  };

  const handlePreviousWeek = () => {
    setStartDate(startDate.subtract(7, 'day'));
  };

  const datesToShow = Array.from({ length: 7 }, (_, index) =>
    startDate.add(index, 'day')
  );

  // Kiểm tra ngày đầu tiên trong datesToShow có trùng với ngày hôm nay không
  const isToday = datesToShow[0].isSame(dayjs(), 'day');

  return (
    <div className="max-w-screen-xl w-full mx-auto mb-28 min-h-[500px]">
      <h2 className="px-[15px] py-[25px] text-2xl text-[#ff5400] font-medium">
        Lịch chiếu
      </h2>
      <div className="bg-[#F9F6EC] py-10">
        <h3 className="mt-5 mb-3 pl-[15px] font-medium text-[24px]">Chọn ngày chiếu</h3>
        <div className="flex items-center justify-center gap-4 mt-6">
          {!isToday && (
            <button 
              onClick={handlePreviousWeek} 
              className="text-lg mb-1 rounded-[50%] px-[8px] py-[8px] cursor-pointer hover:bg-[#ff5400] transition-colors duration-300 flex items-center justify-center"
            >
              <img
                className="lg:h-8 lg:w-8 h-5 w-5"
                src="/assets/previous_icon.png"
                alt="Previous"
              />
            </button>
          )}
          <div>
            <div className="text-center text-[22px]">Tháng {startDate.format('MM/YYYY')}</div>
            <ul className="grid grid-cols-3 lg:flex lg:justify-center lg:gap-16 gap-4 mt-4">
              {datesToShow.map((date, index) => (
                <li
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setPickDate(date)}
                >
                  <div className="text-lg mb-1">{date.format('dddd')}</div>
                  <div
                    className={`text-base inline px-[13px] py-[6px] ${
                      pickDate && date.isSame(pickDate, 'day') // Sửa đổi ở đây
                        ? 'bg-[#ff5400] text-white rounded-[50%]'
                        : ''
                    }`}
                  >
                    {date.format('DD')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleNextWeek}
            className="text-lg mb-1 rounded-[50%] px-[8px] py-[8px] cursor-pointer hover:bg-[#ff5400] hover:text-white transition-colors duration-300 flex items-center justify-center"
          >
            <img
              className="lg:h-8 lg:w-8 "
              src="/assets/next_icon.png"
              alt="Next"
            />
          </button>
        </div>
      </div>
      <h2 className="text-2xl pt-[20px] pb-[10px] pl-[15px] font-medium">
        Chọn lịch chiếu
      </h2>
      {showMovies?.map((showMovie) => (
        <ShowMovie key={showMovie.id} showMovie={showMovie ?? {}} />
      ))}
    </div>
  );
};

export default Schedule;







// 'use client';
// import { useEffect, useState } from 'react';
// import ShowMovie from './show-movie/showMovie';
// import dayjs from 'dayjs';
// import 'dayjs/locale/vi';
// import { sendRequest } from '../../../utils/api';

// interface IProps {
//   dailyDates: string[];
// }

// const Schedule = ({ dailyDates }: IProps) => {
//   // const [pickDate, setPickDate] = useState('');
//   const initialDate = dailyDates.length > 0 ? dayjs(dailyDates[0]) : null;
//   const [pickDate, setPickDate] = useState<dayjs.Dayjs | null>(initialDate);
//   const [showMovies, setShowMovies] = useState<IListMovie[]>();

//   const fetchSchedule = async () => {
//     if (pickDate) {
//       const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.customURL}/movie/getMovieFollowDay`,
//         method: 'POST',
//         body: { date: dayjs(pickDate).format('YYYY-MM-DD') },
//         nextOption: {
//           cache: 'no-store',
//         },
//       });

//       if (res.data) {
//         setShowMovies(res.data);
//       }
//     }
//   };

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);

//   useEffect(() => {
//     fetchSchedule();
//   }, [pickDate]);

//   return (
//     <div className="max-w-screen-xl w-full mx-auto mb-28 min-h-[500px]">
//       <h2 className="px-[15px] py-[25px] text-2xl text-[#ff5400] font-medium">
//         Lịch chiếu
//       </h2>
//       <div className="bg-[#F9F6EC] py-10">
//         <h3 className="mt-5 mb-3 pl-[15px] font-medium text-[24px]">Chọn ngày chiếu</h3>
//         <div>
//           <div className="text-center text-[22px]">Tháng {dayjs().format('MM')}</div>
//           <ul className="grid grid-cols-3 lg:flex lg:justify-center lg:gap-16 gap-4 mt-6">
//             {dailyDates.map((dateString, index) => {
//               const date = dayjs(dateString); // Chuyển đổi chuỗi thành đối tượng dayjs

//               return (
//                 <li
//                   key={index}
//                   className="flex flex-col items-center cursor-pointer"
//                   onClick={() => setPickDate(date)}
//                 >
//                   <div className="text-lg mb-1">{date.format('dddd')}</div>
//                   <div
//                     className={`text-base inline px-[13px] py-[6px] ${
//                       pickDate && date.format('DD') === pickDate.format('DD') // Kiểm tra nếu pickDate không null
//                         ? 'bg-[#ff5400] text-white rounded-[50%]'
//                         : ''
//                     }`}
//                   >
//                     {date.format('DD')}
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//       <h2 className="text-2xl pt-[20px] pb-[10px] pl-[15px] font-medium">
//         Chọn lịch chiếu
//       </h2>
//       {showMovies?.map((showMovie) => (
//         <ShowMovie key={showMovie.id} showMovie={showMovie ?? {}} />
//       ))}
//     </div>
//   );
// };

// export default Schedule;




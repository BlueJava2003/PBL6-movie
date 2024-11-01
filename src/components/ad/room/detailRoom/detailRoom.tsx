// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { sendRequest } from '../../../../../utils/api';
// import Link from 'next/link'; // Nhập Link từ next/router

// const DetailRoom = () => {
//   const { roomId } = useParams();
//   const [roomState, setRoomState] = useState<IRoomState | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchRoomDetail = async () => {
//     try {
//       setIsLoading(true);
//       const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.customURL}/room/getRoomDetail/${roomId}`,
//         method: 'GET',
//       });

//       if (res.data) {
//         setRoomState(res.data); // Lưu trạng thái phòng vào state
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRoomDetail();
//   }, [roomId]);

//   return (
//     <div className="w-full mx-auto max-w-screen-lg mt-5 mb-10 px-6">
//       <div className="grid lg:grid-cols-custom lg:gap-x-8 grid-cols-1 md:py-10 py-10">
//         {isLoading ? (
//           <div className="flex justify-center items-center my-12">
//             <p>Loading...</p>
//           </div>
//         ) : roomState ? (
//           <>
//             <h1 className="text-[22px] font-bold uppercase text-[#0E1D2F]">
//               {roomState.room.name} {/* Tên phòng */}
//             </h1>
//             <p className="text-[15px] leading-7 pt-6">
//               <span className="font-bold text-[#0e1d2f]">Sức chứa:</span>
//               <span> {roomState.room.capacity}</span> {/* Sức chứa */}
//             </p>
//             <p className="text-[15px] leading-7 pt-6">
//               <span className="font-bold text-[#0e1d2f]">Ghế còn trống:</span>
//               <span> {roomState.availableSeat}</span> {/* Ghế còn trống */}
//             </p>
//             <p className="text-[15px] leading-7 pt-6">
//               <span className="font-bold text-[#0e1d2f]">Ghế không còn trống:</span>
//               <span> {roomState.unavailableSeat}</span> {/* Ghế không còn trống */}
//             </p>
//             {/* Hiển thị thông tin lịch chiếu */}
//             <div className="pt-6">
//               <h2 className="font-bold text-[#0e1d2f]">Lịch chiếu:</h2>
//               {roomState.schedule.length > 0 ? (
//                 roomState.schedule.map((schedule) => (
//                   <div key={schedule.id} className="py-2">
//                     <p>
//                       <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
//                         Ngày chiếu:
//                       </span>
//                       <span> {schedule.date}</span> {/* Ngày chiếu */}
//                     </p>
//                     <p>
//                       <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
//                         Thời gian bắt đầu:
//                       </span>
//                       <span> {schedule.timeStart}</span> {/* Thời gian bắt đầu */}
//                     </p>
//                     <p>
//                       <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
//                         Thời gian kết thúc:
//                       </span>
//                       <span> {schedule.timeEnd}</span> {/* Thời gian kết thúc */}
//                     </p>
//                     <p>
//                       <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
//                         Phim:
//                       </span>
//                       <span> {schedule.movie.name}</span> {/* Tên phim */}
//                     </p>
//                     <hr className="my-2" />
//                   </div>
//                 ))
//               ) : (
//                 <p>Không có lịch chiếu nào.</p>
//               )}
//             </div>

//           </>
//         ) : (
//           <div className="flex justify-center items-center h-dvh">
//             <p>Room not found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DetailRoo
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ISchedule {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  movie: {
    name: string;
  };
}

interface IRoomState {
  room: {
    id: number;
    name: string;
    capacity: number;
  };
  availableSeat: number;
  unavailableSeat: number;
  schedule: ISchedule[];
}

const DetailRoom = () => {
  const { roomId } = useParams();
  const [roomState, setRoomState] = useState<IRoomState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tạo dữ liệu phòng mẫu
  const mockRoomDetail: IRoomState = {
    room: {
      id: 1,
      name: "Phòng A",
      capacity: 20,
    },
    availableSeat: 10,
    unavailableSeat: 10,
    schedule: [
      {
        id: 1,
        date: "2024-11-01",
        timeStart: "14:00",
        timeEnd: "16:00",
        movie: {
          name: "Phim 1",
        },
      },
      {
        id: 2,
        date: "2024-11-01",
        timeStart: "17:00",
        timeEnd: "19:00",
        movie: {
          name: "Phim 2",
        },
      },
    ],
  };

  const fetchRoomDetail = async () => {
    setIsLoading(true);
    try {
      // Thay thế việc gọi API bằng dữ liệu mẫu
      setTimeout(() => {
        setRoomState(mockRoomDetail);
      }, 1000); // Giả lập thời gian loading
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetail();
  }, [roomId]);

  return (
    <div className="w-full mx-auto max-w-screen-lg mt-5 mb-10 px-6">
      <div className="grid lg:grid-cols-custom lg:gap-x-8 grid-cols-1 md:py-10 py-10">
        {isLoading ? (
          <div className="flex justify-center items-center my-12">
            <p>Loading...</p>
          </div>
        ) : roomState ? (
          <>
            <h1 className="text-[22px] font-bold uppercase text-[#0E1D2F]">
              {roomState.room.name} {/* Tên phòng */}
            </h1>
            <p className="text-[15px] leading-7 pt-6">
              <span className="font-bold text-[#0e1d2f]">Sức chứa:</span>
              <span> {roomState.room.capacity}</span> {/* Sức chứa */}
            </p>
            <p className="text-[15px] leading-7 pt-6">
              <span className="font-bold text-[#0e1d2f]">Ghế còn trống:</span>
              <span> {roomState.availableSeat}</span> {/* Ghế còn trống */}
            </p>
            <p className="text-[15px] leading-7 pt-6">
              <span className="font-bold text-[#0e1d2f]">Ghế không còn trống:</span>
              <span> {roomState.unavailableSeat}</span> {/* Ghế không còn trống */}
            </p>
            {/* Hiển thị thông tin lịch chiếu */}
            <div className="pt-6">
              <h2 className="font-bold text-[#0e1d2f]">Lịch chiếu:</h2>
              {roomState.schedule.length > 0 ? (
                roomState.schedule.map((schedule) => (
                  <div key={schedule.id} className="py-2">
                    <p>
                      <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
                        Ngày chiếu:
                      </span>
                      <span> {schedule.date}</span> {/* Ngày chiếu */}
                    </p>
                    <p>
                      <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
                        Thời gian bắt đầu:
                      </span>
                      <span> {schedule.timeStart}</span> {/* Thời gian bắt đầu */}
                    </p>
                    <p>
                      <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
                        Thời gian kết thúc:
                      </span>
                      <span> {schedule.timeEnd}</span> {/* Thời gian kết thúc */}
                    </p>
                    <p>
                      <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
                        Phim:
                      </span>
                      <span> {schedule.movie.name}</span> {/* Tên phim */}
                    </p>
                    <hr className="my-2" />
                  </div>
                ))
              ) : (
                <p>Không có lịch chiếu nào.</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-dvh">
            <p>Room not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailRoom;

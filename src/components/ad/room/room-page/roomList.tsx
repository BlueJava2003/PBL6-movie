// "use client";
// import { useEffect, useState } from "react";
// import { sendRequest } from "../../../../../utils/api";
// import { Empty, Spin, Button, notification } from "antd";
// import ReactPaginate from "react-paginate";
// import Link from "next/link";

// const RoomList = () => {
//   const [listRooms, setListRooms] = useState<IListRoom[]>([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchListRoom = async (page: number) => {
//     try {
//       setIsLoading(true);
//       const res = await sendRequest<IBackendRes<any>>({
//         url: `${process.env.customURL}/ad /room/getAllRooms?page=${page}`,
//         method: "GET",
//       });

//       if (res.data) {
//         setListRooms(res.data.rooms);
//         setTotalPages(res.data.totalPages);
//       }
//     } catch (error) {
//       notification.error({ message: "Failed to fetch room list." });
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchListRoom(currentPage);
//   }, [currentPage]);

//   const handlePageClick = (event: { selected: number }) => {
//     setCurrentPage(event.selected);
//   };

//   // const handleDelete = async (roomId: number) => {
//   //   try {
//   //     await sendRequest<IBackendRes<any>>({
//   //       url: `${process.env.customURL}/room/deleteRoom/${roomId}`,
//   //       method: "DELETE",
//   //     });
//   //     fetchListRoom(currentPage);
//   //     notification.success({ message: "Room deleted successfully!" });
//   //   } catch (error) {
//   //     notification.error({ message: "Failed to delete room." });
//   //     console.error(error);
//   //   }
//   // };

//   return (
//     <div className="w-full mx-auto max-w-screen-lg min-h-[600px]">
//       <div className="font-medium mt-4 flex flex-col md:flex-row justify-between px-3 md:px-0">
//         {isLoading ? (
//           <div className="flex justify-center items-center my-12">
//             <Spin size="large" />
//           </div>
//         ) : listRooms.length ? (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-12 mx-5">
//             {listRooms.map((room) => (
//               <div key={room.id} className="border p-4 rounded-lg shadow-md border-[#E50914]">
//                 {/* Khung bao quanh */}
//                 <div className="border p-4 rounded-lg">
//                   <h2 className="text-lg font-bold">{room.name}</h2>
//                   <p className="text-gray-600">Capacity: {room.capacity}</p>
//                   <div className="flex justify-between mt-4">
//                     {/* Nút "Details" */}
//                     <Link href={`/detailRoom/${room.id}`}>
//                       <Button className="px-[23px] py-[10px] bg-[#0e1d2f] text-white rounded-3xl border-none uppercase font-bold text-[13px]">
//                         Details
//                       </Button>
//                     </Link>
//                     {/* Nút "Edit" */}
//                     <Link href={`/editRoom/${room.id}`}>
//                       <Button className="px-[23px] py-[10px] bg-yellow-500 text-white rounded-3xl border-none uppercase font-bold text-[13px]">
//                         Edit
//                       </Button>
//                     </Link>
//                     {/* Nút "Delete" */}
//                     <Button 
//                       //onClick={() => handleDelete(room.id)}
//                       className="px-[23px] py-[10px] bg-red-500 text-white rounded-3xl border-none uppercase font-bold text-[13px]"
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="flex justify-center items-center h-dvh">
//             <Empty />
//           </div>
//         )}
//       </div>

//       {totalPages > 0 && (
//         <ReactPaginate
//           breakLabel="..."
//           nextLabel="next >"
//           onPageChange={handlePageClick}
//           pageRangeDisplayed={5}
//           pageCount={totalPages}
//           previousLabel="< previous"
//           renderOnZeroPageCount={null}
//           containerClassName="flex justify-center my-4"
//           pageClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
//           previousClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
//           nextClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
//           breakClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
//           activeClassName="bg-blue-500 text-white"
//           disabledClassName="opacity-50 cursor-not-allowed"
//         />
//       )}
//     </div>
//   );
// };

// export default RoomList;
"use client";
import { useEffect, useState } from "react";
import { Empty, Spin, Button, notification } from "antd";
import ReactPaginate from "react-paginate";
import Link from "next/link";

interface IListRoom {
  id: number;
  name: string;
  capacity: number;
}

const RoomList = () => {
  const [listRooms, setListRooms] = useState<IListRoom[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Tạo danh sách phòng mẫu
  const mockRooms = [
    { id: 1, name: "Phòng A", capacity: 20 },
    { id: 2, name: "Phòng B", capacity: 30 },
    { id: 3, name: "Phòng C", capacity: 15 },
    { id: 4, name: "Phòng D", capacity: 25 },
    { id: 5, name: "Phòng E", capacity: 10 },
    { id: 6, name: "Phòng F", capacity: 50 },
    { id: 7, name: "Phòng G", capacity: 40 },
    { id: 8, name: "Phòng H", capacity: 35 },
  ];

  const fetchListRoom = async (page: number) => {
    // Thay thế phần lấy dữ liệu từ API bằng dữ liệu mẫu
    setIsLoading(true);
    try {
      setTimeout(() => {
        const start = page * 4; // Giả sử mỗi trang có 4 phòng
        const roomsToShow = mockRooms.slice(start, start + 4);
        setListRooms(roomsToShow);
        setTotalPages(Math.ceil(mockRooms.length / 4)); // Tính tổng số trang
      }, 1000); // Giả lập thời gian loading
    } catch (error) {
      notification.error({ message: "Failed to fetch room list." });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListRoom(currentPage);
  }, [currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="w-full mx-auto max-w-screen-lg min-h-[600px]">
      <div className="font-medium mt-4 flex flex-col md:flex-row justify-between px-3 md:px-0">
        {isLoading ? (
          <div className="flex justify-center items-center my-12">
            <Spin size="large" />
          </div>
        ) : listRooms.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-12 mx-5">
            {listRooms.map((room) => (
              <div key={room.id} className="border p-4 rounded-lg shadow-md border-[#E50914]">
                <div className="border p-4 rounded-lg">
                  <h2 className="text-lg font-bold">{room.name}</h2>
                  <p className="text-gray-600">Capacity: {room.capacity}</p>
                  <div className="flex justify-between mt-4">
                    <Link href={`/detailRoom/${room.id}`}>
                      <Button className="px-[23px] py-[10px] bg-[#0e1d2f] text-white rounded-3xl border-none uppercase font-bold text-[13px]">
                        Details
                      </Button>
                    </Link>
                    <Link href={`/editRoom/${room.id}`}>
                      <Button className="px-[23px] py-[10px] bg-yellow-500 text-white rounded-3xl border-none uppercase font-bold text-[13px]">
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      //onClick={() => handleDelete(room.id)}
                      className="px-[23px] py-[10px] bg-red-500 text-white rounded-3xl border-none uppercase font-bold text-[13px]">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-dvh">
            <Empty />
          </div>
        )}
      </div>

      {totalPages > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          containerClassName="flex justify-center my-4"
          pageClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
          previousClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
          nextClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
          breakClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
          activeClassName="bg-blue-500 text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}
    </div>
  );
};

export default RoomList;


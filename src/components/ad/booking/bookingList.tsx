'use client';

import { useState, useEffect } from 'react';
import { sendRequest } from '@/utils/api';
import { Spin, Empty } from 'antd';
import ReactPaginate from 'react-paginate';
import { parseCookies } from 'nookies';  // Import parseCookies từ nookies

// BookingList component
const BookingList = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]); // Dữ liệu bookings
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại

  // Hàm gọi API để lấy danh sách booking cho ADMIN
  const fetchBookings = async (page: number) => {
    try {
      setIsLoading(true); // Bắt đầu loading

      // Lấy token từ cookie
      const cookies = parseCookies();
      const token = cookies.accessToken;  // Lấy token từ cookie

      if (!token) {
        throw new Error("Token not found!");
      }

      // Gửi yêu cầu GET để lấy dữ liệu bookings
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/booking/admin/all?page=${page}`, // API lấy tất cả booking cho ADMIN
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Thêm token vào headers
        },
      });

      if (res.data) {
        setBookings(res.data); // Lưu danh sách booking vào state
        setTotalPages(res.data.totalPages); // Cập nhật tổng số trang
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Gọi hàm fetchBookings khi component mount hoặc khi trang thay đổi
  useEffect(() => {
    fetchBookings(currentPage);
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
        ) : bookings.length ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 my-12 mx-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`border p-6 rounded-lg shadow-md w-full ${booking.isDeleted ? 'bg-gray-400' : 'bg-white'}`} // Thêm điều kiện màu nền
                style={{ marginBottom: '20px' }}
              >
                <div className="border p-4 rounded-lg">
                  <h2 className="text-lg font-bold mb-2">{booking.schedule.movie.name}</h2>
                  <p className="text-gray-600">State: {booking.state}</p>
                  <p className="text-gray-600">Date: {booking.schedule.date}</p>
                  <p className="text-gray-600">Time: {booking.schedule.timeStart} - {booking.schedule.timeEnd}</p>
                  <p className="text-gray-600">Room: {booking.seatBooked.room.roomName}</p>
                  <p className="text-gray-600">Account ID: {booking.accountID}</p>
                  <p className="text-gray-600">
                    Seats: {booking.seatBooked.seats.map((seat) => seat.name).join(', ')} {/* Hiển thị nhiều ghế ngồi */}
                  </p>
                  <p className="text-gray-600">Total Price: {booking.totalPrice} VND</p>
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

export default BookingList;

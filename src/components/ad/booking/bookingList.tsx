"use client";

import { useState, useEffect } from "react";
import { sendRequest } from "@/utils/api";
import { Spin, Empty } from "antd";
import ReactPaginate from "react-paginate";
import { parseCookies } from "nookies";

interface IBooking {
  id: number;
  accountId: number;
  scheduleId: number;
  seatsBooked: [];
  state: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  schedule: {
    timeStart: string;
    timeEnd: string;
    date: string;
    roomState: {
      room: {
        id: number;
        roomName: string;
      };
    };
    movie: {
      id: number;
      name: string;
    };
  };
}

interface IBackendRes<T> {
  data: T[];
  // Add other properties if needed
}

export default function BookingList() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);

      const cookies = parseCookies();
      const token = cookies.accessToken;
      if (!token) {
        throw new Error("Token not found!");
      }

      const res = await sendRequest<IBackendRes<IBooking>>({
        url: `${process.env.customURL}/booking/admin/all`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setBookings(res.data); // Set the bookings directly from res.data
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]); // Fetch bookings when currentPage changes

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
              <div key={booking.id} className="border p-6 rounded-lg shadow-md w-full bg-white">
                <div className="border p-4 rounded-lg">
                  <h2 className="text-lg font-bold mb-2">{booking.schedule.movie.name}</h2>
                  <p className="text-gray-600">State: {booking.state}</p>
                  <p className="text-gray-600">Date: {booking.schedule.date}</p>
                  <p className="text-gray-600">
                    Time: {booking.schedule.timeStart} - {booking.schedule.timeEnd}
                  </p>
                  <p className="text-gray-600">Room: {booking.schedule.roomState.room.roomName}</p>
                  <p className="text-gray-600">Account ID: {booking.accountId}</p>
                  <p className="text-gray-600">Seats: {booking.seatsBooked.join(", ")}</p>
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

      {totalPages > 1 && (
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
}

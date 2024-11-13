"use client";

import { useState, useEffect } from "react";
import { sendRequest } from "@/utils/api";
import { Spin, Empty } from "antd";
import ReactPaginate from "react-paginate";
import { parseCookies } from "nookies";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, UserIcon, CreditCardIcon, SofaIcon } from "lucide-react";

interface IBooking {
  id: number;
  accountId: number;
  scheduleId: number;
  seatsBooked: string[];
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
        setBookings(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, "h:mm a");
  };

  const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full mx-auto max-w-screen-xl min-h-[600px] p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Booking List</h1>
      {isLoading ? (
        <div className="flex justify-center items-center my-12">
          <Spin size="large" />
        </div>
      ) : bookings.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
          {bookings.map((booking) => (
            <Card key={booking.id} className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{booking.schedule.movie.name}</span>
                  <Badge className={`${getStatusColor(booking.state)} text-white`}>{booking.state}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>{formatDate(booking.schedule.date)}</span>
                </div>
                <div className="flex items-center">
                  <SofaIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>{booking.schedule.roomState.room.roomName}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>Account ID: {booking.accountId}</span>
                </div>
                <div className="flex items-center">
                  <SofaIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>Seats: {booking.seatsBooked.join(", ")}</span>
                </div>
                <div className="flex items-center">
                  <CreditCardIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>{booking.totalPrice.toLocaleString()} VND</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[60vh]">
          <Empty description="No bookings found" />
        </div>
      )}

      {totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel="< Previous"
          renderOnZeroPageCount={null}
          containerClassName="flex justify-center items-center space-x-2 mt-8"
          pageClassName="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          previousClassName="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          nextClassName="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
          breakClassName="px-3 py-2"
          activeClassName="bg-primary text-primary-foreground"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { parseCookies } from "nookies";
import { sendRequest } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, FilmIcon, MapPinIcon, TicketIcon, CreditCardIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useQRCode } from "next-qrcode";

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

interface ISeat {
  id: string;
  name: string;
  seatTypeId: number;
}

interface IBackendRes<T> {
  data: T;
  message: string;
}

export default function History() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [seatNames, setSeatNames] = useState<{ [key: string]: ISeat }>({});
  const params = useParams();
  const userId = params.id as string;
  const { Image } = useQRCode();

  useEffect(() => {
    console.log("userId", userId);
    const fetchBookings = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.accessToken;
        const res = await sendRequest<IBackendRes<IBooking[]>>({
          url: `${process.env.customURL}/booking/admin/account/${userId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setBookings(res.data);
          fetchSeatNames(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const fetchSeatNames = async (bookings: IBooking[]) => {
    const cookies = parseCookies();
    const token = cookies.accessToken;
    const seatIds = bookings.flatMap((booking) => booking.seatsBooked);
    const uniqueSeatIds = Array.from(new Set(seatIds));

    try {
      const seatPromises = uniqueSeatIds.map((seatId) =>
        sendRequest<IBackendRes<ISeat>>({
          url: `${process.env.customURL}/seat/${seatId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const seatResponses = await Promise.all(seatPromises);
      const newSeatNames: { [key: string]: ISeat } = {};

      seatResponses.forEach((response) => {
        if (response.data) {
          newSeatNames[response.data.id] = response.data;
        }
      });

      setSeatNames(newSeatNames);
    } catch (error) {
      console.error("Failed to fetch seat names:", error);
    }
  };

  const formatSeatName = (seat: ISeat) => {
    return seat.seatTypeId === 5 ? `${seat.name} (VIP)` : seat.name;
  };

  const generateTicketQRUrl = (booking: IBooking) => {
    const ticketData = {
      movieName: booking.schedule.movie.name,
      date: format(new Date(booking.schedule.date), "dd-MM-yyyy"),
      time: format(new Date(booking.schedule.date), "HH:mm"),
      seats: booking.seatsBooked
        .map((seatId) => (seatNames[seatId] ? formatSeatName(seatNames[seatId]) : seatId))
        .join(", "),
      room: booking.schedule.roomState.room.roomName,
      price: booking.totalPrice,
    };
    const encodedData = encodeURIComponent(JSON.stringify(ticketData));
    return `http://192.168.1.14:3000/ticket-info?data=${encodedData}`;
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Vé đã đặt gần đây</h1>
        <div className="space-y-8">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary to-primary-foreground text-white">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold">{booking.schedule.movie.name}</span>
                  <Badge
                    variant={booking.state === "Đã thanh toán" ? "default" : "secondary"}
                    className={`text-sm px-3 py-1 ${
                      booking.state === "Đã thanh toán"
                        ? "bg-green-500 hover:bg-green-600 text-white font-medium"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    {booking.state}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoItem
                    icon={<MapPinIcon className="w-5 h-5" />}
                    label="Phòng chiếu"
                    value={booking.schedule.roomState.room.roomName}
                  />
                  <InfoItem
                    icon={<CalendarIcon className="w-5 h-5" />}
                    label="Ngày chiếu"
                    value={format(new Date(booking.schedule.date), "dd-MM-yyyy")}
                  />
                  <InfoItem
                    icon={<ClockIcon className="w-5 h-5" />}
                    label="Giờ chiếu"
                    value={format(new Date(booking.schedule.date), "HH:mm")}
                  />
                  <InfoItem
                    icon={<TicketIcon className="w-5 h-5" />}
                    label="Loại vé"
                    value={`Vé thường (x${booking.seatsBooked.length})`}
                  />
                  <InfoItem
                    icon={<FilmIcon className="w-5 h-5" />}
                    label="Ghế"
                    value={booking.seatsBooked
                      .map((seatId) => (seatNames[seatId] ? formatSeatName(seatNames[seatId]) : seatId))
                      .join(", ")}
                  />
                  <InfoItem
                    icon={<CreditCardIcon className="w-5 h-5" />}
                    label="Tổng thanh toán"
                    value={booking.totalPrice.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                    valueClassName="text-primary font-bold"
                  />
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <p>Ngày đặt: {format(new Date(booking.createdAt), "dd-MM-yyyy HH:mm")}</p>
                    <p>Mã đặt vé: {booking.id}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      text={generateTicketQRUrl(booking)}
                      options={{
                        errorCorrectionLevel: "M",
                        margin: 3,
                        scale: 4,
                        width: 100,
                        color: {
                          dark: "#000000",
                          light: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoItem({ icon, label, value, valueClassName = "" }: InfoItemProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 text-gray-500">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`font-medium ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}

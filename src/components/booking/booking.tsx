"use client";

import { useUserContext } from "@/lib/user.wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ISeat {
  seatId: number;
  name: string;
  isReserved: boolean;
  type: string;
  price: number;
}

interface IListSeat {
  seats: ISeat[];
  room: {
    roomName: string;
  };
}

interface ISchedule {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  movie: {
    name: string;
    imagePath: string;
  };
}

interface Iprops {
  listSeat: IListSeat;
  movieSchedule: ISchedule;
}

interface IBookingContext {
  infoBooking: {
    seatNames?: string[];
    seatIds?: number[];
    price?: number;
  };
  setInfoBooking: (info: any) => void;
}

interface INotification {
  message: string;
  type: "success" | "error";
}

export default function Component({ listSeat, movieSchedule }: Iprops) {
  const router = useRouter();
  const { infoBooking, setInfoBooking } = useUserContext() as IBookingContext;
  const [selectSeatNames, setSelectSeatNames] = useState<string[]>([]);
  const [selectSeatIds, setSelectSeatIds] = useState<number[]>([]);
  const [countPrice, setCountPrice] = useState<number>(0);
  const [notification, setNotification] = useState<INotification | null>(null);

  useEffect(() => {
    router.refresh();
    setSelectSeatNames(infoBooking.seatNames || []);
    setSelectSeatIds(infoBooking.seatIds || []);
    setCountPrice(infoBooking.price || 0);
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSeat = (seat: ISeat) => {
    if (selectSeatNames.length === 8 && !selectSeatNames.includes(seat.name)) {
      return showNotification("Bạn chỉ được đặt tối đa 8 ghế!", "error");
    }
    if (selectSeatNames.includes(seat.name)) {
      setSelectSeatNames((prev) => prev.filter((item) => item !== seat.name));
      setSelectSeatIds((prev) => prev.filter((item) => item !== seat.seatId));
      setCountPrice((prev) => prev - seat.price);
    } else {
      setSelectSeatNames((prev) => [...prev, seat.name]);
      setSelectSeatIds((prev) => [...prev, seat.seatId]);
      setCountPrice((prev) => prev + seat.price);
    }
  };

  const renderSeat = (seat: ISeat) => {
    const isSelected = selectSeatNames.includes(seat.name);
    const seatClasses = `
      h-8 w-8 text-xs font-medium rounded-t-lg
      flex items-center justify-center transition-all duration-200 ease-in-out
      ${
        seat.isReserved
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : isSelected
          ? "bg-green-500 text-white"
          : seat.type === "VIP"
          ? "bg-amber-300 hover:bg-amber-400 text-amber-800"
          : "bg-blue-300 hover:bg-blue-400 text-blue-800"
      }
      ${!seat.isReserved && "cursor-pointer hover:scale-105"}
    `;

    return (
      <button
        key={seat.seatId}
        className={seatClasses}
        onClick={() => !seat.isReserved && handleSeat(seat)}
        disabled={seat.isReserved}
        aria-label={`Seat ${seat.name}`}
      >
        {seat.name}
      </button>
    );
  };

  const renderSeatRow = (rowSeats: ISeat[], isSideRow: boolean = false) => (
    <div className={`flex justify-center gap-1 mb-1 ${isSideRow ? "px-2 py-1 bg-gray-100 rounded" : ""}`}>
      {rowSeats.map(renderSeat)}
    </div>
  );

  const renderSeatLayout = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    return rows.map((row) => {
      const rowSeats = listSeat.seats.filter((seat) => seat.name.startsWith(row));
      const leftSeats = rowSeats.slice(0, 2);
      const centerSeats = rowSeats.slice(2, 8);
      const rightSeats = rowSeats.slice(8);

      return (
        <div key={row} className="flex justify-center gap-4">
          {renderSeatRow(leftSeats, true)}
          {renderSeatRow(centerSeats)}
          {renderSeatRow(rightSeats, true)}
        </div>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Chọn ghế</h1>
      {notification && (
        <div
          className={`mb-4 p-4 rounded-md ${
            notification.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          } flex justify-between items-center`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
      )}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sơ đồ ghế - {listSeat.room.roomName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gray-900 to-transparent opacity-50"></div>
              <div
                className="mx-auto mt-4 mb-12 py-2 px-8 text-center text-white font-bold rounded-md relative z-10"
                style={{
                  background: "linear-gradient(45deg, #4a0e0e, #8b0000)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                MÀN HÌNH
              </div>
            </div>
            <ScrollArea className="h-[480px] w-full rounded-md border p-4">{renderSeatLayout()}</ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-300 rounded"></div>
                <span className="text-sm">Ghế thường</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-300 rounded"></div>
                <span className="text-sm">Ghế VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
                <span className="text-sm">Ghế đã đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span className="text-sm">Ghế đang chọn</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin đặt vé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
              <img
                src={movieSchedule?.movie?.imagePath}
                alt={movieSchedule.movie.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-xl font-bold mb-2">{movieSchedule.movie.name}</h2>
                <p className="text-sm opacity-75">{movieSchedule.date}</p>
                <p className="text-sm opacity-75">{`${movieSchedule.timeStart} - ${movieSchedule.timeEnd}`}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Ghế đã chọn:</h3>
              <div className="grid grid-cols-4 gap-2">
                {selectSeatNames.map((seat, index) => (
                  <div key={index} className="bg-primary/10 text-primary text-center py-1 rounded">
                    {seat}
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Số vé:</span>
              <span>{selectSeatNames.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tổng tiền:</span>
              <span className="text-lg font-bold text-primary">{countPrice.toLocaleString()} VNĐ</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-between items-center bg-secondary p-4 rounded-lg">
        <Link href="/schedule" passHref>
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Đổi suất chiếu
          </Button>
        </Link>
        <Button
          onClick={() => {
            if (selectSeatIds.length < 1) {
              return showNotification("Vui lòng chọn ghế trước khi tiếp tục", "error");
            }

            const infoBookingObj = {
              scheduleId: movieSchedule.id,
              movieName: movieSchedule.movie.name,
              date: movieSchedule.date,
              timeStart: movieSchedule.timeStart,
              timeEnd: movieSchedule.timeEnd,
              seatNames: selectSeatNames,
              seatIds: selectSeatIds,
              countSeat: selectSeatIds.length,
              price: countPrice,
              roomName: listSeat.room.roomName,
            };
            setInfoBooking(infoBookingObj);
            localStorage.setItem("infoBooking", JSON.stringify(infoBookingObj));
            router.push("/payment");
          }}
          className="flex items-center gap-2 text-white"
        >
          Tiếp tục
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

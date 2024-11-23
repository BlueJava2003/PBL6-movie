"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { parseCookies } from "nookies";
import { sendRequest } from "@/utils/api";
import { SeatLayout } from "@/components/ad/room-state/SeatLayout";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomStateSchema, RoomStateFormData } from "@/components/ad/room-state/roomStateSchema";
import { AlertCircle, CheckCircle } from "lucide-react";

interface IListRoom {
  id: number;
  roomName: string;
  capacity: number;
}

interface ISchedule {
  id: number;
  movie: {
    name: string;
  };
  date: string;
  timeStart: string;
  timeEnd: string;
}

interface ISeat {
  seatId: string;
  name: string;
  isReserved: boolean;
  type: "NORMAL" | "VIP";
}

interface IListSeat {
  room: {
    roomName: string;
  };
  seats: ISeat[];
}

interface IBackendRes<T> {
  data: T;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

export default function RoomScheduleSelector() {
  const [rooms, setRooms] = useState<IListRoom[]>([]);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [seatInfo, setSeatInfo] = useState<IListSeat | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RoomStateFormData>({
    resolver: zodResolver(roomStateSchema),
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.accessToken;
        const res = await sendRequest<IBackendRes<IListRoom[]>>({
          url: `${process.env.customURL}/room`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setRooms(res.data);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setNotification({ type: "error", message: "Failed to fetch rooms. Please try again." });
      }
    };

    const fetchSchedules = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.accessToken;
        const res = await sendRequest<IBackendRes<ISchedule[]>>({
          url: `${process.env.customURL}/schedule/getAllschedule`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setSchedules(res.data);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setNotification({ type: "error", message: "Failed to fetch schedules. Please try again." });
      }
    };

    fetchRooms();
    fetchSchedules();
  }, []);

  const handleScheduleChange = async (value: string) => {
    setSelectedSchedule(value);
    setSelectedSeats([]);
    try {
      const cookies = parseCookies();
      const token = cookies.accessToken;
      const res = await sendRequest<IBackendRes<IListSeat>>({
        url: `${process.env.customURL}/room-state/${value}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data) {
        setSeatInfo(res.data);
      }
    } catch (error) {
      console.error("Error fetching seat information:", error);
      setNotification({ type: "error", message: "Failed to fetch seat information. Please try again." });
    }
  };

  const handleSeatSelect = (seat: ISeat) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seat.name)) {
        return prev.filter((s) => s !== seat.name);
      } else {
        return [...prev, seat.name];
      }
    });
  };

  const handleAddRoomState = async (data: RoomStateFormData) => {
    try {
      console.log("data: ", data);
      const cookies = parseCookies();
      const token = cookies.accessToken;
      const res = await sendRequest<any>({
        url: `${process.env.customURL}/room-state`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      setIsAddDialogOpen(false);
      setNotification({ type: "success", message: "Room state added successfully." });
      if (res.message === "Room State does exist!") {
        setNotification({
          type: "error",
          message: "Can not create because there is a rooms state for this schedule and room",
        });
      }
      // Optionally, refresh the seat information if the added room state is for the currently selected schedule
      if (data.scheduleId.toString() === selectedSchedule) {
        handleScheduleChange(selectedSchedule);
      }
    } catch (error) {
      console.error("Error adding room state:", error);
      setNotification({ type: "error", message: "Failed to add room state. Please try again." });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">Cinema Room and Schedule Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {notification && (
          <div
            className={`p-4 mb-4 rounded-md flex items-center space-x-2 ${
              notification.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="schedule-select" className="block text-lg font-medium text-gray-200">
            Select Schedule
          </label>
          <Select onValueChange={handleScheduleChange} value={selectedSchedule ?? ""}>
            <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select a schedule" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {schedules.map((schedule) => (
                <SelectItem key={schedule.id} value={schedule.id.toString()} className="hover:bg-gray-700">
                  {schedule.id} - {schedule.movie.name} - {schedule.date} ({schedule.timeStart} - {schedule.timeEnd})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {seatInfo && (
          <div className="mt-6 space-y-4 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-400">Room: {seatInfo.room.roomName}</h2>
            <SeatLayout seats={seatInfo.seats} onSeatSelect={handleSeatSelect} selectedSeats={selectedSeats} />
          </div>
        )}

        {selectedSchedule && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-3 text-purple-400">Selected Information</h2>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <p>Movie:</p>
              <p className="font-medium">{schedules.find((s) => s.id.toString() === selectedSchedule)?.movie.name}</p>
              <p>Date:</p>
              <p className="font-medium">{schedules.find((s) => s.id.toString() === selectedSchedule)?.date}</p>
              <p>Time:</p>
              <p className="font-medium">
                {schedules.find((s) => s.id.toString() === selectedSchedule)?.timeStart} -{" "}
                {schedules.find((s) => s.id.toString() === selectedSchedule)?.timeEnd}
              </p>
              <p>Selected Seats:</p>
              <p className="font-medium">{selectedSeats.join(", ") || "None"}</p>
            </div>
          </div>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Add Room State
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-blue-400">Add New Room State</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAddRoomState)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="scheduleId" className="block text-lg font-medium text-gray-200">
                  Select Schedule
                </label>
                <Controller
                  name="scheduleId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select a schedule" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {schedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id.toString()} className="hover:bg-gray-700">
                            {schedule.id} - {schedule.movie.name} - {schedule.date} ({schedule.timeStart} -{" "}
                            {schedule.timeEnd})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.scheduleId && <p className="text-red-400 text-sm">{errors.scheduleId.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="roomId" className="block text-lg font-medium text-gray-200">
                  Select Room
                </label>
                <Controller
                  name="roomId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()} className="hover:bg-gray-700">
                            {room.roomName} (Capacity: {room.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.roomId && <p className="text-red-400 text-sm">{errors.roomId.message}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Add Room State
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

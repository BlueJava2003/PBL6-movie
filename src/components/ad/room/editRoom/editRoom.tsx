// components/ad/room/editRoom.tsx

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { sendRequest } from "../../../../../utils/api";
import { Button, Input, notification } from "antd";

const EditRoom = () => {
  const router = useRouter();
  const { roomId } = useParams(); // Sử dụng useParams để lấy roomId từ URL
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availableSeat, setAvailableSeat] = useState(0);
  const [unavailableSeat, setUnavailableSeat] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await sendRequest<IBackendRes<any>>({
          url: `${process.env.customURL}/room/getRoom/${roomId}`,
          method: "GET",
        });

        if (res.data) {
          setRoomName(res.data.name);
          setCapacity(res.data.capacity);
          setAvailableSeat(res.data.availableSeat);
          setUnavailableSeat(res.data.unavailableSeat);
        }
      } catch (error) {
        notification.error({ message: "Failed to fetch room details." });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const handleEditRoom = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/room/editRoom/${roomId}`,
        method: "PUT",
        body: {
          name: roomName,
          capacity: capacity,
          availableSeat: availableSeat,
          unavailableSeat: unavailableSeat,
        },
      });

      if (res.status === 200) {
        notification.success({ message: "Room updated successfully!" });
        router.push(`/detailRoom/${roomId}`); // Chuyển hướng về trang chi tiết phòng
      }
    } catch (error) {
      notification.error({ message: "Failed to update room." });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-12">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-screen-lg mt-5 mb-10 px-6">
      <h2 className="text-[22px] font-bold uppercase text-[#0E1D2F] mb-4">
        Edit Room
      </h2>
      <Input
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Capacity"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Available Seats"
        type="number"
        value={availableSeat}
        onChange={(e) => setAvailableSeat(parseInt(e.target.value) || 0)}
        className="mb-4"
      />
      <Input
        placeholder="Unavailable Seats"
        type="number"
        value={unavailableSeat}
        onChange={(e) => setUnavailableSeat(parseInt(e.target.value) || 0)}
        className="mb-4"
      />
      <Button 
        type="primary" 
        onClick={handleEditRoom}
        className="bg-[#0e1d2f] text-white rounded-3xl border-none uppercase font-bold"
      >
        Update Room
      </Button>
    </div>
  );
};

export default EditRoom;

"use client";
import { useState } from "react";
import { sendRequest } from "../../../../../utils/api";
import { Button, Input, notification } from "antd";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleCreateRoom = async () => {
    try {
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/room/createRoom`,
        method: "POST",
        body: {
          name: roomName,
          capacity: capacity,
        },
      });

      if (res.status === 200) {
        notification.success({ message: "Room created successfully!" });
        // Reset form or redirect if needed
      }
    } catch (error) {
      notification.error({ message: "Failed to create room." });
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto max-w-screen-md min-h-[400px] p-5">
      <h2 className="text-lg font-bold mb-4">Create New Room</h2>
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
      <Button 
        type="primary" 
        onClick={handleCreateRoom}
        className="bg-[#0e1d2f] text-white rounded-3xl border-none uppercase font-bold"
      >
        Create Room
      </Button>
    </div>
  );
};

export default CreateRoom;

"use client";

import { useEffect, useState } from "react";
import { sendRequest } from "../../../../../utils/api";
import { Empty, Spin, Button, notification, Modal, Input } from "antd";
import { parseCookies } from "nookies"; // Đảm bảo parseCookies được import
import Link from "next/link";

const RoomList = () => {
  const [listRooms, setListRooms] = useState<IListRoom[]>([]); // Danh sách phòng
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái Modal
  const [currentRoom, setCurrentRoom] = useState<IListRoom | null>(null); // Phòng đang được chỉnh sửa
  const [roomName, setRoomName] = useState(""); // Tên phòng
  const [capacity, setCapacity] = useState<number>(0); // Sức chứa phòng

  // Hàm để lấy danh sách phòng
  const fetchListRoom = async () => {
    try {
      setIsLoading(true);
      const cookies = parseCookies();
      const token = cookies.accessToken; // Lấy token từ cookies

      if (!token) {
        notification.error({ message: "Token not found!" });
        return;
      }

      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/room`, // Endpoint GET /room
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (res.data) {
        setListRooms(res.data); // Lưu danh sách phòng
      }
    } catch (error) {
      notification.error({ message: "Failed to fetch room list." });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm để mở Modal chỉnh sửa
  const handleEdit = (room: IListRoom) => {
    setCurrentRoom(room); // Lưu phòng hiện tại
    setRoomName(room.roomName); // Thiết lập giá trị ban đầu cho input
    setCapacity(Number(room.capacity) || 0); // Đảm bảo capacity là kiểu number, nếu không hợp lệ thì gán 0
    setIsModalVisible(true); // Mở Modal
  };

  // Hàm đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm cập nhật thông tin phòng
  const handleUpdate = async () => {
    if (!roomName || capacity <= 0) {
      notification.error({ message: "Please fill in all fields correctly." });
      return;
    }

    try {
      const cookies = parseCookies();
      const token = cookies.accessToken;
      if (!token) {
        notification.error({ message: "Token not found!" });
        return;
      }

      const roomRes = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/room/${currentRoom?.id}`,
        method: "PUT",
        body: {
          name: roomName,
          capacity: capacity,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (roomRes.message === "Updated successfully!") {
        notification.success({ message: "Room updated successfully!" });
        setIsModalVisible(false);
        fetchListRoom();
      }
    } catch (error) {
      notification.error({ message: "Failed to update room." });
      console.error(error);
    }
  };

  const handleDelete = (roomId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this room?",
      content: "This action cannot be undone.",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const cookies = parseCookies();
          const token = cookies.accessToken;

          if (!token) {
            notification.error({ message: "Token not found!" });
            return;
          }

          const roomRes = await sendRequest<IBackendRes<any>>({
            url: `${process.env.customURL}/room/${roomId}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (roomRes.message === "Delete successfully!") {
            notification.success({ message: "Room deleted successfully!" });
            fetchListRoom(); // Làm mới danh sách phòng sau khi xóa
          }
        } catch (error) {
          notification.error({ message: "Failed to delete room." });
          console.error(error);
        }
      },
      onCancel: () => {
        notification.info({ message: "Room deletion canceled." });
      },
    });
  };

  useEffect(() => {
    fetchListRoom(); // Lấy danh sách phòng khi component mount
  }, []);

  return (
    <div className="w-full mx-auto max-w-screen-lg min-h-[600px]">
      <div className="font-medium mt-4 flex flex-col md:flex-row justify-between px-3 md:px-0">
        <div className="mb-4">
          <Link href="/ad/room/create-room">
            <Button className="px-[23px] py-[10px] bg-green-500 text-white rounded-3xl border-none uppercase font-bold text-[13px]">
              Create Room
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center my-12">
            <Spin size="large" />
          </div>
        ) : listRooms.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-12 mx-5">
            {listRooms.map((room) => (
              <div key={room.id} className={`border p-4 rounded-lg shadow-md border-[#E50914]`}>
                <div className="border p-4 rounded-lg">
                  <h2 className="text-lg font-bold">Name: {room.roomName}</h2> {/* Hiển thị tên phòng */}
                  <p className="text-gray-600">Capacity: {room.capacity}</p>
                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={() => handleEdit(room)}
                      className="px-[23px] py-[10px] bg-yellow-500 text-white rounded-3xl border-none uppercase font-bold text-[13px]"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(room.id)}
                      className="px-[23px] py-[10px] bg-red-500 text-white rounded-3xl border-none uppercase font-bold text-[13px]"
                    >
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

      {/* Modal cho Edit Room */}
      <Modal
        title="Edit Room"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
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
          onChange={(e) => setCapacity(Number(e.target.value) || 0)}
          className="mb-4"
        />
      </Modal>
    </div>
  );
};

export default RoomList;

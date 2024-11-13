'use client';

import { useState } from "react";
import { sendRequest } from "../../../../../utils/api";
import { Form, Input, Button, notification } from "antd";
import { parseCookies } from "nookies"; // Import parseCookies từ nookies

const CreateRoom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy token từ cookie
  const cookies = parseCookies();
  const token = cookies.accessToken; // Lấy token từ cookie thay vì localStorage

  const handleSubmit = async (values: IListRoom) => {
    setIsSubmitting(true);

    try {
      // Log giá trị của values để kiểm tra sau khi submit
      console.log("Form values:", values);  // Log thông tin từ form

      // Gửi yêu cầu POST để tạo phòng mới
      const roomResponse = await sendRequest({
        url: `${process.env.customURL}/room`, // Endpoint POST /room
        method: "POST",
        body: {
          name: values.name,  // Tên phòng
          capacity: values.capacity,  // Sức chứa phòng
        },
        headers: {
          'Authorization': `Bearer ${token}`,  // Thêm token vào headers
          'Content-Type': 'application/json',  // Đảm bảo header này có mặt
        }
      }) as { data: { id: number } };

      // Log kết quả phản hồi từ API
      console.log("API Response:", roomResponse);

      // Kiểm tra nếu API trả về id của phòng mới
      if (!roomResponse?.data?.id) {
        throw new Error("Failed to create room");
      }

      notification.success({ message: "Room created successfully!" });

    } catch (error) {
      console.error("Error creating room:", error);
      notification.error({ message: "Failed to create room." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto max-w-screen-lg min-h-[600px]">
      <div className="md:w-[60%] border lg:w-[70%] w-[90%] mt-5 p-4 m-auto bg-transparent rounded-md shadow-xl lg:max-w-xl">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Room Name"
            rules={[{ required: true, message: "Please enter the room name" }]}
          >
            <Input placeholder="Enter room name" />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Please enter the room capacity" }]}
          >
            <Input type="number" placeholder="Enter room capacity" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Create Room
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateRoom;

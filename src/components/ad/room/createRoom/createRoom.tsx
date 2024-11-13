"use client";

import { useState } from "react";
import { sendRequest } from "../../../../../utils/api";
import { Form, Input, Button, notification } from "antd";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";

const CreateRoom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cookies = parseCookies();
  const token = cookies.accessToken;
  const router = useRouter();
  const handleSubmit = async (values: IListRoom) => {
    setIsSubmitting(true);

    try {
      console.log("Form values:", values);

      const roomResponse = (await sendRequest({
        url: `${process.env.customURL}/room`,
        method: "POST",
        body: {
          roomName: values.roomName,
          capacity: Number(values.capacity),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })) as { data: { id: number } };

      console.log("API Response:", roomResponse);

      if (!roomResponse?.data?.id) {
        throw new Error("Failed to create room");
      }

      notification.success({ message: "Room created successfully!" });
      router.push("/ad/room");
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
            name="roomName"
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

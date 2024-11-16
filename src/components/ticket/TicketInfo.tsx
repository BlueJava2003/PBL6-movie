"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface TicketInfo {
  movieName: string;
  date: string;
  time: string;
  seats: string;
  room: string;
  price: string;
}

export default function TicketInfo() {
  const searchParams = useSearchParams();
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setTicketInfo(decodedData);
      } catch (error) {
        console.error("Error parsing ticket data:", error);
      }
    }
  }, [searchParams]);

  if (!ticketInfo) {
    return <div className="text-center p-8">Đang tải thông tin vé...</div>;
  }

  return (
    <div className="max-w-screen-lg w-full px-6 lg:mx-auto lg:min-h-[500px] h-dvh my-10">
      <div className="p-[10px] bg-[#7e8eaa] uppercase text-white font-medium text-lg text-center md:w-2/3 lg:w-1/2 mx-auto">
        Thông tin vé đã đặt
      </div>
      <div className="border border-solid border-[#7e8eaa] px-8 py-5 md:w-2/3 lg:w-1/2 mx-auto">
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Phim:</span>
          <span>{ticketInfo.movieName}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Ngày:</span>
          <span>{ticketInfo.date}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Thời gian:</span>
          <span>{ticketInfo.time}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Ghế:</span>
          <span>{ticketInfo.seats}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Phòng chiếu:</span>
          <span>{ticketInfo.room}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Tổng tiền:</span>
          <span>{ticketInfo.price} VNĐ</span>
        </p>
      </div>
    </div>
  );
}

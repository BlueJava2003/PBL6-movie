"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQRCode } from "next-qrcode";
import { useUserContext } from "@/lib/user.wrapper";
import { useState, useMemo } from "react";

const Ticket = () => {
  const searchParams = useSearchParams();
  const { Image } = useQRCode();
  const { infoBooking, setInfoBooking } = useUserContext() as IBookingContext;
  const [infoBookingObj, setInfoBookingObj] = useState<IInfoBooking>(
    JSON.parse(localStorage.getItem("infoBooking") as string)
  );

  // Function to generate ticket information URL for QR code
  const generateTicketQRUrl = useMemo(() => {
    const ticketData = {
      movieName: infoBookingObj.movieName,
      date: infoBookingObj.date,
      time: `${infoBookingObj.timeStart}-${infoBookingObj.timeEnd}`,
      seats: infoBookingObj.seatNames?.join(", "),
      room: infoBookingObj.roomName,
      price: infoBookingObj.price,
    };
    const encodedData = encodeURIComponent(JSON.stringify(ticketData));
    return `http://localhost:3000/ticket-info?data=${encodedData}`;
  }, [infoBookingObj]);

  return (
    <div className="max-w-screen-lg w-full px-6 lg:mx-auto lg:min-h-[500px] h-dvh my-10">
      <div className="p-[10px] bg-[#7e8eaa] uppercase text-white font-medium text-lg text-center md:w-2/3 lg:w-1/2 mx-auto">
        Thông tin vé
      </div>
      <div className="border border-solid border-[#7e8eaa] px-8 py-5 md:w-2/3 lg:w-1/2 mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            text={generateTicketQRUrl}
            options={{
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            }}
          />
        </div>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Phim:</span>
          <span>{infoBookingObj.movieName}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Ngày:</span>
          <span>{infoBookingObj.date}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Thời gian:</span>
          <span>{`${infoBookingObj.timeStart}-${infoBookingObj.timeEnd}`}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Ghế:</span>
          <span>{infoBookingObj.seatNames?.join(", ")}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Phòng chiếu:</span>
          <span>{infoBookingObj.roomName}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">Tổng tiền:</span>
          <span>{infoBookingObj.price} VNĐ</span>
        </p>
      </div>
      <div className="mt-8 text-center w-full">
        <Link href="/schedule">
          <button className="px-[15px] py-[6px] bg-[#7e8eaa] text-white rounded-md border-none uppercase font-bold text-[14px]">
            Quay về
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Ticket;

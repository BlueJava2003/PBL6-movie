'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQRCode } from 'next-qrcode';
import { useUserContext } from '@/lib/user.wrapper';
import { useState } from 'react';

const Ticket = () => {
  const searchParams = useSearchParams();
  const { Image } = useQRCode();
  const { infoBooking, setInfoBooking } = useUserContext() as IBookingContext;
  const [infoBookingObj, setInfoBookingObj] = useState<IInfoBooking>(
    JSON.parse(localStorage.getItem('infoBooking') as string)
  );

  return (
    <div className="max-w-screen-lg w-full px-6 lg:mx-auto lg:min-h-[500px] h-dvh my-10">
      <div className="p-[10px] bg-[#7e8eaa] uppercase text-white font-medium text-lg text-center md:w-2/3 lg:w-1/2 mx-auto">
        Thông tin vé
      </div>
      {/* <div className="text-[21px] text-[#333] font-semibold pt-[30px] pb-[10px]">
        Nội dung thanh toán
      </div> */}
      <div className="border border-solid border-[#7e8eaa] px-8 py-5 md:w-2/3 lg:w-1/2 mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            text="https://github.com/Bunlong/next-qrcode"
            options={{
              errorCorrectionLevel: 'L',
              margin: 2,
              scale: 5,
              width: 150,
              color: {
                dark: '#000000',
                light: '#ffffff',
              },
            }}
          />
        </div>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">
            Phim:
          </span>
          <span>{infoBookingObj.movieName}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">
            Ngày:
          </span>
          <span>{infoBookingObj.date}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">
            Thời gian:
          </span>
          <span>{`${infoBookingObj.timeStart}-${infoBookingObj.timeEnd}`}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">
            Ghế:
          </span>
          <span>{infoBookingObj.seatNames?.join()}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">
            Phòng chiếu:
          </span>
          <span>{infoBookingObj.roomName}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-28 inline-block">
            Tổng tiền:
          </span>
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

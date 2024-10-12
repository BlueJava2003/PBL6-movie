'use client';
import { useUserContext } from '@/lib/user.wrapper';
import Link from 'next/link';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { sendRequest } from '../../../utils/api';
import { notification } from 'antd';
import { useCookies } from 'next-client-cookies';
import { useEffect, useState } from 'react';

const Payment = () => {
  const cookies = useCookies();
  const accessToken = cookies.get('accessToken');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { infoBooking, setInfoBooking } = useUserContext() as IBookingContext;
  const [infoBookingObj, setInfoBookingObj] = useState<IInfoBooking>(
    JSON.parse(localStorage.getItem('infoBooking') as string)
  );

  useEffect(() => {
    window.addEventListener('beforeunload', function (event) {
      // Display a confirmation dialog to the user
      event.preventDefault(); // Some browsers may still need this for backward compatibility
      event.returnValue = ''; // Standard way to trigger the dialog
    });
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    router.push('/ticket');
    localStorage.removeItem('schedule');
    const res = await sendRequest<IBackendRes<IUser>>({
      url: `${process.env.customURL}/booking`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: { scheduleId: infoBookingObj.scheduleId, seatIds: infoBookingObj.seatIds },
    });

    if (res.data) {
      notification.success({ message: 'Bạn đã đặt vé thành công!' });
      setInfoBooking({
        seatNames: [],
        seatIds: [],
        price: 0,
      });

      localStorage.removeItem('infoBooking');

      //update seat status
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: 'GET',
        queryParams: {
          tag: 'handle-list-seat',
          secret: 'justArandomString',
        },
      });
      router.refresh();
      setIsLoading(false);

      return router.push('/schedule');
    } else {
      notification.error({ message: 'Có lỗi khi đặt ghế, vui lòng thử lại!' });
      setInfoBooking({
        seatNames: [],
        seatIds: [],
        price: 0,
      });

      localStorage.removeItem('infoBooking');
      return router.push(`/booking/${infoBookingObj.scheduleId}`);
    }
  };

  if (typeof window === 'undefined') {
    return;
  }

  return (
    <div className="max-w-screen-lg w-full px-6 lg:mx-auto lg:min-h-[500px] h-dvh my-10">
      <div className="p-[10px] bg-[#7e8eaa] uppercase text-white font-medium text-lg text-center max-w-full">
        Phương thức thanh toán
      </div>
      <div className="text-[21px] text-[#333] font-semibold pt-[30px] pb-[10px]">
        Nội dung thanh toán
      </div>
      <div className="border border-solid border-[#7e8eaa] px-8 py-5 max-w-full">
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-24 inline-block">
            Phim:
          </span>
          <span>{infoBookingObj?.movieName}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-24 inline-block">
            Ngày:
          </span>
          <span>{infoBookingObj?.date}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-24 inline-block">
            Thời gian:
          </span>
          <span>{`${infoBookingObj?.timeStart}-${infoBookingObj?.timeEnd}`}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-24 inline-block">
            Ghế:
          </span>
          <span>{infoBookingObj?.seatNames?.join()}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-24 inline-block">
            Số ghế:
          </span>
          <span>{infoBookingObj?.countSeat}</span>
        </p>
        <p className="pb-[10px]">
          <span className="text-[18px] text-[#0e1d2f] font-medium w-24 inline-block">
            Tổng tiền:
          </span>
          <span>
            {infoBookingObj?.price.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND',
            })}
          </span>
        </p>
      </div>
      <div className="mt-8 text-center w-full">
        <button
          className="px-[15px] py-[6px] bg-[#7e8eaa] text-white rounded-md border-none uppercase font-bold text-[14px]"
          onClick={handlePayment}
          disabled={isLoading}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Payment;

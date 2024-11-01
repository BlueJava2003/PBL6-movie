"use client";
import React from "react";
interface IProps {
    booking: IBooking;
}

const DetailBooking: React.FC<IProps> = ({ booking }) => {
    return (
        <div className="border border-gray-200 rounded-md p-4 my-2 bg-white shadow-md relative" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '1rem', margin: '0.5rem 0' }}>
            <div className="px-0 pt-3">
                <h1 className="text-[22px] truncate font-bold uppercase text-[#0E1D2F] float-left">
                    Tên phim:{booking?.schedule?.movie?.name}
                </h1>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f] float-right">
                  Trạng thái: {booking?.state}
                </span>
            </div>
            <div className="text-[15px] leading-7 pt-6 float-left">
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
                    ID Người Đặt: {booking?.accountID}
                </span>
            </div>
            <div className="text-[15px] leading-7 pt-6 float-left">
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
                    Phòng: {booking.seatBooked?.room?.roomName}
                </span>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">
                    Ghế: {booking.seatBooked?.seats?.name}
                </span>
            </div>
            <div>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f] text-right float-right">
                    Giá Tiền: {booking?.totalPrice} VND
                </span>
            </div>
        </div>
    );
};

export default DetailBooking;

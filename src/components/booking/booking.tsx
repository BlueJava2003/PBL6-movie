"use client";
import { useUserContext } from "@/lib/user.wrapper";
import { notification } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Router from "next/router";
import { useEffect, useState } from "react";

// interface ISeat {
//   id: number;
//   name: string;
//   status: boolean;
//   type: string;
//   price: number;
// }

interface Iprops {
  listSeat: IListSeat;
  movieSchedule: ISchedule;
}

const BookingSeat = (props: Iprops) => {
  const { listSeat, movieSchedule } = props;
  const router = useRouter();
  const { infoBooking, setInfoBooking } = useUserContext() as IBookingContext;
  const [selectSeatNames, setSelectSeatNames] = useState<string[]>([]);
  const [selectSeatIds, setSelectSeatIds] = useState<number[]>([]);
  let [countPrice, setCountPrice] = useState<number>(0);

  // fixbug seat_005: The seat that was selected by the user remains selected
  useEffect(() => {
    router.refresh();
    setSelectSeatNames(infoBooking.seatNames!);
    setSelectSeatIds(infoBooking.seatIds!);
    setCountPrice(infoBooking.price!);
  }, []);

  const handleSeat = (seat: ISeat) => {
    if (selectSeatNames.length === 8 && !selectSeatNames.includes(seat.name)) {
      return notification.error({ message: "Bạn chỉ được đặt tối đa 8 ghế!" });
    }
    setSelectSeatNames((prev: string[]) => [...prev, seat.name]);
    setSelectSeatIds((prev: number[]) => [...prev, seat.seatId]);
    setCountPrice((prev) => prev + seat.price);
    if (selectSeatNames.includes(seat.name) === true) {
      const newSeatNames = selectSeatNames.filter((item) => item !== seat.name);
      const newSeatIds = selectSeatIds.filter((item) => item !== seat.seatId);
      setSelectSeatNames(newSeatNames);
      setSelectSeatIds(newSeatIds);
      setCountPrice(countPrice - seat.price);
    }
  };

  return (
    <div className="max-w-screen-lg w-full mx-auto my-5 lg:my-[50px] px-5 lg:p-0">
      <h2 className="text-[22px] font-bold text-primary ">Chọn ghế</h2>
      <div className="grid lg:grid-cols-booking mb-12">
        <div className="lg:ml-[95px] p-5 md:border-r md:border-dotted md:border-[#adadad] ">
          <div
            style={{
              backgroundImage:
                "repeating-linear-gradient(50deg, #E3E3E3 0px, #E3E3E3 3px, transparent 3px, transparent 4px, #E3E3E3 0px)",
            }}
            className="mx-8 mt-[5px] mb-12 text-primary p-[10px] text-center rounded-md"
          >
            MÀN HÌNH
          </div>
          <div>
            <ul className="grid grid-cols-10 gap-2 w-[90%] md:w-[60%] mx-auto">
              {listSeat?.seats?.map((seat) =>
                seat.isReserved == false ? (
                  <li
                    key={seat.seatId}
                    className={`border-2 border-[#c9c2b5] border-solid hover:bg-[#72BA14] hover:border-[#72BA14] text-[11px] font-light text-center text-[#777] cursor-pointer h-7 w-7 flex items-center justify-center ${
                      seat.type === "VIP" && " border-[#ffc000] "
                    } ${
                      selectSeatNames.includes(seat.name) &&
                      "bg-[#72BA14] border-none"
                    }`}
                    onClick={() => {
                      handleSeat(seat);
                    }}
                  >
                    {seat.name}
                  </li>
                ) : (
                  <li
                    key={seat.seatId}
                    className="text-[11px] font-light text-center text-[#777] h-7 w-7 flex items-center justify-center bg-booked"
                  >
                    {seat.name}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Thông tin movie */}
        <div className="px-[15px] text-[18px] text-[#666] font-light">
          <div className="w-[200px] h-[281px] mb-3 mx-auto lg:mx-0">
            <img
              className="w-full h-full bg-cover object-cover"
              src={movieSchedule?.movie?.imagePath}
              alt=""
            />
          </div>
          <p className="mb-3">
            <span className="pr-1">Phim:</span>
            <span className="uppercase">{movieSchedule.movie.name}</span>
          </p>
          <p className="mb-3">
            <span className="pr-1">Ngày:</span>
            <span>{movieSchedule.date}</span>
          </p>
          <p className="mb-3">
            <span className="pr-1">Thời gian:</span>
            <span>{`${movieSchedule.timeStart}-${movieSchedule.timeEnd}`}</span>
          </p>
          <div className="mb-3">
            <span className="pr-1">Ghế:</span>
            <div className="grid grid-cols-4 gap-3 pl-4 pt-3">
              {selectSeatNames.map((seat, index) => (
                <div
                  key={index}
                  className=" h-[26px] bg-[#f7f7f7] border border-solid border-[#d3d3d3] text-center"
                >
                  {seat}
                </div>
              ))}
            </div>
          </div>
          <p className="mb-3">
            <span className="pr-1">Số vé:</span>
            <span>{selectSeatNames.length}</span>
          </p>
          <p className="mb-5">
            <span className="mr-1">Tổng tiền:</span>
            <span>{countPrice} VNĐ</span>
          </p>
          <div>
            <ul>
              <li className="flex items-center gap-5 mb-6">
                <div className="h-7 w-7 bg-booked"></div>
                <span>Ghế đã đặt</span>
              </li>
              <li className="flex items-center gap-5 mb-6">
                <div className="h-7 w-7 bg-[#72BA14]"></div>
                <span>Ghế đang chọn</span>
              </li>
              <li className="flex items-center gap-5 mb-6">
                <div className="h-7 w-7 border-2 border-[#c9c2b5] border-solid"></div>
                <span>Ghế thường</span>
              </li>
              <li className="flex items-center gap-5 mb-6">
                <div className="h-7 w-7 border-2 border-[#ffc000] border-solid"></div>
                <span>Ghế VIP</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between px-[30px] py-[15px] bg-[#cdc197]">
        <Link href="/schedule">
          <div className="flex gap-3 cursor-pointer">
            <img src="/assets/btn_total_prev.png" alt="" />
            <span>Đổi suất chiếu</span>
          </div>
        </Link>
        <div
          className="flex gap-3 cursor-pointer"
          onClick={() => {
            if (selectSeatIds.length < 1) {
              return notification.error({
                message: "Vui lòng chọn ghế trước khi tiếp tục",
              });
            }

            const infoBookingObj = {
              scheduleId: movieSchedule.id,
              movieName: movieSchedule.movie.name,
              date: movieSchedule.date,
              timeStart: movieSchedule.timeStart,
              timeEnd: movieSchedule.timeEnd,
              seatNames: selectSeatNames,
              seatIds: selectSeatIds,
              countSeat: selectSeatIds.length,
              price: countPrice,
              roomName: listSeat.room.roomName,
            };
            setInfoBooking(infoBookingObj);
            localStorage.setItem("infoBooking", JSON.stringify(infoBookingObj));
            router.push("/payment");
          }}
        >
          <span>Tiếp tục</span>
          <img src="/assets/btn_total_next.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default BookingSeat;

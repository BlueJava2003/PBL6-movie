// components/BookingList.tsx

"use client";
import React, { useEffect, useState } from "react";
import { Spin, Empty } from "antd";
import DetailBooking from "./detailBooking";
import ReactPaginate from "react-paginate"; // Import ReactPaginate

interface IProps {
    bookings: IBooking[];
}

const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async (page: number) => {
            setIsLoading(true); // Bắt đầu tải dữ liệu
            try {
                const response = await fetch(`${process.env.customURL}/booking/getAllBookings?page=${page}`);
                const data = await response.json();
                setBookings(data.bookings); // Giả sử dữ liệu trả về có thuộc tính bookings
                setTotalPages(data.totalPages); // Giả sử tổng số trang có trong phản hồi
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setIsLoading(false);
            }
        };

        fetchBookings(currentPage);
    }, [currentPage]);

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected); 
    };

    return (
        <div className="w-full mx-auto max-w-screen-lg min-h-[600px]">
            <h2 
                className="md:mx-3 mx-2 text-[13px] lg:text-[25px] py-[16px] uppercase"
            >
                Danh Sách Đặt Vé
            </h2>
            {isLoading ? (
                <div className="flex justify-center items-center my-12">
                    <Spin size="large" />
                </div>
            ) : bookings.length ? (
                <div className="my-12 mx-5">
                    {bookings.map(booking => (
                        <DetailBooking key={booking.id} booking={booking} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-dvh">
                    <Empty />
                </div>
            )}

            {bookings.length > 0 && !isLoading && (
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={10}
                    pageCount={totalPages}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    containerClassName="flex justify-center my-4"
                    pageClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
                    previousClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
                    nextClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
                    breakClassName="mx-2 px-3 py-2 bg-gray-200 rounded-md cursor-pointer"
                    activeClassName="bg-blue-500 text-white"
                    disabledClassName="opacity-50 cursor-not-allowed"
                />
            )}
        </div>
    );
};

export default BookingList;

"use client";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Header from "../header/header";
import MovieNow from "../movie/home-movie/movieNowList";
import dayjs from "dayjs";
// import FooterPublic from "../components/footerPublic";

interface Iprops {
  listMovieToday: IListMovie[];
  listMovieSoon: IListMovie[];
}

function Home(props: Iprops) {
  const { listMovieToday, listMovieSoon } = props;

  const [loadingPage, setLoadingPage] = useState(false);
  const [stateMovie, setStateMovie] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      url: "/assets/slide_2.jpg",
      content: {
        h2: "ĐÓN CHỜ SỰ QUAY TRỞ LẠI CỦA MỘT KỶ NGUYÊN MỚI",
        h3: "TRANSFORMERS",
        h4: "CHIẾN BINH CUỐI CÙNG",
        rating: "8.5/10",
        discription:
          "Chiến Binh Cuối Cùng là phần tiếp theo về Robot biến hình ăn khách. 'Chiến Binh Cuối Cùng' phá nát những huyền thoại cốt lõi của loạt phim Transformers, và tái định nghĩa thế nào là anh hùng. Con người và các Transformer đang có chiến tranh, Optimus Prime đã biến mất. Chìa khóa để cứu tương lai của chúng ta đang được chôn vùi trong những bí mật của quá khứ, trong lịch sử ẩn còn được giữ kín của các Transformer trên Trái Đất.",
        btn: "PHIM SẮP CHIẾU",
      },
    },
    {
      url: "/assets/slide_1.webp",
      content: {
        h2: "TOP PHIM ĐIỆN ẢNH DOANH THU CAO NHẤT PHÒNG VÉ",
        h3: "TOPGUN - PHI CÔNG SIÊU ĐẲNG MAVERICK",
        rating: "8.7/10",
        discription:
          "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
        btn: "ĐẶT VÉ NGAY",
      },
    },
    {
      url: "/assets/slide_3.png",
      content: {
        h2: "MỘT TÁC PHẨM KINH DỊ TỪ NHÀ SẢN XUẤT NEW LINE CINEMA",
        h3: "IT - CHÚ HỀ MA QUÁI",
        rating: "7.7/10",
        discription:
          "Là một trong những bộ phim kinh dị hứa hẹn nhất năm, bộ phim chuyển thể từ tiểu thuyết rùng rợn nhất của Stephen King mang đến những cảnh phim kinh hoàng hơn cùng cái nhìn trực diện về gã hề ác ma Pennywise. Sau 17 năm kể từ lần đầu xuất hiện trong bản chuyển thể phim truyền hình, khán giả mới có dịp khóc thét một lần nữa trước sự trở lại ma mị, tàn bạo và kinh hoàng của Pennywise trên màn ảnh rộng.",
        btn: "ĐẶT VÉ NGAY",
      },
    },
  ];
  // Back Slide
  const prevSlide = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);
  // Next Slide
  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  return (
    <div>
      <div>
        <div className="h-screen w-full group">
          <div
            style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
            className="w-full h-full bg-center bg-cover duration-500"
          >
            <div className="bg-gradient-to-r from-black/100 h-screen w-full lg:pt-28 pt-16">
              <div className="relative">
                <div
                  data-aos="fade-right"
                  data-aos-duration="1000"
                  className="absolute z-10 text-white  top-[25%] lg:top-[50%] left-8 md:left-12 lg:left-20 w-[80%] lg:w-[50%]"
                >
                  <h2 className="lg:text-[15px] text-sm">
                    {slides[currentIndex].content.h2}
                  </h2>
                  <h3 className="lg:text-[40px] md:text-[28px] text-[20px] font-bold my-2">
                    {slides[currentIndex].content.h3}
                  </h3>
                  <h4 className="lg:text-[40px] md:text-[28px] text-[20px] font-bold my-2">
                    {slides[currentIndex].content.h4}
                  </h4>
                  <p className="lg:block md:text-[13px] lg:text-[16px] font-thin text-[12px] text-justify">
                    {slides[currentIndex].content.discription}
                  </p>
                  <Link href="/movie">
                    <button className="py-2 text-[12px] lg:text-[14px] px-2 lg:px-3 bg-[#c40404] mt-3 md:mt-5">
                      Xem thêm &ensp;
                      <i className="fas fa-chevron-right text-[12px]"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Left Arrow */}
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] lg:left-5 left-0 text-xl lg:text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <button onClick={prevSlide}>
              <LeftOutlined />
            </button>
          </div>
          {/* Right Arrow */}
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] lg:right-5 right-0 lg:text-xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <button onClick={nextSlide}>
              <RightOutlined />
            </button>
          </div>
        </div>
        {/* content */}
        <div className="mx-auto px-6 lg:px-[50px] bg-black pb-10">
          <div className="flex justify-between">
            <div className="text-white">
              <button
                className="md:mx-3 mx-2 text-[13px] lg:text-[15px] py-[20px] uppercase border-[#E50914]"
                onClick={() => setStateMovie(true)}
                style={{
                  borderBottom:
                    stateMovie === true ? "3px solid #E50914" : "none",
                }}
              >
                phim đang chiếu
              </button>
              <button
                className="md:mx-3 ml-2 py-[20px] text-[13px] lg:text-[15px] uppercase"
                onClick={() => setStateMovie(false)}
                style={{
                  borderBottom:
                    stateMovie === false ? "3px solid #E50914" : "none",
                }}
              >
                phim sắp chiếu
              </button>
            </div>
          </div>
          {/* RENDER PHIM ĐANG CHIẾU OR PHIM SẮP CHIẾU */}
          <MovieNow listMovies={stateMovie ? listMovieToday : listMovieSoon} />
          {/* {stateMovie === true ? <MovieNow /> : <MovieSoon />} */}
        </div>
      </div>
    </div>
  );
}

export default Home;

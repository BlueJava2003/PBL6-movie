"use client";

import React, { useState } from "react";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import MovieRating from "@/components/rating/MovieRating";

export interface IMovieList {
  _id: string;
  image: string;
  name: string;
  namevn: string;
}

interface Iprops {
  movie: IListMovie;
}

const DetailMovie = ({ movie }: Iprops) => {
  const movieId = useParams();
  const [vlYoutube, setVlYoutube] = useState(false);
  const [content, setContent] = useState(true);
  const [showRating, setShowRating] = useState(false);

  return (
    <>
      <div className="w-full mx-auto max-w-screen-lg mt-5 mb-10 px-6">
        <div className="grid lg:grid-cols-custom lg:gap-x-8 grid-cols-1 md:py-10 py-10">
          <div className="w-[200px] h-[281px]">
            <img className="w-full h-full bg-cover object-cover" src={movie?.imagePath} alt="" />
          </div>
          <div className="px-0 pt-3">
            <h1 className="text-[22px] truncate font-bold uppercase text-[#0E1D2F]">{movie?.name}</h1>
            <div className="text-[15px] leading-7 pt-6">
              <p>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">Đạo diễn :</span>
                <span>{movie?.director}</span>
              </p>
              <p>
                <span className="w-[100px] h-full inline-block font-bold text-[#0e1d2f]">Diễn viên:</span>
                <span>{movie?.actor}</span>
              </p>
              <p>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">Thể loại:</span>
                <span>{movie?.category?.name}</span>
              </p>
              <p>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">Khởi chiếu:</span>
                <span>{dayjs(movie?.releaseDate).format("DD/MM/YYYY")}</span>
              </p>
              <p>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">Thời lượng:</span>
                <span>{movie?.duration} phút</span>
              </p>
              <p>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">Ngôn ngữ:</span>
                <span>{movie.language}</span>
              </p>
              <p>
                <span className="w-[100px] inline-block font-bold text-[#0e1d2f]">Rated:</span>
                <span>C13 - PHIM CẤM PHỔ BIẾN ĐẾN KHÁN GIẢ DƯỚI 13 TUỔI</span>
              </p>
            </div>
          </div>
          <div className="mt-3">
            <Link href="/schedule">
              <button className="px-[23px] py-[10px] bg-[#0e1d2f] text-white rounded-3xl border-none uppercase font-bold text-[13px]">
                đặt vé
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-6">
          <button
            className={`px-[25px] py-[10px] rounded-3xl font-semibold text-[18px] ${
              content
                ? "bg-[#ff5400] text-white border-none"
                : "bg-transparent text-[#0e1d2f] border-solid border border-[#0e1d2f]"
            }`}
            onClick={() => {
              setContent(true);
              setVlYoutube(false);
              setShowRating(false);
            }}
          >
            Chi tiết
          </button>
          <button
            className={`px-[25px] py-[10px] rounded-3xl font-semibold text-[18px] ${
              vlYoutube
                ? "bg-[#ff5400] text-white border-none"
                : "bg-transparent text-[#0e1d2f] border-solid border border-[#0e1d2f]"
            }`}
            onClick={() => {
              setContent(false);
              setVlYoutube(true);
              setShowRating(false);
            }}
          >
            Trailer
          </button>
          <button
            className={`px-[25px] py-[10px] rounded-3xl font-semibold text-[18px] ${
              showRating
                ? "bg-[#ff5400] text-white border-none"
                : "bg-transparent text-[#0e1d2f] border-solid border border-[#0e1d2f]"
            }`}
            onClick={() => {
              setContent(false);
              setVlYoutube(false);
              setShowRating(true);
            }}
          >
            Đánh giá
          </button>
        </div>
        <p
          className="mt-10 font-normal text-sm md:text-[15px] text-justify"
          style={{ display: content ? "block" : "none" }}
        >
          {movie?.desc}
        </p>
        <div
          style={{
            display: vlYoutube ? "flex" : "none",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <iframe
            title="youtube"
            width="55%"
            height="315px"
            src={movie?.urlTrailer.includes("embed") ? movie.urlTrailer : `https://www.youtube.com/embed/Y_qYJo93k`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        {showRating && <MovieRating movieId={movie.id} />}
        <div className="mt-10 flex justify-center">
          <Link href="/schedule">
            <button className="px-[23px] py-[10px] bg-[#0e1d2f] text-white rounded-3xl border-none uppercase font-bold text-[13px]">
              đặt vé
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DetailMovie;

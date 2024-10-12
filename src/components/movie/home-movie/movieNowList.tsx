/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { memo } from 'react';
import Link from 'next/link';
import Movie from './movie';
interface Iprops {
  listMovies: IListMovie[];
}

function MovieNow(props: Iprops) {
  const { listMovies } = props;

  return (
    <>
      <div
        data-aos="fade-up"
        data-aos-duration="1500"
        className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-10 md:gap-8 gap-5 justify-items-center mt-10"
      >
        {listMovies.slice(-4, -1).map((movie, index) => (
          <div key={movie.id}>{index < 9 && <Movie movie={movie ?? {}} />}</div>
        ))}
      </div>
      <div data-aos="fade-up" data-aos-duration="1500">
        <div className="flex justify-center mt-5">
          <button className="text-[14px] py-[13px] px-[25px] text-white bg-[#ce0000]">
            <Link href="/movie">
              <div>Xem thêm</div>
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}

export default memo(MovieNow);

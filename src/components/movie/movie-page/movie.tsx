import Link from 'next/link';
import { memo } from 'react';
import { IMoviePageList } from './movieList';
import dayjs from 'dayjs';

interface Iprops {
  movie: IListMovie;
}

function Movie({ movie }: Iprops) {
  return (
    <>
      <div className="w-full">
        <div className="max-w-[208px] h-[265px]">
          <img
            className="w-full h-full bg-cover object-cover"
            src={movie.imagePath}
            alt=""
          />
        </div>
        <div className="mt-1 text-center">
          <Link
            href={`/movie/${movie.id}`}
            className="text-primary uppercase font-bold text-[15px] pb-1 line-clamp-1 max-w-[208px]"
          >
            {movie.name}
          </Link>
          <p className="text-primary font-normal uppercase text-[13px]">
            <span>thể loại: </span>
            <span>{movie.category.name}</span>
          </p>
          <p className="text-primary font-normal uppercase text-[13px]">
            {movie.duration} phút
          </p>
          <p className="text-primary font-normal uppercase text-[13px]">
            <span>khởi chiếu: </span>
            <span>{dayjs(movie.releaseDate).format('DD/MM/YYYY')}</span>
          </p>
        </div>
        <div className="mt-5 flex justify-center">
          <Link href="/schedule">
            <button className="px-[14px] py-[8px] bg-[#0e1d2f] text-white rounded-3xl border-none uppercase font-semibold text-[13px]">
              đặt vé
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default memo(Movie);

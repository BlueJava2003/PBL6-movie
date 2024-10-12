import Link from 'next/link';
import { memo } from 'react';

interface Iprops {
  movie: IListMovie;
}

function Movie({ movie }: Iprops) {
  return (
    <>
      <div className="h-96">
        <div className="relative h-[75%]">
          {/* <img
            className="w-full h-full bg-cover object-cover "
            src={movie.imagePath}
            alt=""
          ></img> */}
          <div className="w-full h-full">
            <img
              className="w-full h-full bg-cover object-cover"
              src={movie.imagePath}
              alt=""
            />
          </div>
          <Link href={`/movie/${movie.id}`}>
            <div className="absolute opacity-0 hover:opacity-100 transition duration-500 ease-in-out top-0 right-0 left-0 bottom-0 w-full h-full overflow-hidden bg-fixed bg-black/50">
              <button
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white
                  border border-white text-sm py-[13px] px-[25px] hover:bg-[#c40404] hover:border-none"
              >
                MUA VÉ
              </button>
            </div>
          </Link>
        </div>

        <div className="text-sm mt-2 lg:text-[15px]">
          <p className="text-white uppercase">{movie.name}</p>
          <p className="text-gray-500 font-thin uppercase line-clamp-3">{movie.desc}</p>
        </div>
      </div>
    </>
  );
}

export default memo(Movie);

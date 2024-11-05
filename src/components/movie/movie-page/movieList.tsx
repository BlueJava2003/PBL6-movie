"use client";
import { useCallback, useEffect, useState } from "react";
import Movie from "./movie";
import dayjs from "dayjs";
import { sendRequest } from "../../../../utils/api";
import useDebounce from "@/hook/useDebounce";
import ReactPaginate from "react-paginate";
import { Empty, Spin } from "antd";

export interface IMoviePageList {
  _id: string;
  image: string;
  name: string;
  namevn: string;
  type: string;
  duration: number;
  released: string;
}

interface Iprops {
  listMovies: IListMovie[];
}

const MovieList = () => {
  const [listMovies, setListMovies] = useState<IListMovie[]>([]);
  console.log("🚀 ~ MovieList ~ listMovies:", listMovies);
  const [stateMovie, setStateMovie] = useState("today | upcoming");
  const [searchValue, setSearchValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  console.log("🚀 ~ MovieList ~ currentPage:", currentPage);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedValue = useDebounce(searchValue, 700);

  const fetchListMovie = async () => {
    try {
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/movie/getAllMovie`,
        method: "GET",
        queryParams: {
          page: currentPage,
          limit: 10,
          orderBy: "desc",
          option: stateMovie,
        },
      });
      console.log("🚀 ~ MoviePage ~ res:", res);

      if (res.data) {
        const meta = res.data.length - 1;
        setTotalPages(res.data[meta].totalPages);
        setListMovies(res.data.slice(0, res.data.length - 1));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchListMovie();
  }, [stateMovie, currentPage]);

  useEffect(() => {
    SearchMovie(debouncedValue);
  }, [debouncedValue]);

  const SearchMovie = async (data: string) => {
    if (!data.trim()) {
      return fetchListMovie();
    }
    setIsLoading(true);
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.customURL}/movie/searchMovie`,
      method: "POST",
      body: { name: data.trim() },
    });
    setListMovies(res.data);
    setIsLoading(false);
  };

  const handlePageClick = (event: any) => {
    setCurrentPage(+event.selected + 1);
  };

  return (
    <div className="w-full mx-auto max-w-screen-lg min-h-[600px]">
      <div className="font-medium mt-4 flex flex-col md:flex-row justify-between px-3 md:px-0">
        <div>
          <button
            className="md:mx-3 mx-2 text-[13px] lg:text-[15px] py-[16px] uppercase border-[#E50914]"
            onClick={() => {
              setStateMovie("today");
            }}
            style={{
              borderBottom: stateMovie === "today" ? "3px solid #E50914" : "none",
            }}
          >
            phim đang chiếu
          </button>
          <button
            className="md:mx-3 ml-2 py-[16px] text-[13px] lg:text-[15px] uppercase"
            onClick={() => {
              setStateMovie("upcoming");
            }}
            style={{
              borderBottom: stateMovie === "upcoming" ? "3px solid #E50914" : "none",
            }}
          >
            phim sắp chiếu
          </button>
        </div>
        <div className="relative flex items-center w-1/3 mt-3 md:mt-0">
          <input
            type="search"
            className="relative m-0 block flex-auto rounded-lg border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary h-fit "
            placeholder="Search"
            // onChange={(e) => SearchMovie(e.target.value)}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span
            className="flex items-center whitespace-nowrap px-3 py-[0.25rem] text-surface dark:border-neutral-400 dark:text-white [&>svg]:h-5 [&>svg]:w-5"
            id="button-addon2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center my-12">
          <Spin size="large" />
        </div>
      ) : listMovies.length ? (
        <div
          // data-aos="fade-up"
          // data-aos-duration="1500"
          className="animate-show-up grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-x-16 lg:gap-y-10 md:gap-3 gap-3 justify-items-center my-12 mx-5"
        >
          {listMovies.map((movie, index) => (
            <div key={movie.id}>{<Movie movie={movie ?? {}} />}</div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-dvh">
          <Empty />
        </div>
      )}

      {listMovies.length > 0 && !isLoading && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
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

export default MovieList;

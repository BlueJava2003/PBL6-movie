"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import Movie from "./movie";
import dayjs from "dayjs";
import { sendRequest } from "../../../../utils/api";
import useDebounce from "@/hook/useDebounce";
import ReactPaginate from "react-paginate";
import { Empty, Spin } from "antd";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface IMoviePageList {
  _id: string;
  image: string;
  name: string;
  namevn: string;
  type: string;
  duration: number;
  released: string;
}

interface IListCategory {
  id: number;
  name: string;
}

interface IListMovie {
  id: number;
  name: string;
  duration: number;
  releaseDate: string;
  desc: string;
  director: string;
  actor: string;
  language: string;
  urlTrailer: string;
  imagePath: string;
  category: {
    id: number;
    name: string;
    desc: string;
  };
  schedule: ISchedule[];
}

const MovieList = () => {
  const [listMovies, setListMovies] = useState<IListMovie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<IListMovie[]>([]);
  const [stateMovie, setStateMovie] = useState("today | upcoming");
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState<IListCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedValue = useDebounce(searchValue, 700);

  const fetchCategories = async () => {
    try {
      const res = await sendRequest<IBackendRes<IListCategory[]>>({
        url: `${process.env.customURL}/category-movie/getAllCategoryMovie`,
        method: "GET",
      });

      if (res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchListMovie = async () => {
    try {
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/movie/getAllMovie`,
        method: "GET",
        queryParams: {
          page: currentPage,
          limit: 12,
          orderBy: "desc",
          option: stateMovie,
        },
      });
      if (res.data) {
        const meta = res.data.length - 1;
        setTotalPages(res.data[meta].totalPages);
        const movies = res.data.slice(0, res.data.length - 1);
        setListMovies(movies);
        setFilteredMovies(movies);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchListMovie();
  }, [stateMovie, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    SearchMovie(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredMovies(listMovies);
    } else {
      const filtered = listMovies.filter((movie) => movie.category.id === selectedCategory);
      setFilteredMovies(filtered);
    }
  }, [selectedCategory, listMovies]);

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
    setFilteredMovies(res.data);
    setIsLoading(false);
  };

  const handlePageClick = (event: any) => {
    setCurrentPage(+event.selected + 1);
  };

  const ALL_CATEGORIES = "all";

  const handleCategoryChange = (value: string) => {
    const categoryId = value === ALL_CATEGORIES ? null : Number(value);
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="w-full mx-auto max-w-screen-lg min-h-[600px]">
      <div className="font-medium mt-4 flex flex-col md:flex-row justify-between px-3 md:px-0">
        <div>
          <button
            className="md:mx-3 mx-2 text-[13px] lg:text-[15px] py-[16px] uppercase border-[#E50914]"
            onClick={() => {
              setStateMovie("today | upcoming");
              setCurrentPage(1);
            }}
            style={{
              borderBottom: stateMovie === "today | upcoming" ? "3px solid #E50914" : "none",
            }}
          >
            tất cả phim
          </button>
          <button
            className="md:mx-3 mx-2 text-[13px] lg:text-[15px] py-[16px] uppercase border-[#E50914]"
            onClick={() => {
              setStateMovie("today");
              setCurrentPage(1);
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
              setCurrentPage(1);
            }}
            style={{
              borderBottom: stateMovie === "upcoming" ? "3px solid #E50914" : "none",
            }}
          >
            phim sắp chiếu
          </button>
        </div>
        <div className="flex items-center space-x-4 mt-3 md:mt-0">
          <div className="relative flex items-center w-1/3">
            <input
              type="search"
              className="
                text-black w-full rounded-lg border border-neutral-300 px-3 py-2 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-gray-500 dark:text-white"
              placeholder="Search"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Select onValueChange={handleCategoryChange} value={selectedCategory?.toString() ?? ALL_CATEGORIES}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white">
              <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center my-12">
          <Spin size="large" />
        </div>
      ) : filteredMovies.length ? (
        <div className="animate-show-up grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-x-16 lg:gap-y-10 md:gap-3 gap-3 justify-items-center my-12 mx-5">
          {filteredMovies.map((movie, index) => (
            <div key={movie.id}>
              <Movie movie={movie ?? {}} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-dvh">
          <Empty />
        </div>
      )}

      {filteredMovies.length > 0 && !isLoading && (
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
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
};

export default MovieList;

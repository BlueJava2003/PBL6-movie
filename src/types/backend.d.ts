export {};

declare global {
  interface ISchedule {
    id: number;
    date: string;
    timeStart: string;
    timeEnd: string;
    room: {
      roomId: number;
      roomName: string;
    };
    movie: {
      id: number;
      name: string;
      duration: number;
      releaseDate: number;
      desc: string;
      categoryId: number;
      director: string;
      actor: string;
      language: string;
      urlTrailer: string;
      imagePath: string;
    };
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

  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    message: string;
    status: number;
    data?: T;
  }

  interface IUser {
    accessToken?: string;
    refresh_token?: string;
    name: string;
  }

  interface IUserContext {
    currentUser: IUser;
    setCurrentUser: (v: IUser) => void;
  }

  interface IInfoBooking extends IInfoSeatSelect {
    scheduleId: number;
    movieName: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    countSeat: number;
    roomName: string;
  }

  interface IInfoSeatSelect {
    seatIds: number[]?;
    seatNames: string[]?;
    price: number;
  }

  interface IBookingContext {
    infoBooking: IInfoSeatSelect;
    setInfoBooking: (v: IInfoSeatSelect) => void;
  }

  interface ISeat {
    seatId: number;
    name: string;
    type: string;
    price: number;
    isReserved: boolean;
  }

  interface IListSeat {
    room: {
      id: number;
      roomName: string;
    };
    seats: ISeat[];
  }
}

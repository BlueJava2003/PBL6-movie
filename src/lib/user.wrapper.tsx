"use client";

import { useCookies } from "next-client-cookies";
import { createContext, useContext, useLayoutEffect, useState } from "react";

export const UserContext = createContext<IUserContext | IBookingContext | null>(null);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const cookies = useCookies();
  const accessTk = cookies.get("accessToken");
  const refreshTk = cookies.get("refreshToken");

  const initValue = {
    accessToken: "",
    refresh_token: "",
    name: "",
  };

  const initInfo = {
    seatIds: [],
    seatNames: [],
    price: 0,
  };
  const [currentUser, setCurrentUser] = useState<IUser>(initValue);
  const [infoBooking, setInfoBooking] = useState<IInfoSeatSelect>(initInfo);

  useLayoutEffect(() => {
    if (accessTk || refreshTk) {
      setCurrentUser({
        accessToken: accessTk,
        refresh_token: refreshTk,
        name: "Your account",
      });
    }
  }, [accessTk, refreshTk]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, infoBooking, setInfoBooking }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

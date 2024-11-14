"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, FilmIcon, HomeIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IBooking {
  id: number;
  accountId: number;
  scheduleId: number;
  seatsBooked: string[];
  state: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  schedule: {
    date: string;
    roomState: {
      room: {
        id: number;
        roomName: string;
      };
    };
    movie: {
      id: number;
      name: string;
    };
  };
}

interface BookingStatisticsProps {
  bookings: IBooking[];
}

export function BookingStatistics({ bookings }: BookingStatisticsProps) {
  const [dailyRevenue, setDailyRevenue] = useState<{ [key: string]: number }>({});
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ [key: string]: number }>({});
  const [yearlyRevenue, setYearlyRevenue] = useState<{ [key: string]: number }>({});
  const [movieRevenue, setMovieRevenue] = useState<{ [key: string]: number }>({});
  const [roomRevenue, setRoomRevenue] = useState<{ [key: string]: number }>({});
  const [dateRangeRevenue, setDateRangeRevenue] = useState<{ [key: string]: number }>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const [dailyTickets, setDailyTickets] = useState<{ [key: string]: number }>({});
  const [monthlyTickets, setMonthlyTickets] = useState<{ [key: string]: number }>({});
  const [yearlyTickets, setYearlyTickets] = useState<{ [key: string]: number }>({});
  const [movieTickets, setMovieTickets] = useState<{ [key: string]: number }>({});
  const [roomTickets, setRoomTickets] = useState<{ [key: string]: number }>({});
  const [dateRangeTickets, setDateRangeTickets] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    calculateRevenueAndTickets(bookings);
  }, [bookings]);

  const calculateRevenueAndTickets = (bookingsToCalculate: IBooking[]) => {
    const daily: { [key: string]: { revenue: number; tickets: number } } = {};
    const monthly: { [key: string]: { revenue: number; tickets: number } } = {};
    const yearly: { [key: string]: { revenue: number; tickets: number } } = {};
    const movie: { [key: string]: { revenue: number; tickets: number } } = {};
    const room: { [key: string]: { revenue: number; tickets: number } } = {};

    bookingsToCalculate.forEach((booking) => {
      const date = new Date(booking.createdAt);
      const dayKey = date.toISOString().split("T")[0];
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const yearKey = `${date.getFullYear()}`;
      const movieKey = booking.schedule.movie.name;
      const roomKey = booking.schedule.roomState.room.roomName;

      // Count each booking as one ticket
      const ticketCount = 1;

      // Update daily stats
      daily[dayKey] = daily[dayKey] || { revenue: 0, tickets: 0 };
      daily[dayKey].revenue += booking.totalPrice;
      daily[dayKey].tickets += ticketCount;

      // Update monthly stats
      monthly[monthKey] = monthly[monthKey] || { revenue: 0, tickets: 0 };
      monthly[monthKey].revenue += booking.totalPrice;
      monthly[monthKey].tickets += ticketCount;

      // Update yearly stats
      yearly[yearKey] = yearly[yearKey] || { revenue: 0, tickets: 0 };
      yearly[yearKey].revenue += booking.totalPrice;
      yearly[yearKey].tickets += ticketCount;

      // Update movie stats
      movie[movieKey] = movie[movieKey] || { revenue: 0, tickets: 0 };
      movie[movieKey].revenue += booking.totalPrice;
      movie[movieKey].tickets += ticketCount;

      // Update room stats
      room[roomKey] = room[roomKey] || { revenue: 0, tickets: 0 };
      room[roomKey].revenue += booking.totalPrice;
      room[roomKey].tickets += ticketCount;
    });

    setDailyRevenue(Object.fromEntries(Object.entries(daily).map(([k, v]) => [k, v.revenue])));
    setMonthlyRevenue(Object.fromEntries(Object.entries(monthly).map(([k, v]) => [k, v.revenue])));
    setYearlyRevenue(Object.fromEntries(Object.entries(yearly).map(([k, v]) => [k, v.revenue])));
    setMovieRevenue(Object.fromEntries(Object.entries(movie).map(([k, v]) => [k, v.revenue])));
    setRoomRevenue(Object.fromEntries(Object.entries(room).map(([k, v]) => [k, v.revenue])));

    setDailyTickets(Object.fromEntries(Object.entries(daily).map(([k, v]) => [k, v.tickets])));
    setMonthlyTickets(Object.fromEntries(Object.entries(monthly).map(([k, v]) => [k, v.tickets])));
    setYearlyTickets(Object.fromEntries(Object.entries(yearly).map(([k, v]) => [k, v.tickets])));
    setMovieTickets(Object.fromEntries(Object.entries(movie).map(([k, v]) => [k, v.tickets])));
    setRoomTickets(Object.fromEntries(Object.entries(room).map(([k, v]) => [k, v.tickets])));
  };

  const handleDateRangeFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const filteredBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= start && bookingDate <= end;
      });

      const dateRange: { [key: string]: { revenue: number; tickets: number } } = {};
      filteredBookings.forEach((booking) => {
        const date = new Date(booking.createdAt).toISOString().split("T")[0];
        dateRange[date] = dateRange[date] || { revenue: 0, tickets: 0 };
        dateRange[date].revenue += booking.totalPrice;
        dateRange[date].tickets += 1; // Count each booking as one ticket
      });

      setDateRangeRevenue(Object.fromEntries(Object.entries(dateRange).map(([k, v]) => [k, v.revenue])));
      setDateRangeTickets(Object.fromEntries(Object.entries(dateRange).map(([k, v]) => [k, v.tickets])));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#A4DE6C",
    "#D0ED57",
    "#FFC658",
    "#FF7300",
  ];

  const renderRevenueAndTicketsTable = (
    revenueData: { [key: string]: number },
    ticketData: { [key: string]: number },
    title: string
  ) => {
    const sortedData = Object.entries(revenueData)
      .map(([key, revenue]) => ({
        name: key,
        revenue,
        tickets: ticketData[key] || 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const chartData = sortedData.map(({ name, revenue, tickets }) => ({ name, revenue, tickets }));

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Date/Name</th>
                    <th className="text-left p-2">Revenue</th>
                    <th className="text-left p-2">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map(({ name, revenue, tickets }) => (
                    <tr key={name}>
                      <td className="p-2">{name}</td>
                      <td className="p-2">{formatCurrency(revenue)}</td>
                      <td className="p-2">{tickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ChartContainer className="h-[300px]" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartContainer className="h-[300px]" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                      tickFormatter={(value) => Math.round(value).toString()}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="right" dataKey="tickets" fill="#82ca9d" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartContainer className="h-[400px]" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartContainer className="h-[400px]" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="tickets"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const DateInput = ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (value: string) => void;
    label: string;
  }) => (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="w-[200px]" />
    </div>
  );

  const quickDateRanges = [
    { label: "Hôm nay", days: 0 },
    { label: "7 ngày qua", days: 7 },
    { label: "30 ngày qua", days: 30 },
    { label: "90 ngày qua", days: 90 },
    { label: "6 tháng qua", days: 180 },
  ];

  const setQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList>
        <TabsTrigger value="daily">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Daily
        </TabsTrigger>
        <TabsTrigger value="monthly">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Monthly
        </TabsTrigger>
        <TabsTrigger value="yearly">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Yearly
        </TabsTrigger>
        <TabsTrigger value="movie">
          <FilmIcon className="w-4 h-4 mr-2" />
          By Movie
        </TabsTrigger>
        <TabsTrigger value="room">
          <HomeIcon className="w-4 h-4 mr-2" />
          By Room
        </TabsTrigger>
        <TabsTrigger value="date-range">
          <CalendarIcon className="w-4 h-4 mr-2" />
          Date Range
        </TabsTrigger>
      </TabsList>
      <TabsContent value="daily">
        {renderRevenueAndTicketsTable(dailyRevenue, dailyTickets, "Daily Revenue and Bookings")}
      </TabsContent>
      <TabsContent value="monthly">
        {renderRevenueAndTicketsTable(monthlyRevenue, monthlyTickets, "Monthly Revenue and Bookings")}
      </TabsContent>
      <TabsContent value="yearly">
        {renderRevenueAndTicketsTable(yearlyRevenue, yearlyTickets, "Yearly Revenue and Bookings")}
      </TabsContent>
      <TabsContent value="movie">
        {renderRevenueAndTicketsTable(movieRevenue, movieTickets, "Revenue and Bookings by Movie")}
      </TabsContent>
      <TabsContent value="room">
        {renderRevenueAndTicketsTable(roomRevenue, roomTickets, "Revenue and Bookings by Room")}
      </TabsContent>
      <TabsContent value="date-range">
        <Card>
          <CardHeader>
            <CardTitle>Date Range Revenue and Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2">
                {quickDateRanges.map((range) => (
                  <Button
                    key={range.label}
                    variant="ghost"
                    className={selectedLabel === range.label ? "bg-slate-900 text-white" : "outline"}
                    onClick={() => {
                      setSelectedLabel(range.label);
                      setQuickDateRange(range.days);
                    }}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <DateInput value={startDate} onChange={setStartDate} label="Ngày bắt đầu" />
                <DateInput value={endDate} onChange={setEndDate} label="Ngày kết thúc" />
                <Button onClick={handleDateRangeFilter} className="mt-6 text-white">
                  Áp dụng
                </Button>
              </div>
            </div>
            {renderRevenueAndTicketsTable(
              dateRangeRevenue,
              dateRangeTickets,
              "Doanh thu và Đặt chỗ theo khoảng thời gian"
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

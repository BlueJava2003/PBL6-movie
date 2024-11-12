"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { sendRequest } from "@/utils/api";
import { parseCookies } from "nookies";

const scheduleSchema = z.object({
  date: z.string(),
  timeStart: z.string(),
  timeEnd: z.string(),
  roomId: z.number(),
  movieId: z.number(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

const vietnamTimeZoneOffset = 7 * 60; // Vietnam is UTC+7

function toVietnamTime(date: Date): Date {
  return new Date(date.getTime() + vietnamTimeZoneOffset * 60000);
}

export default function MovieSchedule() {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ISchedule | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      date: toVietnamTime(new Date()).toISOString().slice(0, 16),
      timeStart: new Date().toTimeString().slice(0, 5),
      timeEnd: new Date().toTimeString().slice(0, 5),
      roomId: 1,
      movieId: 9,
    },
  });

  const formatDateTimeForAPI = (
    date: string,
    timeStart: string,
    timeEnd: string
  ): { date: string; timeStart: string; timeEnd: string } => {
    const dateTime = new Date(date);
    const [startHours, startMinutes] = timeStart.split(":");
    const [endHours, endMinutes] = timeEnd.split(":");

    const startDate = new Date(dateTime);
    startDate.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10), 0, 0);

    const endDate = new Date(dateTime);
    endDate.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10), 0, 0);

    return {
      date: dateTime.toISOString(),
      timeStart: startDate.toISOString(),
      timeEnd: endDate.toISOString(),
    };
  };

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await sendRequest<IBackendRes<ISchedule[]>>({
        url: `${process.env.customURL}/schedule/getAllschedule`,
        method: "GET",
      });
      if (res.data) {
        setSchedules(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      setAlert({ type: "error", message: "Failed to fetch schedules. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const createSchedule = async (data: ScheduleFormData) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      const formattedData = formatDateTimeForAPI(data.date, data.timeStart, data.timeEnd);
      console.log("data input: ", formattedData);
      console.log("data input data:  ", data);
      await sendRequest<IBackendRes<ISchedule>>({
        url: `${process.env.customURL}/schedule/createSchedule`,
        method: "POST",
        body: { ...data, ...formattedData },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAlert({ type: "success", message: "Schedule created successfully" });
      setIsDialogOpen(false);
      form.reset();
      fetchSchedules();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      setAlert({ type: "error", message: "Failed to create schedule. Please try again." });
    }
  };

  const updateSchedule = async (data: ScheduleFormData) => {
    if (!editingSchedule) return;
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      const formattedData = formatDateTimeForAPI(data.date, data.timeStart, data.timeEnd);
      await sendRequest({
        url: `${process.env.customURL}/schedule/updateSchedule/${editingSchedule.id}`,
        method: "PUT",
        body: { ...data, ...formattedData },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAlert({ type: "success", message: "Schedule updated successfully" });
      setIsDialogOpen(false);
      setEditingSchedule(null);
      form.reset();
      fetchSchedules();
    } catch (error) {
      console.error("Failed to update schedule:", error);
      setAlert({ type: "error", message: "Failed to update schedule. Please try again." });
    }
  };

  const deleteSchedule = async (id: number) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      await sendRequest({
        url: `${process.env.customURL}/schedule/deleteSchedule/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAlert({ type: "success", message: "Schedule deleted successfully" });
      fetchSchedules();
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      setAlert({ type: "error", message: "Failed to delete schedule. Please try again." });
    }
  };

  const onSubmit = (data: ScheduleFormData) => {
    if (editingSchedule) {
      updateSchedule(data);
    } else {
      createSchedule(data);
    }
  };

  const convertToDateTimeLocal = (dateString: any) => {
    // Tách ngày, tháng, năm từ chuỗi
    const [day, month, year] = dateString.split("/").map(Number);

    // Tạo đối tượng Date từ các giá trị
    const date = new Date(year, month - 1, day);

    // Định dạng lại thành `YYYY-MM-DDTHH:mm`
    const formattedDate = date.toISOString().slice(0, 16); // ISO trả về ở UTC, slice để lấy `YYYY-MM-DDTHH:mm`

    return formattedDate;
  };

  const handleEdit = (schedule: ISchedule) => {
    console.log(schedule);
    setEditingSchedule(schedule);
    const startDate = toVietnamTime(new Date(schedule.timeStart));
    const endDate = toVietnamTime(new Date(schedule.timeEnd));

    form.reset({
      date: convertToDateTimeLocal(schedule.date),
      timeStart: schedule.timeStart.slice(0, 5),
      timeEnd: schedule.timeEnd.slice(0, 5),
      roomId: schedule.room.id,
      movieId: schedule.movie.id,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      deleteSchedule(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Movie Schedules</h1>
      {alert && (
        <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mb-5">
          <AlertTitle>{alert.type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="text-white"
            onClick={() => {
              setEditingSchedule(null);
              form.reset({
                date: toVietnamTime(new Date()).toISOString().slice(0, 16),
                timeStart: toVietnamTime(new Date()).toTimeString().slice(0, 5),
                timeEnd: toVietnamTime(new Date(Date.now() + 2 * 60 * 60 * 1000))
                  .toTimeString()
                  .slice(0, 5),
                roomId: 1,
                movieId: 9,
              });
            }}
          >
            Add New Schedule
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? "Edit Schedule" : "Add New Schedule"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date and Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room ID</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="movieId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie ID</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="text-white" type="submit">
                {editingSchedule ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Movie</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.id}</TableCell>
              <TableCell>{schedule.date}</TableCell>
              <TableCell>{schedule.timeStart}</TableCell>
              <TableCell>{schedule.timeEnd}</TableCell>
              <TableCell>{schedule.room.roomName}</TableCell>
              <TableCell>{schedule.movie.name}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(schedule)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(schedule.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

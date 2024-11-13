"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseCookies } from "nookies";
import { sendRequest } from "@/utils/api";
import { X } from "lucide-react";

interface ISeatAdmin {
  id: number;
  name: string;
  type: string;
  seatTypeId: number;
}

interface ISeatType {
  id: number;
  name: string;
  price: number;
}

export default function SeatManagement() {
  const [seats, setSeats] = useState<ISeatAdmin[]>([]);
  const [seatTypes, setSeatTypes] = useState<ISeatType[]>([]);
  const [editingSeat, setEditingSeat] = useState<ISeatAdmin | null>(null);
  const [newSeat, setNewSeat] = useState<Partial<ISeatAdmin>>({ name: "", seatTypeId: undefined });
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchSeats();
    fetchSeatTypes();
  }, []);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchSeats = async () => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<ISeatAdmin[]>>({
        url: `${process.env.customURL}/seat`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data) {
        setSeats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch seats:", error);
      showNotification("error", "Failed to fetch seats. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSeatTypes = async () => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<ISeatType[]>>({
        url: `${process.env.customURL}/seat-type`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data) {
        setSeatTypes(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch seat types:", error);
      showNotification("error", "Failed to fetch seat types. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSeat = async () => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<ISeatAdmin>>({
        url: `${process.env.customURL}/seat`,
        method: "POST",
        body: newSeat,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data) {
        showNotification("success", "Seat added successfully");
        fetchSeats();
        setNewSeat({ name: "", seatTypeId: undefined });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to add seat:", error);
      showNotification("error", "Failed to add seat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSeat = async () => {
    if (!editingSeat) return;
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<ISeatAdmin>>({
        url: `${process.env.customURL}/seat/${editingSeat.id}`,
        method: "PUT",
        body: editingSeat,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data) {
        showNotification("success", "Seat updated successfully");
        fetchSeats();
        setEditingSeat(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Failed to update seat:", error);
      showNotification("error", "Failed to update seat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSeat = async (seatId: number) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      setIsLoading(true);
      const res = await sendRequest<any>({
        url: `${process.env.customURL}/seat/${seatId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 200) {
        showNotification("success", "Seat deleted successfully");
        fetchSeats();
      }
    } catch (error) {
      console.error("Failed to delete seat:", error);
      showNotification("error", "Failed to delete seat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-6">Seat Management</h1>

      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          <p className="font-semibold">{notification.type === "error" ? "Error" : "Success"}</p>
          <p>{notification.message}</p>
        </div>
      )}

      <Button
        onClick={() => {
          setShowForm(true);
          setEditingSeat(null);
          setNewSeat({ name: "", seatTypeId: undefined });
        }}
        className="mb-6 text-white"
      >
        Add New Seat
      </Button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle>{editingSeat ? "Edit Seat" : "Add New Seat"}</CardTitle>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Seat Name"
                  value={editingSeat ? editingSeat.name : newSeat.name}
                  onChange={(e) =>
                    editingSeat
                      ? setEditingSeat({ ...editingSeat, name: e.target.value })
                      : setNewSeat({ ...newSeat, name: e.target.value })
                  }
                />
                <Select
                  value={editingSeat ? editingSeat.seatTypeId.toString() : newSeat.seatTypeId?.toString()}
                  onValueChange={(value) =>
                    editingSeat
                      ? setEditingSeat({ ...editingSeat, seatTypeId: parseInt(value, 10) })
                      : setNewSeat({ ...newSeat, seatTypeId: parseInt(value, 10) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Seat Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 text-white">
                    {seatTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name} (${type.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    className="text-white"
                    onClick={editingSeat ? handleUpdateSeat : handleAddSeat}
                    disabled={isLoading}
                  >
                    {editingSeat ? "Update Seat" : "Add Seat"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seat ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seats.map((seat) => (
                <TableRow key={seat.id}>
                  <TableCell>{seat.id}</TableCell>
                  <TableCell>{seat.name}</TableCell>
                  <TableCell>{seat.seatTypeId == 4 ? "Standard" : "VIP"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setEditingSeat(seat);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteSeat(seat.id)} disabled={isLoading}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

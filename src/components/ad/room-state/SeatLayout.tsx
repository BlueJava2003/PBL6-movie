import { Button } from "@/components/ui/button";

interface ISeat {
  seatId: string;
  name: string;
  isReserved: boolean;
  type: "NORMAL" | "VIP";
}

interface SeatLayoutProps {
  seats: ISeat[];
  onSeatSelect: (seat: ISeat) => void;
  selectedSeats: string[];
}

export function SeatLayout({ seats, onSeatSelect, selectedSeats }: SeatLayoutProps) {
  const renderSeat = (seat: ISeat) => {
    const isSelected = selectedSeats.includes(seat.name);
    const seatClasses = `
      h-8 w-8 text-xs font-medium rounded-t-lg
      flex items-center justify-center transition-all duration-200 ease-in-out
      ${
        seat.isReserved
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : isSelected
          ? "bg-green-500 text-white"
          : seat.type === "VIP"
          ? "bg-amber-300 hover:bg-amber-400 text-amber-800"
          : "bg-blue-300 hover:bg-blue-400 text-blue-800"
      }
      ${!seat.isReserved && "cursor-pointer hover:scale-105"}
    `;

    return (
      <Button
        key={seat.seatId}
        className={seatClasses}
        onClick={() => !seat.isReserved && onSeatSelect(seat)}
        disabled={seat.isReserved}
        aria-label={`Seat ${seat.name}`}
        variant="ghost"
        size="sm"
      >
        {seat.name}
      </Button>
    );
  };

  const renderSeatRow = (rowSeats: ISeat[], isSideRow: boolean = false) => (
    <div className={`flex justify-center gap-1 mb-1 ${isSideRow ? "px-2 py-1 bg-gray-100 rounded" : ""}`}>
      {rowSeats.map(renderSeat)}
    </div>
  );

  const renderSeatLayout = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    return rows.map((row) => {
      const rowSeats = seats.filter((seat) => seat.name.startsWith(row));
      const leftSeats = rowSeats.slice(0, 2);
      const centerSeats = rowSeats.slice(2, 8);
      const rightSeats = rowSeats.slice(8);

      return (
        <div key={row} className="flex justify-center gap-4">
          {renderSeatRow(leftSeats, true)}
          {renderSeatRow(centerSeats)}
          {renderSeatRow(rightSeats, true)}
        </div>
      );
    });
  };

  return <div className="mt-4 space-y-2">{renderSeatLayout()}</div>;
}

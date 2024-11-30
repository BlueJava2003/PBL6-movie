import { PaymentInfo } from "@/components/payment-info/PaymentInfo";

export default function TicketInfoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thông tin thanh toán</h1>
      <PaymentInfo params={searchParams} />
    </div>
  );
}

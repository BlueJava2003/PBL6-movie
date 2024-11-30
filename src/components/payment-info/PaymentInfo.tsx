import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PaymentInfoProps = {
  params: { [key: string]: string | string[] | undefined };
};

export function PaymentInfo({ params }: PaymentInfoProps) {
  const formatAmount = (amount: string) => {
    const numAmount = parseInt(amount, 10) / 100;
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(numAmount);
  };

  const formatDate = (date: string) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const hour = date.slice(8, 10);
    const minute = date.slice(10, 12);
    const second = date.slice(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const getStatusText = (code: string) => {
    return code === "00" ? "Thành công" : "Thất bại";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết giao dịch</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium">Số tiền:</dt>
            <dd>{params.vnp_Amount ? formatAmount(params.vnp_Amount as string) : "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Ngân hàng:</dt>
            <dd>{params.vnp_BankCode || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Mã giao dịch ngân hàng:</dt>
            <dd>{params.vnp_BankTranNo || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Loại thẻ:</dt>
            <dd>{params.vnp_CardType || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Nội dung thanh toán:</dt>
            <dd>{params.vnp_OrderInfo || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Thời gian thanh toán:</dt>
            <dd>{params.vnp_PayDate ? formatDate(params.vnp_PayDate as string) : "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Mã phản hồi:</dt>
            <dd>{params.vnp_ResponseCode || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Mã đơn vị:</dt>
            <dd>{params.vnp_TmnCode || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Mã giao dịch VNPAY:</dt>
            <dd>{params.vnp_TransactionNo || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Trạng thái giao dịch:</dt>
            <dd>{params.vnp_TransactionStatus ? getStatusText(params.vnp_TransactionStatus as string) : "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium">Mã tham chiếu:</dt>
            <dd>{params.vnp_TxnRef || "N/A"}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

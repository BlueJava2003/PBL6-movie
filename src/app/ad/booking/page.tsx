import BookingList from "@/components/ad/booking/bookingList";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";

const bookingListPage = async () => {
  return (
    <SidebarProvider>
      <AdminLayout>
        <BookingList />
      </AdminLayout>
    </SidebarProvider>
  );
};

export default bookingListPage;

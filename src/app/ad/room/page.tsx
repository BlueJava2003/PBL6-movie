import RoomList from "@/components/ad/room/room-page/roomList";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";

const roomPage = async () => {
  return (
    <SidebarProvider>
      <AdminLayout>
        <RoomList />
      </AdminLayout>
    </SidebarProvider>
  );
};

export default roomPage;

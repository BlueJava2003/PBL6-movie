import CreateRoom from "@/components/ad/room/createRoom/createRoom";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";

const CreateRoomPage = async () => {
  return (
    <SidebarProvider>
      <AdminLayout>
        <CreateRoom />
      </AdminLayout>
    </SidebarProvider>
  );
};

export default CreateRoomPage;

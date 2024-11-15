import MovieSchedule from "@/components/ad/schedule/MovieSchedule";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";

const MoviePage = async () => {
  return (
    <SidebarProvider>
      <AdminLayout>
        <MovieSchedule />
      </AdminLayout>
    </SidebarProvider>
  );
};

export default MoviePage;

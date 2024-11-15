import AdminMovieList from "@/components/ad/movie/AdminMovieTable";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";

const MoviePage = async () => {
  return (
    <SidebarProvider>
      <AdminLayout>
        <AdminMovieList />
      </AdminLayout>
    </SidebarProvider>
  );
};

export default MoviePage;

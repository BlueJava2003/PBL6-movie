import AdminMovieCategoryList from "@/components/ad/category/AdminMovieCategoryList";
import AdminLayout from "@/components/AdminLayout";
import { SidebarProvider } from "@/components/SidebarContext";

const MoviePage = async () => {
  return (
    <SidebarProvider>
      <AdminLayout>
        <AdminMovieCategoryList />
      </AdminLayout>
    </SidebarProvider>
  );
};

export default MoviePage;

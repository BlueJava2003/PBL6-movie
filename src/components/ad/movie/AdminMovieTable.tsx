"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  namevn: z.string().min(2, { message: "Vietnamese name must be at least 2 characters." }),
  type: z.string().min(2, { message: "Type must be at least 2 characters." }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute." }),
  released: z.string().min(2, { message: "Release date is required." }),
  desc: z.string().optional(),
  director: z.string().optional(),
  actor: z.string().optional(),
  language: z.string().optional(),
  urlTrailer: z.string().optional(),
  imagePath: z.string().optional(),
});

export default function AdminMovieList() {
  const [movies, setMovies] = useState<IListMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<IListMovie | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      namevn: "",
      type: "",
      duration: 0,
      released: "",
      desc: "",
      director: "",
      actor: "",
      language: "",
      urlTrailer: "",
      imagePath: "",
    },
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/movie/getAllMovie`,
        method: "GET",
        queryParams: {
          page: 1,
          limit: 10,
        },
      });

      if (res.data) {
        setMovies(res.data.slice(0, res.data.length - 1));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      toast({
        title: "Error",
        description: "Failed to fetch movies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleAdd = () => {
    setEditingMovie(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleEdit = (movie: IListMovie) => {
    form.reset({
      name: movie.name,
      type: movie.category.name,
      duration: movie.duration,
      released: movie.releaseDate,
      desc: movie.desc,
      director: movie.director,
      actor: movie.actor,
      language: movie.language,
      urlTrailer: movie.urlTrailer,
      imagePath: movie.imagePath,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        await sendRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/movie/deleteMovie/${id}`,
          method: "DELETE",
        });
        setMovies(movies.filter((movie) => movie.id !== id));
        toast({
          title: "Success",
          description: "Movie deleted successfully.",
        });
      } catch (error) {
        console.error("Failed to delete movie:", error);
        toast({
          title: "Error",
          description: "Failed to delete movie. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingMovie) {
        await sendRequest({
          url: `${process.env.NEXT_PUBLIC_API_URL}/movie/updateMovie/${editingMovie.id}`,
          method: "PUT",
          body: values,
        });
        setMovies(movies.map((movie) => (movie.id === editingMovie.id ? { ...movie, ...values } : movie)));
        toast({
          title: "Success",
          description: "Movie updated successfully.",
        });
      } else {
        const res = await sendRequest<{ data: IListMovie }>({
          url: `${process.env.NEXT_PUBLIC_API_URL}/movie/createMovie`,
          method: "POST",
          body: values,
        });
        toast({
          title: "Success",
          description: "Movie added successfully.",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save movie:", error);
      toast({
        title: "Error",
        description: "Failed to save movie. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search movies..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Movie
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead> {/* Thêm cột ảnh */}
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Released</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No movies found.
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.name}</TableCell>
                  <TableCell>
                    {/* Hiển thị hình ảnh */}
                    {movie.imagePath ? (
                      <img src={movie.imagePath} alt={movie.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      "No image"
                    )}
                  </TableCell>
                  <TableCell>{movie.desc}</TableCell>
                  <TableCell>{movie.category.name}</TableCell>
                  <TableCell>{movie.duration} min</TableCell>
                  <TableCell>{format(new Date(movie.releaseDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{movie.director}</TableCell>
                  <TableCell>{movie.actor}</TableCell>
                  <TableCell>{movie.language}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(movie)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(movie.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Form fields for name, type, duration, etc.
               */}
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter movie name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="namevn"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vietnamese Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Vietnamese name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter movie type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="duration"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter duration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="released"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="desc"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="director"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Director</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter director's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="actor"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actors</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter main actors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="language"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter language" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="urlTrailer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trailer URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter trailer URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="imagePath"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Path</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="ml-auto">
                  {editingMovie ? "Save Changes" : "Add Movie"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

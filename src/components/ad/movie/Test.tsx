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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseCookies } from "nookies";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  duration: z.number().min(1, { message: "Duration is required" }),
  releaseDate: z.date({ required_error: "Release date is required" }),
  desc: z.string().optional(),
  categoryId: z.number().min(1, { message: "Category is required" }),
  director: z.string().optional(),
  actor: z.string().optional(),
  language: z.string().optional(),
  urlTrailer: z.string().optional(),
  file: z.instanceof(File).optional(),
});

export default function AdminMovieList() {
  const [movies, setMovies] = useState<IListMovie[]>([]);
  const [categories, setCategories] = useState<IListCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<IListMovie | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string; isError: boolean } | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: 0,
      duration: 0,
      releaseDate: new Date(),
      desc: "",
      director: "",
      actor: "",
      language: "",
      urlTrailer: "",
      file: undefined,
    },
  });

  useEffect(() => {
    fetchMovies();
    fetchCategories();
  }, []);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.customURL}/movie/getAllMovie`,
        method: "GET",
        queryParams: {
          page: 3,
          limit: 10,
        },
      });

      if (res.data) {
        setMovies(res.data.slice(0, res.data.length - 1));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      showNotification("Error", "Failed to fetch movies. Please try again.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await sendRequest<IBackendRes<IListCategory[]>>({
        url: `${process.env.customURL}/category-movie/getAllCategoryMovie`,
        method: "GET",
      });

      if (res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      showNotification("Error", "Failed to fetch categories. Please try again.", true);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleAdd = () => {
    setEditingMovie(null);
    form.reset({
      name: "",
      categoryId: 0,
      duration: 0,
      releaseDate: new Date(),
      desc: "",
      director: "",
      actor: "",
      language: "",
      urlTrailer: "",
      file: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = async (movie: IListMovie) => {
    setEditingMovie(movie);

    let file;
    if (movie.imagePath) {
      const response = await fetch(movie.imagePath);
      const blob = await response.blob();
      file = new File([blob], "existingImage.jpg", { type: blob.type });
    }

    form.reset({
      name: movie.name,
      categoryId: movie.category.id,
      duration: movie.duration,
      releaseDate: new Date(movie.releaseDate),
      desc: movie.desc,
      director: movie.director,
      actor: movie.actor,
      language: movie.language,
      urlTrailer: movie.urlTrailer,
      file: file,
    });
    setImagePreview(movie.imagePath);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        await sendRequest({
          url: `${process.env.customURL}/movie/deleteMovie/${id}`,
          method: "DELETE",
        });
        setMovies(movies.filter((movie) => movie.id !== id));
        showNotification("Success", "Movie deleted successfully.", false);
      } catch (error) {
        console.error("Failed to delete movie:", error);
        showNotification("Error", "Failed to delete movie. Please try again.", true);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "file" && value instanceof File) {
            formData.append(key, value);
          } else if (key === "releaseDate" && value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (editingMovie) {
        await fetch(`${process.env.customURL}/movie/upadteMovie/${editingMovie.id}`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMovies(movies.map((movie) => (movie.id === editingMovie.id ? { ...movie, ...values } : movie)));
        showNotification("Success", "Movie updated successfully.", false);
      } else {
        const res = await fetch(`${process.env.customURL}/movie/createMovie`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const { data }: { data: IListMovie } = await res.json();
        setMovies([...movies, data]);
        showNotification("Success", "Movie added successfully.", false);
      }
      setIsDialogOpen(false);
      setEditingMovie(null);
    } catch (error) {
      console.error("Failed to save movie:", error);
      showNotification("Error", "Failed to save movie. Please try again.", true);
    }
  };

  const showNotification = (title: string, message: string, isError: boolean) => {
    setNotification({ title, message, isError });
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
        <Button onClick={handleAdd} className="text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Movie
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
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
                <TableCell colSpan={10} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No movies found.
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.name}</TableCell>
                  <TableCell>
                    {movie.imagePath ? (
                      <img src={movie.imagePath} alt={movie.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      "No image"
                    )}
                  </TableCell>
                  <TableCell>{movie.desc}</TableCell>
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
        <DialogContent className="sm:max-w-[425px] bg-white shadow-md">
          <DialogHeader>
            <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  name="categoryId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input
                          type="number"
                          placeholder="Enter duration"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="releaseDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ""}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            field.onChange(date);
                          }}
                        />
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
                  name="file"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </FormControl>
                      {imagePreview && (
                        <div>
                          <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="ml-auto text-white">
                  {editingMovie ? "Save Changes" : "Add Movie"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {notification && (
        <Dialog open={!!notification} onOpenChange={() => setNotification(null)}>
          <DialogContent
            className={`sm:max-w-[425px] ${notification.isError ? "bg-red-100" : "bg-green-100"} shadow-md`}
          >
            <DialogHeader>
              <DialogTitle className={notification.isError ? "text-red-700" : "text-green-700"}>
                {notification.title}
              </DialogTitle>
            </DialogHeader>
            <p className={notification.isError ? "text-red-600" : "text-green-600"}>{notification.message}</p>
            <Button onClick={() => setNotification(null)} className="mt-4">
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

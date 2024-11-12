"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { parseCookies } from "nookies";
interface IListCategory {
  id: number;
  name: string;
  desc: string;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  desc: z.string().optional(),
});

export default function AdminMovieCategoryList() {
  const [categories, setCategories] = useState<IListCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IListCategory | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        desc: editingCategory.desc,
      });
    } else {
      form.reset({
        name: "",
        desc: "",
      });
    }
  }, [editingCategory, form]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await sendRequest<IBackendRes<IListCategory[]>>({
        url: `${process.env.customURL}/category-movie/getAllCategoryMovie`,
        method: "GET",
      });

      if (res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
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
    setEditingCategory(null);
    form.reset({
      name: "",
      desc: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: IListCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const cookies = parseCookies();
        const accessToken = cookies.accessToken;
        await sendRequest({
          url: `${process.env.customURL}/category/deleteCategory/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(categories.filter((category) => category.id !== id));
        toast({
          title: "Success",
          description: "Category deleted successfully.",
        });
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      console.log("acess: ", accessToken);
      if (editingCategory) {
        await sendRequest({
          url: `${process.env.customURL}/category-movie/updateCategory/${editingCategory.id}`,
          method: "PUT",
          body: values,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCategories(
          categories.map((category) => (category.id === editingCategory.id ? { ...category, ...values } : category))
        );
        toast({
          title: "Success",
          description: "Category updated successfully.",
        });
      } else {
        const res = await sendRequest<{ data: IListCategory }>({
          url: `http://localhost:3001/category-movie/createCategoryMovie`,
          method: "POST",
          body: values,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(res);
        if (res.data) {
          setCategories([...categories, res.data]);
        }
        toast({
          title: "Success",
          description: "Category added successfully.",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search categories..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        <Button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      <div className="rounded-lg border border-gray-200 shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-bold text-gray-700">Name</TableHead>
              <TableHead className="font-bold text-gray-700">Description</TableHead>
              <TableHead className="font-bold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  <div className="animate-pulse flex justify-center items-center">
                    <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
                    <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
                    <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50">
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.desc}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-500 hover:text-red-700"
                    >
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
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category description"
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
              >
                {editingCategory ? "Save Changes" : "Add Category"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

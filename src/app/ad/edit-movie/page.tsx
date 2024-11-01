import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditMovie({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the movie data based on the ID
  const movie = {
    id: params.id,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Movie</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" defaultValue={movie.title} />
        </div>
        <div>
          <Label htmlFor="director">Director</Label>
          <Input id="director" defaultValue={movie.director} />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" defaultValue={movie.year} />
        </div>
        <Button type="submit">Update Movie</Button>
        <Button asChild variant="outline" className="ml-2">
          <Link href="/">Cancel</Link>
        </Button>
      </form>
    </div>
  );
}

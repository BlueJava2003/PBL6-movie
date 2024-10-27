import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddMovie() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Movie</h1>
      <form className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter movie title" />
        </div>
        <div>
          <Label htmlFor="director">Director</Label>
          <Input id="director" placeholder="Enter director's name" />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" placeholder="Enter release year" />
        </div>
        <Button type="submit">Add Movie</Button>
        <Button asChild variant="outline" className="ml-2">
          <Link href="/">Cancel</Link>
        </Button>
      </form>
    </div>
  );
}

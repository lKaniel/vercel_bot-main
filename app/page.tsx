import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="space-y-4">
      <p>
Want to create a post for Instagram? Click the button below to get started.
      </p>
      <Button><Link href={"/post"}>create post for instagram</Link> </Button>
    </main>
  );
}

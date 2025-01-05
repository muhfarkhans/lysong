import ThemeToggle from "@/components/themetoggle";
import Link from "next/link";

export default function LyricLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="absolute top-0 z-10 w-full px-8 md:px-20">
        <div className="my-8 container mx-auto flex justify-between">
          <Link href={"/"}>
            <span className="font-bold">Lysong</span>
          </Link>

          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

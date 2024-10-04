import { Icons } from "./icons";

export function Footer() {
  return (
    <footer className="flex justify-center pb-4 text-white">
      <div className="mr-2 text-[0.5rem]">Powered by</div>
      <Icons.logo className="w-10" />
    </footer>
  );
}
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { MenuIcon } from "lucide-react";

import { useQueryOption } from "@/lib/api";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Header = () => {
  const { data: user } = useQuery(useQueryOption());
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold">
            BetterNews
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link className="link-hover">new</Link>
            <Link className="link-hover">top</Link>
            <Link className="link-hover">submit</Link>
          </nav>
        </div>
        <div className="hidden items-center space-x-4 md:flex">
          {user ? (
            <>
              <span>{user}</span>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
              >
                <a href="api/auth/logout">Log out</a>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
            >
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="md:hidden">
              <MenuIcon className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-4 mb-2">
            <SheetHeader>
              <SheetTitle>BetterNews</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-y-4">
              <Link className="link-hover">new</Link>
              <Link className="link-hover">top</Link>
              <Link className="link-hover">submit</Link>
              {user ? (
                <>
                  <span>user: {user}</span>
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
                  >
                    <a href="api/auth/logout">Log out</a>
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
                >
                  <Link onClick={() => setIsOpen(false)} to="/login">
                    Log in
                  </Link>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
export default Header;

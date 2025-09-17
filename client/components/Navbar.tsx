import { ShoppingCart, Search, User, LogIn, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ManageRestaurants from "@/components/ManageRestaurants";

export default function Navbar({
  onOpenCart,
  onSearch,
}: {
  onOpenCart: () => void;
  onSearch?: (q: string) => void;
}) {
  const count = useAppSelector((s) =>
    s.cart.items.reduce((a, b) => a + b.qty, 0),
  );
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const authed = !!(
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );

  const headerClass = isScrolled
    ? "sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b text-slate-900"
    : "absolute top-0 z-40 w-full bg-transparent text-white";

  return (
    <>
      <header className={headerClass}>
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2F462b12e4225140b88803a67447d747f3?format=webp&width=800"
              alt="Foody"
              className="w-8 h-8"
            />
            <span className="font-extrabold text-2xl tracking-tight">
              Foody
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  onSearch?.(e.target.value);
                }}
                placeholder="Search restaurants, food and drink"
                className="pl-9 rounded-full"
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Profile"
              onClick={() => nav("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
            {authed ? (
              <>
                <button
                  onClick={() => setShowManage(true)}
                  className="hidden sm:inline-block rounded-full px-3 py-1 border bg-white/5 text-white"
                  title="Manage"
                >
                  Manage
                </button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("auth_token");
                    sessionStorage.removeItem("auth_token");
                    window.location.reload();
                  }}
                >
                  {" "}
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              (() => {
                const path = location.pathname || "";
                const showHeaderAuth =
                  !path.startsWith("/auth") && !path.startsWith("/register");
                return showHeaderAuth ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => nav("/auth")}
                      className={`hidden sm:inline-block rounded-full px-4 py-1 border ${isScrolled ? "bg-white text-slate-900" : "bg-white/10 text-white"}`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => nav("/register")}
                      className={`rounded-full px-4 py-1 ${isScrolled ? "bg-firebrick text-white" : "bg-white text-slate-900"}`}
                    >
                      Sign Up
                    </button>
                  </div>
                ) : null;
              })()
            )}
            <Button onClick={onOpenCart} className="relative rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {showManage && <ManageRestaurants onClose={() => setShowManage(false)} />}
    </>
  );
}

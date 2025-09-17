import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/services/api/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
  });
  const mut = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const authed = !!(
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );

  // hydrate form when data arrives
  const name = form.name || data?.name || "";
  const email = form.email || data?.email || "";
  const phone = form.phone || (data as any)?.phone || "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onOpenCart={() => {}} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 grid md:grid-cols-[280px,1fr] gap-8">
          <aside className="hidden md:block rounded-2xl bg-white shadow-sm p-5 space-y-4">
            <div className="font-extrabold text-lg">Account</div>
            <div className="text-sm text-muted-foreground">
              Delivery Address
            </div>
            <div className="text-sm text-muted-foreground">My Orders</div>
            <button
              className="text-sm text-red-600"
              onClick={() => {
                localStorage.removeItem("auth_token");
                sessionStorage.removeItem("auth_token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </aside>

          <section className="rounded-2xl bg-white shadow-sm p-5">
            <div className="text-2xl font-extrabold mb-4">Profile</div>

            {!authed && (
              <div className="text-sm text-muted-foreground">
                Please login to view your profile.
              </div>
            )}

            {authed && isLoading && (
              <div className="h-28 bg-muted/30 animate-pulse rounded-xl" />
            )}

            {authed && isError && (
              <div className="text-sm text-red-600">
                {(error as any)?.response?.data?.message ||
                  "Failed to load profile"}
              </div>
            )}

            {authed && data && (
              <form
                className="grid gap-4 max-w-lg"
                onSubmit={(e) => {
                  e.preventDefault();
                  mut.mutate({ name, email, phone });
                }}
              >
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Nomor Handphone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, phone: e.target.value }))
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-full"
                  disabled={mut.isPending}
                >
                  {mut.isPending ? "Saving..." : "Update Profile"}
                </Button>
              </form>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

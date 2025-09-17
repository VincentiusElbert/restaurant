import * as React from "react";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { localAxios } from "@/services/api/axios";
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "@/services/api/restaurants";

export default function ManageRestaurants({
  onClose,
}: {
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["dummy-restaurants"],
    queryFn: async () => {
      const { data } = await localAxios.get("/dummy/restaurants");
      return data?.data ?? data ?? [];
    },
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", city: "", rating: 0 });

  const createMut = useMutation({
    mutationFn: (payload: any) => createRestaurant(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dummy-restaurants"] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, payload }: any) => updateRestaurant(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dummy-restaurants"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: any) => deleteRestaurant(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dummy-restaurants"] }),
  });

  React.useEffect(() => {
    if (editing)
      setForm({
        name: editing.name || "",
        city: editing.city || "",
        rating: editing.rating || 0,
      });
    else setForm({ name: "", city: "", rating: 0 });
  }, [editing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, payload: form });
        setEditing(null);
      } else {
        await createMut.mutateAsync(form);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Manage Restaurants</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-sm text-muted-foreground">
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold mb-2">List</div>
            <div className="space-y-2 max-h-[420px] overflow-auto">
              {isLoading && <div>Loading...</div>}
              {(!restaurants || restaurants.length === 0) && (
                <div className="text-sm text-muted-foreground">
                  No restaurants
                </div>
              )}
              {restaurants.map((r: any) => (
                <div
                  key={r.id}
                  className="bg-muted p-3 rounded flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {r.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(r)}
                      className="text-sm px-2 py-1 rounded border"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this restaurant?"))
                          deleteMut.mutate(r.id);
                      }}
                      className="text-sm px-2 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">
              {editing ? "Edit" : "Create"} Restaurant
            </div>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">City</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded border p-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Rating</label>
                <input
                  value={String(form.rating)}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full rounded border p-2"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  className="rounded bg-red-600 text-white px-4 py-2"
                >
                  {editing ? "Save" : "Create"}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded border px-4 py-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

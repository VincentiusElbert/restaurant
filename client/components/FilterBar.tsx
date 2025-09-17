import { useAppDispatch, useAppSelector } from "@/store";
import { setCategory, setSort } from "@/features/filters/filterSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const categories = [
  { key: "all", label: "All" },
  { key: "main", label: "Main" },
  { key: "dessert", label: "Dessert" },
  { key: "beverage", label: "Beverage" },
];

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const { category, sort } = useAppSelector((s) => s.filters);
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {categories.map((c) => (
        <Button
          key={c.key}
          size="sm"
          variant={category === c.key || (c.key === "all" && !category) ? "default" : "secondary"}
          className="rounded-full"
          onClick={() => dispatch(setCategory(c.key === "all" ? null : c.key))}
        >
          {c.label}
        </Button>
      ))}
      <div className="ml-auto" />
      <Select value={sort ?? undefined} onValueChange={(v) => dispatch(setSort(v as any))}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="price_asc">Harga: Rendah-tinggi</SelectItem>
          <SelectItem value="price_desc">Harga: Tinggi-rendah</SelectItem>
          <SelectItem value="name">Nama</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

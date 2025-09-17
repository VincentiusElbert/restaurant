import { Star } from "lucide-react";
import type { Restaurant } from "@/types";

export default function RestaurantCard({
  data,
  onClick,
}: {
  data: Restaurant;
  onClick?: () => void;
}) {
  const image = data.images?.[0];
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl shadow-sm hover:shadow-md transition flex gap-3 p-3 w-full"
    >
      <img
        src={image || "/placeholder.svg"}
        alt={`${data.name}`}
        className="h-20 w-20 rounded-lg object-cover"
      />
      <div className="flex-1">
        <div className="font-semibold">{data.name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-yellow-500" /> {data.rating ?? "-"}
          <span className="mx-1">•</span>
          <span>{data.city || "-"}</span>
        </div>
      </div>
    </button>
  );
}

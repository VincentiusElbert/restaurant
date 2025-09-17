import * as React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api/axios";

type Props = {
  restaurantId: string | number;
  onClose: () => void;
};

export default function ReviewModal({ restaurantId, onClose }: Props) {
  const [rating, setRating] = useState<number>(4);
  const [comment, setComment] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: {
      restaurantId: string | number;
      rating: number;
      comment: string;
    }) => {
      const res = await api.post(`/review`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["restaurant", String(restaurantId)]);
      onClose();
      alert("Thank you for your review!");
    },
    onError: (err: any) => {
      console.error(err);
      alert("Failed to submit review. Please try again later.");
    },
  });

  const submit = () => {
    if (!rating || rating < 1) {
      alert("Please select a rating");
      return;
    }
    mutation.mutate({ restaurantId, rating, comment });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Give Review</h3>
          <button
            onClick={onClose}
            aria-label="close"
            className="text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="text-center mb-4">
          <div className="font-semibold">Give Rating</div>
          <div className="flex items-center justify-center gap-2 mt-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const idx = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setRating(idx)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${idx <= rating ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please share your thoughts about our service!"
          className="w-full h-40 p-3 border rounded-md text-sm mb-4 resize-none"
        />

        <div className="flex items-center justify-center">
          <button
            onClick={submit}
            disabled={mutation.isLoading}
            className="w-full rounded-full bg-red-600 text-white py-3 font-semibold disabled:opacity-60"
          >
            {mutation.isLoading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

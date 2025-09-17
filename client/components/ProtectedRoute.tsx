import * as React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store";

type Props = { children: JSX.Element };

export default function ProtectedRoute({ children }: Props) {
  const token = useAppSelector((s) => s.auth?.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

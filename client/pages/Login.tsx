import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setAuth } from "@/features/auth/authSlice";
import { login } from "@/services/api/auth";

type Form = { email: string; password: string; remember?: boolean };

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<Form>();
  const { errors, isSubmitting } = formState as any;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (values: Form) => {
    try {
      const data = await login(values.email, values.password);
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;
      if (token) {
        if (user) dispatch(setAuth({ token, user }));
        localStorage.setItem("auth_token", token);
        navigate("/");
        return;
      }
      alert("Login failed: Invalid credentials or unexpected response");
    } catch (err: any) {
      console.warn(err?.response ?? err?.message ?? err);
      alert("Login failed: server not reachable or invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-6xl w-full flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden relative min-h-[640px]">
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src={
              "https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2F1a9d63ce5b964b9ebc9487ea6ed3b1dc?format=webp&width=1200"
            }
            alt="hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="py-12 px-8 bg-white relative z-30 flex items-center md:w-[480px] md:flex-shrink-0">
          <div className="max-w-md mx-auto w-full sm:w-[420px] flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F54858901b0c442e6a38e6cc906052164%2Fbea3fb0257464385828d43cc8deb72cf?format=webp&width=120"
                alt="Foody logo"
                className="w-8 h-8"
              />
              <div className="text-2xl font-extrabold">Foody</div>
            </div>
            <h2 className="text-3xl font-extrabold mb-1">Welcome Back</h2>
            <p className="text-sm text-slate-600 mb-6">
              Good to see you again! Let’s eat
            </p>

            <div className="mb-6">
              <div className="relative bg-slate-100 rounded-full p-1 w-full max-w-[320px]">
                <div className="flex">
                  <button className="flex-1 rounded-full bg-white shadow-sm py-2 text-sm font-medium">
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="flex-1 rounded-full py-2 text-sm text-slate-700"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full rounded-lg border p-3 border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {errors?.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("password")}
                  placeholder="Password"
                  type="password"
                  className="w-full rounded-lg border p-3 border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {errors?.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  {...register("remember")}
                />
                <label htmlFor="remember">Remember Me</label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-red-600 text-white py-3 font-semibold disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in…" : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

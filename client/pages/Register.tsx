import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setAuth } from "@/features/auth/authSlice";
import { register as registerApi } from "@/services/api/auth";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(6, "Enter a valid phone number")
      .regex(/^[0-9()+\-\s]*$/, "Phone contains invalid characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (values: RegisterForm) => {
    try {
      // Try to call backend register endpoint; if missing, fallback to localStorage
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      };

      try {
        const res = await registerApi(
          payload.name,
          payload.email,
          payload.password,
        );
        if (res?.data && (res.data.success || res.success)) {
          const token = res.data?.data?.token || res?.data?.token || res?.token;
          const user = res.data?.data?.user || res?.data?.user || res?.user;
          if (token && user) {
            dispatch(setAuth({ token, user }));
            alert("Registration successful");
            navigate("/");
            return;
          }
          if (token) localStorage.setItem("auth_token", token);
          if (user) localStorage.setItem("auth_user", JSON.stringify(user));
          alert("Registration successful");
          navigate("/");
          return;
        }
        // If server returned an unexpected success shape, fallback to notify
        if (res && (res.token || res?.data?.token)) {
          const token = res.token || res?.data?.token;
          localStorage.setItem("auth_token", token);
          alert("Registration successful");
          navigate("/");
          return;
        }
        alert("Registration completed but unexpected server response.");
        navigate("/");
        return;
      } catch (err: any) {
        // If network or server error, fallback to local storage mock
        console.warn(
          "Register API failed:",
          err?.response ?? err?.message ?? err,
        );
        const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
        users.push({ id: Date.now(), ...payload });
        localStorage.setItem("mock_users", JSON.stringify(users));
        alert(
          "Registration saved locally (server not reachable). You can now sign in.",
        );
        navigate("/");
        return;
      }
    } catch (e) {
      console.error(e);
      alert("Registration failed. Try again.");
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
            alt="Delicious burger"
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
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-1 rounded-full py-2 text-sm text-slate-700"
                  >
                    Sign in
                  </button>
                  <button className="flex-1 rounded-full bg-white shadow-sm py-2 text-sm font-medium">
                    Sign up
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register("name")}
                  placeholder="Name"
                  aria-invalid={errors.name ? "true" : "false"}
                  className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    errors.name ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  aria-invalid={errors.email ? "true" : "false"}
                  className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    errors.email ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("phone")}
                  placeholder="Number Phone"
                  aria-invalid={errors.phone ? "true" : "false"}
                  className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    errors.phone ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("password")}
                  placeholder="Password"
                  type="password"
                  aria-invalid={errors.password ? "true" : "false"}
                  className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    errors.password ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("confirmPassword")}
                  placeholder="Confirm Password"
                  type="password"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-slate-200"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-red-600 text-white py-3 font-semibold disabled:opacity-60"
                >
                  {isSubmitting ? "Registering…" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight gradient-text">Welcome back</h1>
          <p className="mt-2 text-sm text-[#8A8F98]">Sign in to continue to NestMate</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@college.edu" error={errors.email?.message}
            {...register("email", { required: "Email is required" })} />
          <div className="relative">
            <Input label="Password" type={showPw ? "text" : "password"} placeholder="Enter your password" error={errors.password?.message}
              {...register("password", { required: "Password is required" })} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-[38px] text-[#8A8F98] hover:text-[#EDEDEF] transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button type="submit" className="w-full" loading={loading}><LogIn className="h-4 w-4" /> Sign In</Button>
        </form>
        <p className="mt-6 text-center text-sm text-[#8A8F98]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#5E6AD2] hover:text-[#6872D9] transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

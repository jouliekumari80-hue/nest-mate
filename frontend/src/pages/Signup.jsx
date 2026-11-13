import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      toast.success("Account created!");
      navigate("/listings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to sign up");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center px-4 py-12">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight gradient-text">Create your account</h1>
          <p className="mt-2 text-sm text-[#8A8F98]">Join NestMate and find your perfect roommate</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" error={errors.name?.message}
            {...register("name", { required: "Name is required" })} />
          <Input label="Email" type="email" placeholder="you@college.edu" error={errors.email?.message}
            {...register("email", { required: "Email is required" })} />
          <div className="relative">
            <Input label="Password" type={showPw ? "text" : "password"} placeholder="Create a password" error={errors.password?.message}
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-[38px] text-[#8A8F98] hover:text-[#EDEDEF] transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button type="submit" className="w-full" loading={loading}><UserPlus className="h-4 w-4" /> Create Account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-[#8A8F98]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#5E6AD2] hover:text-[#6872D9] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

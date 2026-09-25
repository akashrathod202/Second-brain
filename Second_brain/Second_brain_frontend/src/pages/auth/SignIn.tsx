import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import GoogleLoginButton from "../../Components/Home/GoogleLoginButton"
import { SubmitButton } from "../../Components/Home/SubmitButton";
import { signin,getuser } from "../../services/authService";
import{useAuth} from "../../context/useAuth"

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const {setUser} =useAuth()

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await signin(formData);

      localStorage.setItem("token", response.token)

        const userResponse = await getuser();

  setUser(userResponse.user);



      console.log("Sign in successful:", response);

      navigate("/home");
    } catch (error: unknown) {
      console.error("Sign in failed:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setError(
          axiosError.response?.data?.message ||
            "Invalid email or password."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            🧠 Second Brain
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Welcome back
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141416] border border-gray-800 rounded-xl p-6">

          {/* Title */}
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Sign in
            </h2>

            <p className="text-gray-500 text-xs mt-1">
              Continue to your second brain.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5"
            >
              <p className="text-xs text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                disabled={loading}
                className="
                  w-full px-3 py-2.5 rounded-lg
                  bg-[#0B0B0D]
                  border border-gray-800
                  text-white text-sm
                  placeholder:text-gray-600
                  outline-none
                  transition
                  focus:border-amber-500
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-400 mb-1.5"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={loading}
                className="
                  w-full px-3 py-2.5 rounded-lg
                  bg-[#0B0B0D]
                  border border-gray-800
                  text-white text-sm
                  placeholder:text-gray-600
                  outline-none
                  transition
                  focus:border-amber-500
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                disabled={loading}
                className="
                  text-xs text-amber-500
                  hover:text-amber-400
                  transition
                  disabled:opacity-50
                "
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <SubmitButton
  title="Sign in"
  loading={loading}
/>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-800 flex-1" />

            <span className="text-xs text-gray-600">
              OR
            </span>

            <div className="h-px bg-gray-800 flex-1" />
          </div>

          {/* Google */}
       
           
          <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      console.log("GOOGLE RESPONSE:", credentialResponse);

      const response = await fetch(
        "http://localhost:8000/api/v1/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        }
      );

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);

      console.log("Google login successful");

      // Navigate to dashboard
      // navigate("/dashboard");

    } catch (error) {
      console.error("Google login failed:", error);
    }
  }}
  onError={() => {
    console.log("Google Login Failed");
  }}
/>
       
         

          {/* Sign Up */}
          <p className="text-center text-gray-500 text-xs mt-5">
            Don't have an account?{" "}

            <Link
              to="/signup"
              className="
                text-amber-500
                hover:text-amber-400
                transition
              "
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
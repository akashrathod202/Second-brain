
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { SubmitButton } from "../../Components/Home/SubmitButton";
import {
  signin,
  googleSignin,
  getuser,
} from "../../services/authService";
import { useAuth } from "../../context/useAuth";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

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

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email.";
    }

    if (!password) {
      return "Password is required.";
    }

    return "";
  };

  const loadUser = async () => {
    const userResponse = await getuser();

    console.log("USER RESPONSE:", userResponse);

    if (!userResponse?.user) {
      throw new Error("Unable to get logged-in user.");
    }

    setUser(userResponse.user);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await signin({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("SIGN IN RESPONSE:", response);

      if (!response?.token) {
        throw new Error("No authentication token received.");
      }

      localStorage.setItem("token", response.token);

      await loadUser();

      console.log("Sign in successful");
      navigate("/home");
    } catch (error: any) {
      console.error("Sign in failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password.";

      setError(message);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      console.log("GOOGLE RESPONSE:", credentialResponse);

      const googleCredential = credentialResponse.credential;

      if (!googleCredential) {
        throw new Error("Google did not return a credential.");
      }

      const response = await googleSignin(googleCredential);

      console.log("GOOGLE BACKEND RESPONSE:", response);

      if (!response?.token) {
        throw new Error(
          "Google login succeeded, but no authentication token was received."
        );
      }

      localStorage.setItem("token", response.token);

      console.log("JWT saved:", response.token);

      await loadUser();

      console.log("Google login successful");
      navigate("/home");
    } catch (error: any) {
      console.error("Google login failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Google login failed. Please try again.";

      setError(message);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            🧠 Second Brain
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Welcome back
          </p>
        </div>

        <div className="bg-[#141416] border border-gray-800 rounded-xl p-6">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5"
            >
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
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
                disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0B0B0D] border border-gray-800 text-white text-sm placeholder:text-gray-600 outline-none transition focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

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
                disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0B0B0D] border border-gray-800 text-white text-sm placeholder:text-gray-600 outline-none transition focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                disabled={loading}
                className="text-xs text-amber-500 hover:text-amber-400 transition disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>

            <SubmitButton title="Sign in" loading={loading} />
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-gray-800 flex-1" />

            <span className="text-xs text-gray-600">OR</span>

            <div className="h-px bg-gray-800 flex-1" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.error("Google Login Failed");
                setError("Google login failed. Please try again.");
              }}
            />
          </div>

          <p className="text-center text-gray-500 text-xs mt-5">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-amber-500 hover:text-amber-400 transition"
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

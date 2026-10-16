 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import GoogleLoginButton from "../../Components/Home/GoogleLoginButton";
import { useAuth } from "../../context/useAuth";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error when user starts typing
    if (error) {
      setError("");
    }
  };

  // Validate form before API call
  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    // Name validation
    if (!name) {
      return "Name is required.";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters.";
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      return "Name can contain only letters and spaces.";
    }

    // Email validation
    if (!email) {
      return "Email is required.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Please enter a valid email.";
    }

    // Password validation
    if (!password) {
      return "Password is required.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return "";
  };

  // Handle signup
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Prevent multiple requests
    if (loading) return;

    // Clear previous error
    setError("");

    // Validate form
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Send form data to backend
      const response = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Save token
      localStorage.setItem("token", response.token);

      console.log("SIGNUP RESPONSE:", response);

      // Save user
      setUser(response.user);

      console.log("USER SET:", response.user);
      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
      );

      // Go to home
      navigate("/home");
    } catch (error: unknown) {
      console.error("Signup failed:", error);

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
            "Something went wrong. Please try again."
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
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Create your account
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Start building your second brain today
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 shadow-xl">

          {/* Google Login */}
          <GoogleLoginButton mode="signup" />

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/10 flex-1" />

            <span className="text-xs text-gray-500">
              OR
            </span>

            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Signup Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-gray-300 mb-1.5"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
                disabled={loading}
                className="
                  w-full h-11 px-3 rounded-lg
                  bg-[#0B0B0D]
                  border border-white/10
                  text-white
                  placeholder:text-gray-600
                  outline-none
                  focus:border-amber-400
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-300 mb-1.5"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
                className="
                  w-full h-11 px-3 rounded-lg
                  bg-[#0B0B0D]
                  border border-white/10
                  text-white
                  placeholder:text-gray-600
                  outline-none
                  focus:border-amber-400
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-300 mb-1.5"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                required
                disabled={loading}
                className="
                  w-full h-11 px-3 rounded-lg
                  bg-[#0B0B0D]
                  border border-white/10
                  text-white
                  placeholder:text-gray-600
                  outline-none
                  focus:border-amber-400
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="
                  text-sm text-red-400
                  bg-red-400/10
                  border border-red-400/20
                  rounded-lg p-3
                "
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-11 rounded-lg
                bg-amber-400
                text-black
                font-medium
                hover:bg-amber-300
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* Sign in */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}

            <Link
              to="/signin"
              className="text-amber-400 hover:text-amber-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-5">
          By creating an account, you agree to our Terms &
          Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
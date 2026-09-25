
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa6";
import { signup } from "../../services/authService"
import GoogleLoginButton from "../../Components/Home/GoogleLoginButton"
import  {useAuth} from "../../context/useAuth"

const SignUp = () => {
  const navigate = useNavigate();
  const {setUser} =useAuth()


  // Stores the values entered by the user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Tracks API request status
  const [loading, setLoading] = useState(false);

  // Stores error message
  const [error, setError] = useState("");

  // Runs whenever the user types in an input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Runs when the user submits the signup form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remove previous error
    setError("");

    // Start loading
    setLoading(true);

    try {
      // Send form data to backend
     const response= await signup(formData);

      localStorage.setItem("token",response.token)

      console.log("SIGNUP RESPONSE:", response);

      setUser(response.token)
      console.log("USER SET:", response.user);
      console.log("TOKEN SAVED:", localStorage.getItem("token"));

      

      // Signup successful → go to signin page
      navigate("/home");
    } catch (error: any) {
      console.error("Signup failed:", error);

      // Show backend error if available
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      // Stop loading whether request succeeds or fails
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-x text-black font-bold text-xl mb-4">
            
          </div>

          <h1 className="text-2xl font-semibold text-white">
            Create your account
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Start building your second brain today
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 shadow-xl">

          {/* Google */}
 
          
            <FaGoogle className="text-sm" />
            <GoogleLoginButton />
       

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full h-11 px-3 rounded-lg bg-[#0B0B0D] border border-white/10 text-white placeholder:text-gray-600 outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full h-11 px-3 rounded-lg bg-[#0B0B0D] border border-white/10 text-white placeholder:text-gray-600 outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full h-11 px-3 rounded-lg bg-[#0B0B0D] border border-white/10 text-white placeholder:text-gray-600 outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-amber-400 text-black font-medium hover:bg-amber-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
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
          By creating an account, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SignUp;

import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const credential = credentialResponse.credential;

      if (!credential) {
        console.error("Google credential was not received");
        return;
      }

      console.log("Google credential received");

      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.error("VITE_API_URL is not defined");
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/v1/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            credential,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Google login failed"
        );
      }

      console.log("Google login successful");
      console.log("User:", data.user);

      // Save your application's JWT
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Update global auth state
      setUser(data.user);

      // Go to application
      navigate("/home");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

export default GoogleLoginButton;
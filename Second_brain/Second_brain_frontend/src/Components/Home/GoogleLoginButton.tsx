
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

type Props = {
  mode: "signin" | "signup";
  onErrorMessage?: (message: string) => void;
};

const GoogleLoginButton = ({ mode, onErrorMessage }: Props) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");

  const showError = (message: string) => {
    setError(message);
    onErrorMessage?.(message);
  };

  const handleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setError("");
    onErrorMessage?.("");

    try {
      const credential = credentialResponse.credential;

      if (!credential) {
        throw new Error("Google credential was not received.");
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const endpoint =
        mode === "signup"
          ? "/api/v1/auth/google/signup"
          : "/api/v1/auth/google";

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Google authentication failed."
        );
      }

      if (!data.token || !data.user) {
        throw new Error("Authentication response is incomplete.");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/home");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Google authentication failed. Please try again.";

      showError(message);
      console.error("Google authentication failed:", message);
    }
  };

  const handleError = () => {
    showError("Google login failed. Please try again.");
  };

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text={mode === "signup" ? "continue_with" : "signin_with"}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-400 text-center"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;

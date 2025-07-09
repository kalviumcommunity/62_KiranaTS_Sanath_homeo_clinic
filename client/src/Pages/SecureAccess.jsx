import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SecureAccess() {
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (code === "SECRET2025") {
        setVerified(true);
        setError("");
      } else {
        setError("Invalid access code.");
      }
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleVerify();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-200">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 text-4xl">🔒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Staff Access</h2>
          <p className="text-gray-500">
            {verified ? "Select your role" : "Enter access code to continue"}
          </p>
        </div>

        {!verified ? (
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">⚠️ {error}</p>
              )}
            </div>
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate("/doctors/login")}
              className="w-full py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
               Doctor Login
            </button>
            <button
              onClick={() => navigate("/receptionists/login")}
              className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              Receptionist Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
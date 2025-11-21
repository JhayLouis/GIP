import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "../assets/SantaRosa.png";
import Arch from "../assets/SantaRosaArch.png";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "", general: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { username: "", password: "", general: "" };
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({ username: "", password: "", general: "" });
    const success = await onLogin(formData.username, formData.password);
    if (!success) setErrors((prev) => ({ ...prev, general: "Invalid username or password" }));
    setIsLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${Arch})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-orange-700/80 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-10 backdrop-blur-md">

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-white shadow-md rounded-full mx-auto flex items-center justify-center mb-4">
              <img src={Logo} className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-2xl font-bold">SOFT PROJECTS</h1>
            <p className="text-gray-700 text-sm">Application Management System</p>
            <p className="text-gray-500 text-xs">City Government of Santa Rosa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">{errors.general}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 !bg-white !text-gray-900 !border-gray-300 dark:!bg-white dark:!text-gray-900 dark:!border-gray-300"
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 !bg-white !text-gray-900 !border-gray-300 dark:!bg-white dark:!text-gray-900 dark:!border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">© 2025 City Government of Santa Rosa</p>
            <p className="text-xs text-gray-500">Office of the City Mayor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

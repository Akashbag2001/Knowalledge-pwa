import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useHttp from "../api/useHttp";

export default function SuperAdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { sendRequest, loading } = useHttp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await sendRequest(
                "/superAdmin/signin",
                "POST",
                { email, password }
            );

            if (data) {
                // ✅ Save user with role superadmin in context
                console.log("SuperAdmin login response:", data);
                login({
                    email: data.email || email,
                    role: "superadmin",
                    token: data.token,
                });
                navigate("/admin"); // redirect to admin dashboard
            }
        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
            {/* Aceternity UI Background Grid */}
            <div className="absolute inset-0 [background-size:50px_50px]" />

            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-100/20 dark:bg-amber-900/20 rounded-full blur-3xl" />
                <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-orange-100/20 dark:bg-orange-900/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-yellow-100/20 dark:bg-yellow-900/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Admin Crown Icon */}
                {/* <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-amber-600 dark:bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                            </svg>
                        </div>
                        <div className="absolute -inset-2 bg-amber-500/20 dark:bg-amber-400/20 rounded-2xl blur-xl -z-10" />

                        {/* Crown decoration */}
                        {/* <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <svg className="w-8 h-6 text-amber-500 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9l-5 4.87L18.18 21L12 17.27L5.82 21L7 13.87L2 9l6.91-.74L12 2z" />
                            </svg>
                        </div> */}
                    {/* </div> */}
                {/* </div>  */}

                {/* Login Card */}
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-neutral-900 dark:text-neutral-100 mb-2">
                            SuperAdmin Portal
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                            Access the control center with elevated privileges
                        </p>
                        <div className="w-20 h-0.5 bg-amber-500 dark:bg-amber-400 mx-auto mt-4 rounded-full" />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="group">
                            <label className=" text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                Administrator Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                                    placeholder="admin@knowledge.com"
                                    required
                                />
                                <div className="absolute inset-0 rounded-xl bg-amber-500/5 dark:bg-amber-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <label className=" text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Master Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 pr-12 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                                    placeholder="Enter secure password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                                <div className="absolute inset-0 rounded-xl bg-amber-500/5 dark:bg-amber-400/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group cursor-pointer relative w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Access Admin Panel</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 bg-amber-500 dark:bg-amber-400 rounded-full flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                    Secure Access
                                </h4>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    This portal provides administrative access to the Knowledge platform. All activities are logged and monitored for security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="text-neutral-500 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 text-sm transition-colors flex items-center gap-1 mx-auto group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Knowledge Platform
                    </button>
                </div>
            </div>

            {/* Custom Styles for Grid Background */}
            <style>{`
                .bg-grid-neutral-200\\/30 {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(212 212 212 / 0.3)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
                }
                .dark .bg-grid-neutral-800\\/30 {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(38 38 38 / 0.3)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
                }
            `}</style>
        </div>
    );
}
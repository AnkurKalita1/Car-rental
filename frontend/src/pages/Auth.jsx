import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "renter"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const nextMode =
      searchParams.get("mode") === "register" ? "register" : "login";
    setMode(nextMode);
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate(location.state?.from || "/cars", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.message?.includes("Network")
          ? "Backend not reachable. Check server is running."
          : "Authentication failed.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] w-full">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-glossy">
          <h2 className="text-center text-lg font-semibold text-brand-blue">
            {mode === "login" ? "User Login" : "User Sign Up"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs text-slate-500">Name</label>
                <input
                  type="text"
                  placeholder="type here"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-500">Email</label>
              <input
                type="email"
                placeholder="type here"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Password</label>
              <input
                type="password"
                placeholder="type here"
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-silky disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            {mode === "login"
              ? "Create an account? "
              : "Already have account? "}
            <button
              type="button"
              onClick={() =>
                setMode((prev) => (prev === "login" ? "register" : "login"))
              }
              className="font-semibold text-blue-500"
            >
              click here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

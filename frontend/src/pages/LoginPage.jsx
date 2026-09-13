import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { roleLabels } from "../utils/labels";

export default function LoginPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    userApi
      .getAll()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (user) => {
    login(user);
    navigate(user.role === "CTO" ? "/dashboard" : "/projects");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-semibold text-slate-800">CTO Takip Sistemi</h1>
        <p className="text-sm text-slate-500 mt-1">
          Devam etmek icin bir kullanici secin
        </p>

        {loading && (
          <p className="text-sm text-slate-500 mt-6">Kullanicilar yukleniyor...</p>
        )}

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6 space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className="w-full text-left px-4 py-3 border border-slate-200 rounded hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <p className="text-sm font-medium text-slate-800">{user.fullName}</p>
                <p className="text-xs text-slate-500">
                  {roleLabels[user.role]} · {user.email}
                </p>
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-6">
          Not: Bu MVP surumunde sifre dogrulama yerine rol secimi kullanilmaktadir.
          Token bazli kimlik dogrulama genisletme kapsamindadir.
        </p>
      </div>
    </div>
  );
}
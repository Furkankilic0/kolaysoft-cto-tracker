import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, FileText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleLabels } from "../utils/labels";

export default function Layout({ children }) {
  const { currentUser, logout, isCto } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "CTO Dashboard", icon: LayoutDashboard, show: isCto },
    { path: "/projects", label: "Projeler", icon: FolderKanban, show: true },
    { path: "/reports", label: "Haftalik Raporlar", icon: FileText, show: true },
  ].filter((item) => item.show);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">CTO Takip Sistemi</h1>
            <p className="text-xs text-slate-500">Haftalik Proje Durum Raporlama</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-800">{currentUser?.fullName}</p>
              <p className="text-xs text-slate-500">{roleLabels[currentUser?.role]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
              title="Cikis yap"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-6 flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 transition ${
                  active
                    ? "border-blue-600 text-blue-600 font-medium"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
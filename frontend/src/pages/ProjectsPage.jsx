import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { projectApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/Badge";
import {
  projectStatusLabels,
  projectStatusColors,
  formatDate,
} from "../utils/labels";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { currentUser, isPm } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, [currentUser]);

  const loadProjects = () => {
    setLoading(true);
    setError(null);

    const request = isPm
      ? projectApi.getByManager(currentUser.id)
      : projectApi.getAll();

    request
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.customer?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Projeler</h2>
          <p className="text-sm text-slate-500">
            {isPm ? "Sorumlu oldugunuz projeler" : "Tum projeler"}
          </p>
        </div>

        <button
          onClick={() => navigate("/projects/new")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <Plus size={16} />
          Yeni Proje
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Proje adi, musteri veya kod ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Tum durumlar</option>
          {Object.entries(projectStatusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-sm">
          Projeler yukleniyor...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-sm text-slate-500">
            {projects.length === 0
              ? "Henuz proje bulunmuyor."
              : "Filtrelere uygun proje bulunamadi."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Proje</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Musteri</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Yonetici</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Durum</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Hedef Bitis</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{project.name}</p>
                      <p className="text-xs text-slate-500">{project.code}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{project.customer || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{project.managerFullName}</td>
                    <td className="px-4 py-3">
                      <Badge
                        text={projectStatusLabels[project.status]}
                        colorClass={projectStatusColors[project.status]}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(project.targetEndDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
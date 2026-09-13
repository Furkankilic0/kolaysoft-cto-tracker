import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Activity,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  FileWarning,
} from "lucide-react";
import { dashboardApi, userApi } from "../api/services";
import Badge from "../components/Badge";
import {
  projectStatusLabels,
  projectStatusColors,
  riskLabels,
  riskColors,
  scheduleLabels,
  scheduleColors,
  reportStatusLabels,
  reportStatusColors,
  formatDate,
} from "../utils/labels";

function StatCard({ icon: Icon, label, value, sub, tone = "slate" }) {
  const tones = {
    slate: "text-slate-700 bg-slate-100",
    blue: "text-blue-700 bg-blue-100",
    orange: "text-orange-700 bg-orange-100",
    red: "text-red-700 bg-red-100",
    green: "text-green-700 bg-green-100",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2 rounded ${tones[tone]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    risk: "",
    managerId: "",
    year: "",
    weekNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    userApi
      .getByRole("PROJECT_MANAGER")
      .then((res) => setManagers(res.data))
      .catch(() => setManagers([]));
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [filters]);

  const loadDashboard = () => {
    setLoading(true);
    setError(null);

    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") params[key] = value;
    });

    dashboardApi
      .get(params)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({ status: "", risk: "", managerId: "", year: "", weekNumber: "" });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">CTO Dashboard</h2>
        <p className="text-sm text-slate-500">
          Tum proje portfoyunun guncel durumu
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Proje Durumu</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilter("status", e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Tumu</option>
              {Object.entries(projectStatusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Risk Seviyesi</label>
            <select
              value={filters.risk}
              onChange={(e) => handleFilter("risk", e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Tumu</option>
              {Object.entries(riskLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Proje Yoneticisi</label>
            <select
              value={filters.managerId}
              onChange={(e) => handleFilter("managerId", e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Tumu</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>{m.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Yil</label>
            <input
              type="number"
              placeholder="2026"
              value={filters.year}
              onChange={(e) => handleFilter("year", e.target.value)}
              className="w-24 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Hafta</label>
            <input
              type="number"
              placeholder="37"
              value={filters.weekNumber}
              onChange={(e) => handleFilter("weekNumber", e.target.value)}
              className="w-20 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded hover:bg-slate-50"
          >
            Temizle
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Yil ve hafta bos birakilirsa her proje icin en son rapor gosterilir.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-sm">
          Portfoy yukleniyor...
        </div>
      )}

      {!loading && data && (
        <>
          {/* Sayaclar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <StatCard
              icon={FolderKanban}
              label="Toplam Proje"
              value={data.totalProjects}
              tone="slate"
            />
            <StatCard
              icon={Activity}
              label="Aktif Proje"
              value={data.activeProjects}
              sub="devam eden + testte"
              tone="blue"
            />
            <StatCard
              icon={Clock}
              label="Geciken Proje"
              value={data.delayedProjects}
              tone="orange"
            />
            <StatCard
              icon={AlertTriangle}
              label="Riskli / Bloke"
              value={data.atRiskProjects}
              tone="red"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <StatCard
              icon={AlertTriangle}
              label="Yuksek Riskli Rapor"
              value={data.highRiskReports}
              tone="red"
            />
            <StatCard
              icon={FileWarning}
              label="Inceleme Bekleyen"
              value={data.pendingReviewReports}
              tone="blue"
            />
            <StatCard
              icon={data.averageProgressGap < 0 ? TrendingDown : TrendingUp}
              label="Ortalama Ilerleme"
              value={`%${data.averageActualProgress.toFixed(0)}`}
              sub={`sapma ${data.averageProgressGap > 0 ? "+" : ""}${data.averageProgressGap.toFixed(1)} puan`}
              tone={data.averageProgressGap < 0 ? "orange" : "green"}
            />
            <StatCard
              icon={FileWarning}
              label="Raporu Olmayan"
              value={data.projectsWithoutReport}
              tone="slate"
            />
          </div>

          {/* Portfoy tablosu */}
          {data.projects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-sm text-slate-500">
              Filtrelere uygun proje bulunamadi.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Proje</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Yonetici</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Hafta</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Ilerleme</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Task</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Takvim</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Risk</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.projects.map((p) => (
                      <tr
                        key={p.projectId}
                        onClick={() =>
                          p.lastReportId
                            ? navigate(`/reports/${p.lastReportId}`)
                            : navigate(`/projects/${p.projectId}`)
                        }
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{p.projectName}</p>
                          <p className="text-xs text-slate-500">
                            {p.customer} · {p.projectCode}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{p.managerFullName}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {p.hasReport ? (
                            <span>{p.lastReportYear} / {p.lastReportWeek}</span>
                          ) : (
                            <span className="text-xs text-red-600">Rapor yok</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.hasReport ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">%{p.actualProgress}</span>
                              <span className="text-xs text-slate-400">/ %{p.targetProgress}</span>
                              {p.progressGap != null && p.progressGap !== 0 && (
                                <span
                                  className={`flex items-center gap-0.5 text-xs font-medium ${
                                    p.progressGap < 0 ? "text-red-600" : "text-green-600"
                                  }`}
                                >
                                  {p.progressGap < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                                  {p.progressGap > 0 ? "+" : ""}{p.progressGap}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {p.hasReport ? p.activeTaskCount : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {p.hasReport ? (
                            <Badge
                              text={scheduleLabels[p.scheduleStatus]}
                              colorClass={scheduleColors[p.scheduleStatus]}
                            />
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.hasReport ? (
                            <Badge
                              text={riskLabels[p.riskLevel]}
                              colorClass={riskColors[p.riskLevel]}
                            />
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <Badge
                              text={projectStatusLabels[p.projectStatus]}
                              colorClass={projectStatusColors[p.projectStatus]}
                            />
                            {p.hasReport && (
                              <Badge
                                text={reportStatusLabels[p.reportStatus]}
                                colorClass={reportStatusColors[p.reportStatus]}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
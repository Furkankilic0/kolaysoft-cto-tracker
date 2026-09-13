import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { reportApi, projectApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/Badge";
import {
  reportStatusLabels,
  reportStatusColors,
  riskLabels,
  riskColors,
  scheduleLabels,
  scheduleColors,
} from "../utils/labels";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  const { currentUser, isPm } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = () => {
    setLoading(true);
    setError(null);

    Promise.all([reportApi.getAll(), projectApi.getAll()])
      .then(([reportRes, projectRes]) => {
        let data = reportRes.data;

        // PM ise sadece kendi raporlari
        if (isPm) {
          data = data.filter((r) => r.reportedById === currentUser.id);
        }

        // En yeni hafta ustte
        data.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.weekNumber - a.weekNumber;
        });

        setReports(data);
        setProjects(projectRes.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const filtered = reports.filter((r) => {
    const matchesProject = !projectFilter || String(r.projectId) === projectFilter;
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesRisk = !riskFilter || r.riskLevel === riskFilter;
    return matchesProject && matchesStatus && matchesRisk;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Haftalik Raporlar</h2>
          <p className="text-sm text-slate-500">
            {isPm ? "Girdiginiz raporlar" : "Tum proje raporlari"}
          </p>
        </div>

        {isPm && (
          <button
            onClick={() => navigate("/reports/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            <Plus size={16} />
            Yeni Rapor
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Tum projeler</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Tum rapor durumlari</option>
          {Object.entries(reportStatusLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Tum risk seviyeleri</option>
          {Object.entries(riskLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-sm">
          Raporlar yukleniyor...
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
            {reports.length === 0
              ? "Henuz rapor girilmemis."
              : "Filtrelere uygun rapor bulunamadi."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Hafta</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Proje</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Ilerleme</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Takvim</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Risk</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => navigate(`/reports/${report.id}`)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {report.year} / {report.weekNumber}. hafta
                      </p>
                      <p className="text-xs text-slate-500">{report.reportedByFullName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800">{report.projectName}</p>
                      <p className="text-xs text-slate-500">{report.projectCustomer}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-medium">
                          %{report.actualProgress}
                        </span>
                        <span className="text-xs text-slate-400">
                          / hedef %{report.targetProgress}
                        </span>
                        {report.progressGap != null && report.progressGap !== 0 && (
                          <span
                            className={`flex items-center gap-0.5 text-xs font-medium ${
                              report.progressGap < 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {report.progressGap < 0 ? (
                              <TrendingDown size={12} />
                            ) : (
                              <TrendingUp size={12} />
                            )}
                            {report.progressGap > 0 ? "+" : ""}
                            {report.progressGap}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        text={scheduleLabels[report.scheduleStatus]}
                        colorClass={scheduleColors[report.scheduleStatus]}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        text={riskLabels[report.riskLevel]}
                        colorClass={riskColors[report.riskLevel]}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        text={reportStatusLabels[report.status]}
                        colorClass={reportStatusColors[report.status]}
                      />
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
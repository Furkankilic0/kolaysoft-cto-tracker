import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Send } from "lucide-react";
import { reportApi, projectApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { riskLabels, scheduleLabels } from "../utils/labels";

function getCurrentWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

export default function ReportFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    projectId: "",
    reportedById: currentUser?.id || "",
    year: new Date().getFullYear(),
    weekNumber: getCurrentWeek(),
    targetProgress: 0,
    actualProgress: 0,
    activeTaskCount: 0,
    scheduleStatus: "ON_TRACK",
    riskLevel: "LOW",
    completedWork: "",
    plannedWork: "",
    blockers: "",
    generalNote: "",
  });

  useEffect(() => {
    const loadProjects = projectApi.getByManager(currentUser.id);
    const loadReport = isEdit ? reportApi.getById(id) : Promise.resolve(null);

    Promise.all([loadProjects, loadReport])
      .then(([projectRes, reportRes]) => {
        setProjects(projectRes.data);

        if (reportRes) {
          const r = reportRes.data;
          setForm({
            projectId: r.projectId,
            reportedById: r.reportedById,
            year: r.year,
            weekNumber: r.weekNumber,
            targetProgress: r.targetProgress ?? 0,
            actualProgress: r.actualProgress ?? 0,
            activeTaskCount: r.activeTaskCount ?? 0,
            scheduleStatus: r.scheduleStatus || "ON_TRACK",
            riskLevel: r.riskLevel || "LOW",
            completedWork: r.completedWork || "",
            plannedWork: r.plannedWork || "",
            blockers: r.blockers || "",
            generalNote: r.generalNote || "",
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (thenSubmit = false) => {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    const payload = {
      ...form,
      projectId: Number(form.projectId),
      reportedById: Number(form.reportedById),
      year: Number(form.year),
      weekNumber: Number(form.weekNumber),
      targetProgress: Number(form.targetProgress),
      actualProgress: Number(form.actualProgress),
      activeTaskCount: Number(form.activeTaskCount),
    };

    const request = isEdit
      ? reportApi.update(id, payload)
      : reportApi.create(payload);

    request
      .then((res) => {
        if (thenSubmit) {
          return reportApi.submit(res.data.id);
        }
        return res;
      })
      .then(() => navigate("/reports"))
      .catch((err) => {
        setError(err.message);
        setFieldErrors(err.fieldErrors || {});
      })
      .finally(() => setSaving(false));
  };

  const gap = Number(form.actualProgress) - Number(form.targetProgress);

  if (loading) {
    return <div className="text-sm text-slate-500">Yukleniyor...</div>;
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/reports")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft size={16} />
        Raporlara don
      </button>

      <h2 className="text-xl font-semibold text-slate-800 mb-1">
        {isEdit ? "Raporu Duzenle" : "Yeni Haftalik Rapor"}
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Bu hafta icin proje durumunu ve ilerlemeyi girin.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        {/* Proje ve hafta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Proje <span className="text-red-500">*</span>
            </label>
            <select
              value={form.projectId}
              onChange={(e) => handleChange("projectId", e.target.value)}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-50"
            >
              <option value="">Proje secin</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {fieldErrors.projectId && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.projectId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yil</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hafta No
            </label>
            <input
              type="number"
              min="1"
              max="53"
              value={form.weekNumber}
              onChange={(e) => handleChange("weekNumber", e.target.value)}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-50"
            />
            {fieldErrors.weekNumber && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.weekNumber}</p>
            )}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Ilerleme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hedeflenen Ilerleme (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.targetProgress}
              onChange={(e) => handleChange("targetProgress", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
            {fieldErrors.targetProgress && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.targetProgress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gerceklesen Ilerleme (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.actualProgress}
              onChange={(e) => handleChange("actualProgress", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
            {fieldErrors.actualProgress && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.actualProgress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Canli Task Sayisi
            </label>
            <input
              type="number"
              min="0"
              value={form.activeTaskCount}
              onChange={(e) => handleChange("activeTaskCount", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {gap !== 0 && (
          <div
            className={`p-3 rounded text-sm ${
              gap < 0
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            {gap < 0
              ? `Proje hedefin ${Math.abs(gap)} puan gerisinde.`
              : `Proje hedefin ${gap} puan onunde.`}
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Durum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Takvim Durumu <span className="text-red-500">*</span>
            </label>
            <select
              value={form.scheduleStatus}
              onChange={(e) => handleChange("scheduleStatus", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              {Object.entries(scheduleLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Risk Seviyesi <span className="text-red-500">*</span>
            </label>
            <select
              value={form.riskLevel}
              onChange={(e) => handleChange("riskLevel", e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            >
              {Object.entries(riskLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Metin alanlari */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bu Hafta Yapilanlar <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="3"
            value={form.completedWork}
            onChange={(e) => handleChange("completedWork", e.target.value)}
            placeholder="Tamamlanan veya ilerletilen isler..."
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {fieldErrors.completedWork && (
            <p className="text-xs text-red-600 mt-1">{fieldErrors.completedWork}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Gelecek Hafta Yapilacaklar
          </label>
          <textarea
            rows="3"
            value={form.plannedWork}
            onChange={(e) => handleChange("plannedWork", e.target.value)}
            placeholder="Bir sonraki hafta hedeflenen isler..."
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Riskler / Engeller
          </label>
          <textarea
            rows="2"
            value={form.blockers}
            onChange={(e) => handleChange("blockers", e.target.value)}
            placeholder="Gecikmeye veya kaliteye etki edebilecek konular..."
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Genel Durum Notu
          </label>
          <textarea
            rows="2"
            value={form.generalNote}
            onChange={(e) => handleChange("generalNote", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Kaydediliyor..." : "Taslak Olarak Kaydet"}
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={16} />
            Kaydet ve CTO'ya Gonder
          </button>
        </div>
      </div>
    </div>
  );
}
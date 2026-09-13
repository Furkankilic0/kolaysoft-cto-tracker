import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Send, MessageSquare } from "lucide-react";
import { reportApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/Badge";
import {
  reportStatusLabels,
  reportStatusColors,
  riskLabels,
  riskColors,
  scheduleLabels,
  scheduleColors,
  formatDate,
} from "../utils/labels";

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-1">{title}</h4>
      <div className="text-sm text-slate-600 whitespace-pre-wrap">
        {children || <span className="text-slate-400">Belirtilmemis</span>}
      </div>
    </div>
  );
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const { currentUser, isCto, isPm } = useAuth();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = () => {
    setLoading(true);
    reportApi
      .getById(id)
      .then((res) => {
        setReport(res.data);
        setComment(res.data.ctoComment || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    setBusy(true);
    setActionError(null);
    reportApi
      .submit(id)
      .then(() => loadReport())
      .catch((err) => setActionError(err.message))
      .finally(() => setBusy(false));
  };

  const handleReview = () => {
    setBusy(true);
    setActionError(null);
    reportApi
      .review(id, { ctoId: currentUser.id, comment })
      .then(() => loadReport())
      .catch((err) => setActionError(err.message))
      .finally(() => setBusy(false));
  };

  if (loading) return <div className="text-sm text-slate-500">Yukleniyor...</div>;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const isOwner = report.reportedById === currentUser.id;
  const canEdit = isPm && isOwner && report.status === "DRAFT";
  const canSubmit = isPm && isOwner && report.status === "DRAFT";
  const canReview = isCto && report.status !== "DRAFT";

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => navigate("/reports")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft size={16} />
        Raporlara don
      </button>

      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{report.projectName}</h2>
          <p className="text-sm text-slate-500">
            {report.projectCustomer} · {report.year} / {report.weekNumber}. hafta ·{" "}
            {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Raporu giren: {report.reportedByFullName}
          </p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => navigate(`/reports/${id}/edit`)}
              className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50"
            >
              <Pencil size={14} />
              Duzenle
            </button>
          )}

          {canSubmit && (
            <button
              onClick={handleSubmit}
              disabled={busy}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={14} />
              CTO'ya Gonder
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Ozet kartlari */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500">Gerceklesen</p>
          <p className="text-2xl font-semibold text-slate-800">%{report.actualProgress}</p>
          <p className="text-xs text-slate-400">hedef %{report.targetProgress}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500">Sapma</p>
          <p
            className={`text-2xl font-semibold ${
              report.progressGap < 0
                ? "text-red-600"
                : report.progressGap > 0
                ? "text-green-600"
                : "text-slate-800"
            }`}
          >
            {report.progressGap > 0 ? "+" : ""}
            {report.progressGap ?? 0}
          </p>
          <p className="text-xs text-slate-400">puan</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500">Canli Task</p>
          <p className="text-2xl font-semibold text-slate-800">{report.activeTaskCount}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-2">Durum</p>
          <div className="flex flex-wrap gap-1">
            <Badge
              text={reportStatusLabels[report.status]}
              colorClass={reportStatusColors[report.status]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="flex gap-2">
          <Badge
            text={scheduleLabels[report.scheduleStatus]}
            colorClass={scheduleColors[report.scheduleStatus]}
          />
          <Badge
            text={`Risk: ${riskLabels[report.riskLevel]}`}
            colorClass={riskColors[report.riskLevel]}
          />
        </div>

        <hr className="border-slate-100" />

        <Section title="Bu Hafta Yapilanlar">{report.completedWork}</Section>
        <Section title="Gelecek Hafta Yapilacaklar">{report.plannedWork}</Section>
        <Section title="Riskler / Engeller">{report.blockers}</Section>
        <Section title="Genel Durum Notu">{report.generalNote}</Section>
      </div>

      {/* CTO yorumu */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={16} className="text-slate-500" />
          <h3 className="text-sm font-medium text-slate-700">CTO Degerlendirmesi</h3>
        </div>

        {report.ctoComment && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded mb-3">
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.ctoComment}</p>
            <p className="text-xs text-slate-400 mt-2">
              {report.reviewedByFullName} · {formatDate(report.reviewedAt)}
            </p>
          </div>
        )}

        {!report.ctoComment && !canReview && (
          <p className="text-sm text-slate-400">Henuz degerlendirme yapilmamis.</p>
        )}

        {canReview && (
          <div className="space-y-3">
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Degerlendirme notunuzu yazin..."
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleReview}
              disabled={busy || !comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {report.ctoComment ? "Degerlendirmeyi Guncelle" : "Degerlendirmeyi Kaydet"}
            </button>
          </div>
        )}

        {isCto && report.status === "DRAFT" && (
          <p className="text-sm text-slate-400">
            Bu rapor henuz taslak durumunda, degerlendirme yapilamaz.
          </p>
        )}
      </div>
    </div>
  );
}
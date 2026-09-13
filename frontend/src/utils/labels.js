export const projectStatusLabels = {
  PLANNED: "Planlandi",
  IN_PROGRESS: "Devam Ediyor",
  IN_TESTING: "Testte",
  COMPLETED: "Tamamlandi",
  DELAYED: "Gecikti",
  AT_RISK: "Riskli",
  BLOCKED: "Bloke",
};

export const projectStatusColors = {
  PLANNED: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_TESTING: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  DELAYED: "bg-orange-100 text-orange-700",
  AT_RISK: "bg-red-100 text-red-700",
  BLOCKED: "bg-red-200 text-red-900",
};

export const riskLabels = {
  LOW: "Dusuk",
  MEDIUM: "Orta",
  HIGH: "Yuksek",
  CRITICAL: "Kritik",
};

export const riskColors = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export const scheduleLabels = {
  ON_TRACK: "Planla Uyumlu",
  AT_RISK: "Sapma Riski",
  DELAYED: "Planin Gerisinde",
};

export const scheduleColors = {
  ON_TRACK: "bg-green-100 text-green-700",
  AT_RISK: "bg-yellow-100 text-yellow-800",
  DELAYED: "bg-red-100 text-red-700",
};

export const reportStatusLabels = {
  DRAFT: "Taslak",
  SUBMITTED: "Gonderildi",
  REVIEWED: "Incelendi",
};

export const reportStatusColors = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  REVIEWED: "bg-green-100 text-green-700",
};

export const roleLabels = {
  ADMIN: "Admin",
  CTO: "CTO",
  PROJECT_MANAGER: "Proje Yoneticisi",
};

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
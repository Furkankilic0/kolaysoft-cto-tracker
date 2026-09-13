export default function Badge({ text, colorClass }) {
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colorClass || "bg-slate-100 text-slate-700"}`}>
      {text || "-"}
    </span>
  );
}
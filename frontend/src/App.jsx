import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ReportsPage from "./pages/ReportsPage";
import ReportFormPage from "./pages/ReportFormPage";

function ProtectedRoute({ children, ctoOnly = false }) {
  const { currentUser, loading, isCto } = useAuth();

  if (loading) {
    return <div className="p-6 text-slate-500">Yukleniyor...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (ctoOnly && !isCto) {
    return <Navigate to="/projects" replace />;
  }

  return <Layout>{children}</Layout>;
}

function Placeholder({ title }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">Bu ekran yakinda eklenecek.</p>
    </div>
  );
}

function AppRoutes() {
  const { currentUser, isCto } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute ctoOnly>
            <Placeholder title="CTO Dashboard" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
            <Route
        path="/reports/new"
        element={
          <ProtectedRoute>
            <ReportFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/:id/edit"
        element={
          <ProtectedRoute>
            <ReportFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={!currentUser ? "/login" : isCto ? "/dashboard" : "/projects"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
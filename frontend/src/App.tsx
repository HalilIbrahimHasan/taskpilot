import { Route, Routes } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { TasksPage } from "./pages/TasksPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<DashboardPage />} index />
        <Route element={<TasksPage />} path="tasks" />
        <Route element={<TaskDetailPage />} path="tasks/:taskId" />
      </Route>
    </Routes>
  );
}

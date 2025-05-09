"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { TaskCard } from "@/components/task-card";

export default function DashboardPage() {
  const [data, setData] = useState({
    assignedTasks: [],
    createdTasks: [],
    overdueTasks: [],
  });
  const [error, setError] = useState("");

  const fetchDashboardTasks = async () => {
    try {
      const res = await api.get("/dashboard-tasks", { withCredentials: true });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboardTasks();
  }, []);

  const { assignedTasks, createdTasks, overdueTasks } = data;

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      <TaskSection
        title="Tasks Assigned To Me"
        tasks={assignedTasks}
        refreshTasks={fetchDashboardTasks}
      />
      <TaskSection
        title="Tasks Created by me"
        tasks={createdTasks}
        refreshTasks={fetchDashboardTasks}
      />
      <TaskSection
        title="Overdue Tasks"
        tasks={overdueTasks}
        highlightOverdue
        refreshTasks={fetchDashboardTasks}
      />
    </div>
  );
}

function TaskSection({ title, tasks, highlightOverdue, refreshTasks }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {tasks.length > 0 ? (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              highlight={highlightOverdue}
              refreshTasks={refreshTasks}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tasks here.</p>
      )}
    </div>
  );
}

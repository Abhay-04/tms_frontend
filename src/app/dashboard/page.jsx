"use client";

import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import api from "@/lib/api";
import { TaskCard } from "@/components/task-card";


export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  
  const fetchTasks = async () => {
    try {
      const res = await api.get("/get-task");

      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch tasks");
    }
  };

  
  useEffect(() => {
  
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {tasks.length > 0 ? (
        <div className="space-y-4 flex flex-wrap gap-4  ">
          
          {tasks.map((task) => (
          <TaskCard  key={task.id} task={task}  />
          ))}
        </div>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
}

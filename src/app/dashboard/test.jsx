"use client";

import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import api from "@/lib/api";
import { useRouter } from "next/router";

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
    // const token = Cookies.get("token");

    // if (!token) {
    //   router.push("/login"); // client-side redirect
    // }
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border rounded bg-gray-100">
              <p>
                <strong>Title:</strong> {task.title}
              </p>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Assigned To:</strong> {task.assignedTo?.name || "SELF"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
}

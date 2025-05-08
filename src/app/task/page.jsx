"use client";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";

import Cookies from "js-cookie";
import api from "@/lib/api";
import { TaskCard } from "@/components/task-card";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");

  console.log(dueDateFilter);
  console.log(tasks);
  const fetchTasks = async () => {
    try {
      const res = await api.get("/get-task");

      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch tasks");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter
      ? task.priority === priorityFilter
      : true;
    const matchesDueDate = dueDateFilter
      ? task.dueDate === dueDateFilter
      : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">MY TASKS</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-2 py-1 rounded w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              {dueDateFilter ? (
                format(new Date(dueDateFilter), "dd-MM-yyyy")
              ) : (
                <span>Filter by due date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={dueDateFilter ? new Date(dueDateFilter) : undefined}
              onSelect={(date) => {
                if (date) {
                  // Force time to 00:00:00 UTC
                  const utcMidnight = new Date(
                    Date.UTC(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    )
                  );
                  const iso = utcMidnight.toISOString(); // ✅ Results in "YYYY-MM-DDT00:00:00.000Z"
                  setDueDateFilter(iso);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {filteredTasks.length > 0 ? (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <p>No matching tasks.</p>
      )}
    </div>
  );
}

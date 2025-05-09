"use client";

import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Edit,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import { toast } from "sonner";

export function TaskCard({ task, refreshTasks }) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "MEDIUM":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "HIGH":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";

      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-slate-100 text-slate-800 hover:bg-slate-100",
          progress: 0,
        };
      case "IN_PROGRESS":
        return {
          color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
          progress: 50,
        };
      case "COMPLETED":
        return {
          color: "bg-green-100 text-green-800 hover:bg-green-100",
          progress: 100,
        };

      default:
        return {
          color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
          progress: 0,
        };
    }
  };

  const statusInfo = getStatusInfo(task.status);
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== "COMPLETED";
  const daysRemaining = Math.ceil(
    (dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleDelete = async (taskID) => {
    try {
      await api.delete(`/delete/${taskID}`);

      toast.success("Task deleted");

      refreshTasks();
    } catch (err) {
      toast.error(err.response.data.error);
      // Optional: show error to user
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/update/${task.id}`, editedTask);
      setEditOpen(false);
      toast.success("Task Updated");
      refreshTasks();
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  const updateTaskStatus = async (newStatus) => {
    try {
      await api.put(`/update/${task.id}`, { status: newStatus });
      // Optional: refresh the task list or update local state

      toast.success("Task Updated");
      refreshTasks();
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <Card className="w-full  shadow-sm hover:shadow transition-shadow ">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium leading-none">{task.title}</h3>
            <Badge
              variant="outline"
              className={getPriorityColor(task.priority)}
            >
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className={statusInfo.color}>
              {task.status === "IN_PROGRESS" && (
                <Clock className="mr-1 h-3 w-3" />
              )}
              {task.status === "COMPLETED" && (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              )}
              {task.status}
            </Badge>
            <div
              className={`flex items-center ${
                isOverdue && task.status !== "COMPLETED" ? "text-red-500" : ""
              }`}
            >
              <CalendarClock className="mr-1 h-3 w-3" />
              {dueDate.toLocaleDateString()}
              {isOverdue && task.status !== "COMPLETED"
                ? " (Overdue)"
                : daysRemaining === 0
                ? " (Today)"
                : daysRemaining === 1
                ? " (Tomorrow)"
                : daysRemaining > 0 && daysRemaining < 7
                ? ` (${daysRemaining} days left)`
                : ""}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <MoreHorizontal className="h-4 w-4 " />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4 " />
                  Edit Task
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Title</Label>
                    <Input
                      value={editedTask.title}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <Label>Description</Label>
                    <Textarea
                      value={editedTask.description}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Priority</Label>
                    <select
                      value={editedTask.priority}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          priority: e.target.value,
                        })
                      }
                      className="border px-2 py-1 rounded cursor-pointer"
                    >
                      <option value="">All Priorities</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Priority</Label>
                    <select
                      value={editedTask.status}
                      onChange={(e) =>
                        setEditedTask({ ...editedTask, status: e.target.value })
                      }
                      className="border px-2 py-1 rounded cursor-pointer"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
                <DialogFooter className="pt-4 ">
                  <Button className="cursor-pointer" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(task.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={statusInfo.progress} className="h-1" />
        </div>
        <div className={`text-sm ${expanded ? "" : "line-clamp-2"}`}>
          {task.description}
        </div>
        {task.description.length > 120 && (
          <Button
            variant="link"
            className="p-0 h-auto text-xs mt-1"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage
                src={
                  task.assignedTo?.avatar ||
                  "/placeholder.svg?height=24&width=24"
                }
              />
              <AvatarFallback className="text-xs">
                {task.assignedTo ? getInitials(task.assignedTo.name) : "ME"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {` ${
                task.assignedTo
                  ? `TASK ASSIGNED TO ${task.assignedTo?.name.toUpperCase()}`
                  : "Task CREATED BY ME"
              }`}
            </span>{" "}
            <br></br>
          </div>
          <div className="flex gap-1 place-items-end">
            <Button
              onClick={() => updateTaskStatus("COMPLETED")}
              variant="outline"
              size="sm"
              className="h-7 cursor-pointer"
            >
              <CheckCircle2 className="mr-1 h-3 w-3 r" />
              Mark Complete
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

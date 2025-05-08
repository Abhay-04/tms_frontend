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
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";




  

export function TaskCard({ task }) {
    console.log(task)
  const [expanded, setExpanded] = useState(false);

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
        return { color: "bg-slate-100 text-slate-800 hover:bg-slate-100", progress: 0 };
      case "IN_PROGRESS":
        return { color: "bg-blue-100 text-blue-800 hover:bg-blue-100", progress: 50 };
      case "COMPLETED":
        return { color: "bg-green-100 text-green-800 hover:bg-green-100", progress: 100 };
      
      default:
        return { color: "bg-gray-100 text-gray-800 hover:bg-gray-100", progress: 0 };
    }
  };

  const statusInfo = getStatusInfo(task.status);
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== "COMPLETED";
  const daysRemaining = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

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
      console.log("Task deleted");
  
      // Optionally refresh list or update Redux state here
    } catch (err) {
      console.error("Error deleting task:", err);
      // Optional: show error to user
    }
  };

  return (
    <Card className="w-full shadow-sm hover:shadow transition-shadow ">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium leading-none">{task.title}</h3>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className={statusInfo.color}>
              {task.status === "IN_PROGRESS" && <Clock className="mr-1 h-3 w-3" />}
              {task.status === "COMPLETED" && <CheckCircle2 className="mr-1 h-3 w-3" />}
              {task.status}
            </Badge>
            <div className={`flex items-center ${isOverdue && task.status !== "COMPLETED" ? "text-red-500" : ""}`}>
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=> handleDelete(task.id)} className="text-red-600">
              <Trash2  className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={statusInfo.progress} className="h-1" />
        </div>
        <div className={`text-sm ${expanded ? "" : "line-clamp-2"}`}>{task.description}</div>
        {task.description.length > 120 && (
          <Button variant="link" className="p-0 h-auto text-xs mt-1" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={task.assignedTo?.avatar || "/placeholder.svg?height=24&width=24"} />
              <AvatarFallback className="text-xs">
                {task.assignedTo ? getInitials(task.assignedTo.name) : "ME"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assignedTo?.name || "Assigned To Me"}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Mark Complete
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

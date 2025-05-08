import { Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/lib/userSlice";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { setNotifications } from "@/lib/notificationSlice";
import { useEffect } from "react";

export function AppHeader() {
  const user = useSelector((state) => state.user.user);
  console.log(user);
  return (
    <header className="sticky top-0 z-50 w-full px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="flex h-14 items-center justify-between ">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                TMS
              </span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Task Management System
            </span>
          </Link>
        </div>
        {user !== null && (
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/dashboard">
              <Button className="cursor-pointer" variant="outline">Dashboard</Button>
            </Link>
            <NotificationsDropdown  />
            <UserDropdown />
          </div>
        )}
      </div>
    </header>
  );
}

export function NotificationsDropdown() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        dispatch(setNotifications(res.data));
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer p-0"
              >
                <div className="flex w-full flex-col gap-1 p-2">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    <time className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </time>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-4">
              No new notifications.
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-center font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserDropdown() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      // Call logout API
      await api.post("/logout");

      // Clear Redux user
      dispatch(clearUser());

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar || "/placeholder.svg?height=32&width=32"}
              alt={user?.name || "User"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

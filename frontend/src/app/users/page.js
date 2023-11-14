"use client";
import { useProtectedRoute } from "@/hooks";
import UsersView from "@/views/users-view";

const Users = () => {
  return <UsersView />;
};

export default useProtectedRoute(UsersView);

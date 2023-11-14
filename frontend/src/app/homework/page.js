"use client";
import { useProtectedRoute } from "@/hooks";
import HomeworkView from "@/views/homework-view";

const Login = () => {
  return <HomeworkView />;
};

export default useProtectedRoute(Login);

"use client";
import { useProtectedRoute } from "@/hooks";
import HomeworkView from "@/views/homework-view";

const Homework = () => {
  return <HomeworkView />;
};

export default useProtectedRoute(Homework);

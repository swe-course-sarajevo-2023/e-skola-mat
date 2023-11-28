"use client";
import { useProtectedRoute } from "@/hooks";
import ProfessorHomeworkView from "@/views/professor-homework-view";

const Homework = () => {
  return <ProfessorHomeworkView />;
};

export default useProtectedRoute(Homework);
"use client";
import { useProtectedRoute } from "@/hooks";
import StudentGroupView from "@/views/group-student-view";

const Ucenik = () => {
  return <StudentGroupView />;
};

export default useProtectedRoute(StudentGroupView);

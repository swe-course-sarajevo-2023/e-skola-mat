"use client";
import { useProtectedRoute } from "@/hooks";
import StudentGroupView from "@/views/group-student-view";

const Ucenik = ({ params }) => {
  return <StudentGroupView grupa={params.id} />;
};

export default useProtectedRoute(Ucenik);

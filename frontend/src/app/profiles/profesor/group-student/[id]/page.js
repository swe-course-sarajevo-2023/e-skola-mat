"use client";
import { useProtectedRoute } from "@/hooks";
import StudentGroupView from "@/views/group-student-view";

const Ucenik = ({ params }) => {
  return <StudentGroupView grupa={params.id} />;
};

// Wrap the component with useProtectedRoute
const ProtectedUcenik = useProtectedRoute(Ucenik);

export default ProtectedUcenik;

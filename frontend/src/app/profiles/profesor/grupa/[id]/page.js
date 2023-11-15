"use client";
import { useProtectedRoute } from "@/hooks";
import ProfesorGrupaView from "@/views/profesor-grupa-view";

const ProfesorGrupa = ({ params }) => {
  return <ProfesorGrupaView grupa={params.id} />;
};

export default useProtectedRoute(ProfesorGrupa);

import ProfesorGrupaView from "@/views/profesor-grupa-view";

export default function ProfesorGrupa({params}) {
  return <ProfesorGrupaView grupa={params.id} />;
}
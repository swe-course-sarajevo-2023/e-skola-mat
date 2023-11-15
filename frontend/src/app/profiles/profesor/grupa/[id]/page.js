import ProfessorGroupView from "@/views/professor-group-view";

export default function ProfessorGroup({ params }) {
  return <ProfessorGroupView grupa={params.id} />;
}

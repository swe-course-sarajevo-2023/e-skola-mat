import JednaZadacaGrupeView from "@/views/jedna-zadaca-grupe-view";

export default function JednaZadacaGrupe({params}) {
  return <JednaZadacaGrupeView zadaca={params.id} />;
}
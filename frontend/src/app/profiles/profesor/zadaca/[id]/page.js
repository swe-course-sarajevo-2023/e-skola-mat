"use client";
import JednaZadacaGrupeView from "@/views/jedna-zadaca-grupe-view";

const JednaZadacaGrupe = ({ params }) => {
  return <JednaZadacaGrupeView zadaca={params.id} />;
};

export default JednaZadacaGrupe;

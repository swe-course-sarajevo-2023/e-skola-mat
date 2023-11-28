"use client";
import { useProtectedRoute } from "@/hooks";
import HomeworkView from "@/views/homework-view";

const Homework = ({params}) => {
  return <HomeworkView id={params.id}/>;
};

export default useProtectedRoute(Homework);

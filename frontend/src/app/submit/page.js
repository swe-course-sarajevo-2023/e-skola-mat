"use client";
import SubmitModal from "@/views/submit-homework";

export const setSubmitModalShow = (props) => {
  console.log("PROPS", props);
  return <SubmitModal isOpen={props} />;
};

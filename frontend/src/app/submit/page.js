import SubmitModal from "@/views/submit-zadaca";

export const setSubmitModalShow = (props) => {
  console.log("PROPS", props);
  return <SubmitModal isOpen={props} />;
};

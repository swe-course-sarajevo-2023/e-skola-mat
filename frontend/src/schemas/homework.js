import * as yup from "yup";
import moment from "moment";

const homeworkSchema = yup.object().shape({
  name: yup.string().required("Potrebno je unijeti naziv zadaće!"),
  maxNumbersOfProblems: yup
    .number()
    .required("Potrebno je unijeti broj zadataka!")
    .min(1, "Minimalan broj zadataka mora biti 1!"),
  deadline: yup
    .mixed()
    .required("Potrebno je unijeti rok zadaće1")
    .test(
      "is-in-future",
      "Rok zadaće ne može biti stariji od današnjeg dana!",
      function (value) {
        return moment(value).isSameOrAfter(moment(), "day");
      }
    ),
  groups: yup.array().required("Potrebno je izabrati bar jednu grupu!"),
});

export default homeworkSchema;

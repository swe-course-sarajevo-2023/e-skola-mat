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
  groups: yup
    .array()
    .test(
      "not-empty",
      "Potrebno je izabrati bar jednu grupu!",
      function (value) {
        return value && value.length > 0;
      }
    )
    .test(
      "all-or-group",
      'Ne može se izabrati "Sve grupe" i ostale grupe!',
      function (value) {
        const allSelectedIndex = value.findIndex(
          ({ value }) => value === "all"
        );

        if (allSelectedIndex > -1) {
          return value.length === 1;
        }

        return !value.includes(({ value }) => value === "all");
      }
    ),
});

export default homeworkSchema;

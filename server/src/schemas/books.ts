import * as yup from "yup";

const recommendShema = yup.object().shape({
  genreUrl: yup
    .string()
    .typeError("genereUrl must be of type 'string'")
    .required("genereUrl is required"),
});

export { recommendShema };

import React from "react";
import { useHistory } from "react-router-dom";
import { FormikConfig } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";

import { Grid } from "@mui/material";

import { CreateJobTypeMutation, CreateJobTypeMutationVariables } from "generated/types";

import { TextInput } from "components";
import { useCmsContext } from "pages/cms";

import { Form, parseFormValues } from "../Form";
import { jobTypesUrl } from "./Routes";

export const CREATE_JOB_TYPE = gql`
  mutation CreateJobType($input: CreateJobTypeInput!) {
    createJobType(input: $input) {
      jobType {
        id
      }
    }
  }
`;

const initialValues = {
  title: "",
  notes: "",
};

export const AddJobType: React.FC = () => {
  const history = useHistory();
  const { refetchJobTypes } = useCmsContext();

  const [createJobType] = useMutation<CreateJobTypeMutation, CreateJobTypeMutationVariables>(CREATE_JOB_TYPE);

  const handleSubmit = React.useCallback<FormikConfig<typeof initialValues>["onSubmit"]>(
    async (values, { setSubmitting }) => {
      values = parseFormValues(values, ["title", "notes"]);
      setSubmitting(true);

      const { data: updateData } = await createJobType({
        variables: { input: { jobType: values } },
      });

      if (updateData?.createJobType?.jobType) {
        refetchJobTypes();
        history.push(`/cms/${jobTypesUrl}`);
      }

      setSubmitting(false);
    },
    [createJobType, history, refetchJobTypes]
  );

  return (
    <Form
      initialValues={initialValues}
      validationSchema={Yup.object({
        title: Yup.string().min(5).required("Obavezno polje"),
        notes: Yup.string().nullable(),
      })}
      onSubmit={handleSubmit}
    >
      <Grid item xs={12}>
        <TextInput
          name="title"
          type="text"
          placeholder="Doktor medicine"
          textFieldProps={{
            label: "Vrsta posla",
            variant: "outlined",
            fullWidth: true,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextInput
          name="notes"
          type="text"
          textFieldProps={{
            label: "Opis",
            variant: "outlined",
            fullWidth: true,
          }}
        />
      </Grid>
    </Form>
  );
};

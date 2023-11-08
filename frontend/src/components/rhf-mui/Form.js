import React from "react";
import { FormProvider } from "react-hook-form";
import { Grid } from "@mui/material";

const Form = ({ methods, onSubmit, children }) => {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        autoComplete="off"
        noValidate
      >
        <Grid container spacing={3}>
          {React.Children.map(children, (child, index) => (
            <Grid
              item
              key={index}
              xs={child?.props?.xs || 12}
              md={child?.props?.md || 12}
              lg={child?.props?.lg || 12}
              xl={child?.props?.xl || 12}
            >
              {child}
            </Grid>
          ))}
        </Grid>
      </form>
    </FormProvider>
  );
};

export default Form;

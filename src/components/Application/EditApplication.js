import React, { useState, useEffect } from "react";
import Application from "./Application";

const EditApplication = ({ data }) => {
  const [formValues, setFormValues] = useState();
  useEffect(() => {
    setFormValues({
      product_selection: data?.application?.product,
      label_criteria: data?.label_criteria,
      melted_criteria: data?.melted_criteria,
      product_details: data?.product_details,
      compositions: data?.compositions,
      sm_process: data?.sm_process,
      pricing_details: data?.pricing,
      certification: [],
      declaration: [],
    });
  }, [data]);

  return (
    <div>
      <>
        <Application type="edit" formValues={formValues} />;
      </>
    </div>
  );
};

export default EditApplication;

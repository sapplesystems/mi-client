import React, { useEffect, useState } from "react";
import Application from "./Application";

const ViewApplication = ({ data }) => {
  const [status, setStatus] = useState();

  const [formValues, setFormValues] = useState();

  useEffect(() => {
    setFormValues({
      product_selection: data?.application?.product,
      label_criteria: data?.label_criteria,
      melted_criteria: data?.melted_criteria,
      application_doc: data?.application_doc,
      product_details: data?.product_details,
      compositions: data?.compositions,
      sm_process: data?.sm_process,
      pricing_details: data?.pricing,
      certification: data?.attachments,
      declaration: data?.declaration,
    });
    setStatus(data?.application?.status);
  }, [data]);

  return (
    <Application
      status={status}
      type={status === "changeRequest" ? "edit" : "view"}
      formValues={formValues}
      application_id={data?.application?.id}
      uniqueApplicationId={data?.application?.unique_application_id}
      review={data?.review_comment}
    />
  );
};

export default ViewApplication;

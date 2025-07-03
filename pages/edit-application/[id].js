import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiRequest from "../../utils/request";
import EditApplication from "../../src/components/Application/EditApplication.js";

const Edit_Application = () => {
  const { query } = useRouter();
  const [data, setData] = useState();

  const getApplication = () => {
    apiRequest({
      method: "GET",
      url: `/api/v1/application/${query.id}/details`,
    })
      .then((resp) => {
        setData(resp.data);
      })
      .catch((error) => {
        console.log(error?.data?.error);
      });
  };

  useEffect(() => {
    getApplication();
  }, [query.id]);

  return (
    <div>
      <EditApplication data={data} />
    </div>
  );
};

export default Edit_Application;

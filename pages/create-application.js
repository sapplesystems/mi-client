import React from "react";
import authenticatedRoute from "../src/components/AuthenticatedRoutes.js";
import CreateApplication from "../src/components/Application/CreateApplication";

const Create_Application = () => {
  return (
    <div>
      <CreateApplication />
    </div>
  );
};

export default authenticatedRoute(Create_Application, {
  pathAfterFailure: "/login",
});

import React, { useState, useEffect } from "react";
import OrganizationHome from "../src/components/Organization/OrganizationHome";
import { MainLayout } from "../src/shared";
import authenticatedRoute from "../src/components/AuthenticatedRoutes.js";

const Organization = () => {
  return (
    <MainLayout>
      <OrganizationHome />
    </MainLayout>
  );
};

export default authenticatedRoute(Organization, { pathAfterFailure: "/login" });

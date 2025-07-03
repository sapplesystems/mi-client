import React from "react";

import TeamHome from "../src/components/Team/TeamHome";
import { MainLayout } from "../src/shared";

import authenticatedRoute from "../src/components/AuthenticatedRoutes.js";

const Team = () => {
  return (
    <MainLayout>
      <TeamHome />
    </MainLayout>
  );
};

export default authenticatedRoute(Team, { pathAfterFailure: "/login" });

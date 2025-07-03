import React, { useState, useEffect } from "react";
import Main from "../src/components/Main";
import { MainLayout } from "../src/shared";
import apiRequest from "../utils/request.js";
import { useRouter } from "next/router";
import authenticatedRoute from "../src/components/AuthenticatedRoutes.js";
import { is_applicant } from "../utils/roles.js";

const Home = () => {
  const router = useRouter();
  const [org, setOrg] = useState(null);
  //   const user_role = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user"))?.role : "";
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};

  useEffect(() => {
    if (is_applicant(user?.role)) {
      apiRequest({ url: "/api/v1/org-details/", method: "GET" })
        .then((resp) => {
          setOrg(resp?.data);
        })
        .catch((error) => {
          console.log(error);
          router.push({ pathname: "/register", query: { step: 4 } });
        });
    }
  }, []);

  return (
    <MainLayout>
      <Main org={org} />
    </MainLayout>
  );
};

export default authenticatedRoute(Home, { pathAfterFailure: "/login" });

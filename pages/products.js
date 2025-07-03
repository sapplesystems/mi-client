import React, { useState, useEffect } from "react";
import ProductHome from "../src/components/Product/ProductHome";
import { MainLayout } from "../src/shared";
import authenticatedRoute from "../src/components/AuthenticatedRoutes.js";

const Products = () => {
  return (
    <MainLayout>
      <ProductHome />
    </MainLayout>
  );
};

export default authenticatedRoute(Products, { pathAfterFailure: "/login" });

import React from "react";
import Certificate from "../../../src/components/Certificate";

const ProductDetails = (props) => {
  return <Certificate Props={props} />;
};

export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      "/product-details/app-id-1/sequence-id-1/",
      // Object variant:
      { params: { id: "second-id-2", applicationId: "abcd" } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const application_id = params?.applicationId;
  const sequence_id = params?.id;
  let product_details = null;
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/${application_id}/${sequence_id}/`, {
    method: "GET",
  });
  if (resp.status == "200") {
    const json_resp = await resp.json();
    product_details = json_resp;
  }
  return {
    props: {
      applicationId: params?.applicationId,
      sequenceId: params.id,
      product_details,
    },
    revalidate: 10,
    notFound: false,
  };
  // Fetch necessary data for the blog post using params.id
}

export default ProductDetails;

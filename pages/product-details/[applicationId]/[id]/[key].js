import React from "react";
import Certificate from "../../../../src/components/Certificate";

const ProductDetails = (props) => {
  return <Certificate Props={props} />;
};

export async function getStaticPaths() {
  return {
    paths: [
      // String variant:
      "/product-details/app-id-1/sequence-id-1/item-key-1/",
      // Object variant:
      { params: { id: "second-id-2", applicationId: "abcd", key: "item-key-1" } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const application_id = params?.applicationId;
  const sequence_id = params?.id;
  const item_key = params?.key;
  let product_details = null;

  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/${application_id}/${sequence_id}/${item_key}`,
      { method: "GET" }
    );

    if (resp.status == "200") {
      const json_resp = await resp.json();
      product_details = json_resp;
    }
  } catch (error) {
    console.log("error: ", error);
  }
  return {
    props: {
      applicationId: params?.applicationId,
      sequenceId: params.id,
      item_key: params.key,
      product_details,
    },
    revalidate: 10,
    notFound: false,
  };
  // Fetch necessary data for the blog post using params.id
}

export default ProductDetails;

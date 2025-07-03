import React from "react";
import Image from "next/image";

import { Layout } from "../src/shared";
import Oval from "../assets/Oval.svg";
import Banner from "../assets/banner.png";

import styles from "../styles/ContactUs.module.scss";

const AboutUs = () => {
  return (
    <>
      <Layout>
        <div className={styles.contactus__container}>
          <img
            className={styles.banner}
            src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/background-banner.jpeg"
          />
          <div className={styles.contactus__content}>
            <h1>About us</h1>
          </div>
        </div>

        <div className={styles.content}>
          <h2>
            Elevating <b>Brand India</b> through <b>Made in India</b>
          </h2>
          <p>
            The Hon’ble Prime Minister's strong emphasis on <b>Atmanirbhar Bharat </b>
            and <b>Vocal for Local</b> has significantly brought domestic manufacturing
            to the center stage. The Scheme for the Made in India Label is a
            step towards fulfilling the PM’s vision and bringing greater
            visibility to domestically manufactured products, both at the
            domestic as well as the global level.
          </p>
          <br/>
          <p>
            The Scheme aims to establish a resilient system to enhance the brand
            reputation of products manufactured in India. To guarantee the
            authenticity of the product originating from India and/or crafted
            with locally sourced raw materials, manufacturers will be granted a
            Label within the Scheme. This Label will serve to exhibit the
            product's Indian origin and its superior quality. The said Label
            will be displayed on the product and/or on its packaging, along with
            a QR code. The QR code will specify all the information related to
            the validity of the Label, the location of manufacturing, and other
            product-specific information.
          </p>
          <br/>
          <p>
            The initiative is being led by the Department for Promotion of
            Industry and Internal Trade (DPIIT). The Quality Council of India
            and the India Brand Equity Foundation are actively collaborating
            with DPIIT in an advisory capacity.
          </p>
        </div>
      </Layout>
    </>
  );
};

export default AboutUs;

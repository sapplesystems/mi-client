import React from "react";
import styles from "../../styles/Footer.module.scss";
import Logo from "../../assets/logo.svg";
import {
  GoogleOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const baseImagesPath = "https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/";

const Footer = () => {
  const router = useRouter();
  return (
    <div className={styles.footer__container}>
      <div className={styles.footer__elipse} />

      <div className={styles.footer__content}>
        <div className={styles.footer__left}>
          {/* <img src={baseImagesPath+'logo.svg'} /> */}

          <p>Made in India</p>
          <p>Building trust every step of the way</p>
          <span>
            <GoogleOutlined />
            <TwitterOutlined />
            <InstagramOutlined />
            <LinkedinOutlined />
            <YoutubeOutlined />
          </span>
        </div>
        <div className={styles.footer__right}>
          <div>
            <p>Web Info</p>
            <p onClick={() => router.push("/about-us")}>About Us</p>
            <p onClick={() => router.push("/contact-us")}>Contact Us</p>
            <p>Terms of use</p>

            <p onClick={() => router.push("/privacy-policy")}>Privacy policy</p>

            <p>Sitemap</p>
            <p>Referral Program</p>
            <p>Pricing</p>
          </div>
          <div>
            <p>Made in India Label</p>
            <p>Introduction</p>
            <p>Statistics</p>
            <p>New</p>
          </div>
          <div>
            <p>Resources</p>
            <p>MII handbook</p>
            <p>Terms & Conditions</p>
            <p>Policies</p>
            <p>Miscellaneous</p>
          </div>
          <div>
            <p>Help</p>
            <p>Training Videos</p>
            <p>Training Documents</p>
            <p>Changelog</p>
          </div>
        </div>
      </div>
      <div className={styles.footer__bottom}>
        {/* <span>LOGO</span> */}
        <p>
          The site is designed, developed, and managed by the Quality Council of India (QCI). The scheme is owned by the
          Department for Promotion of Industry and Internal Trade (DPIIT)
        </p>
      </div>
    </div>
  );
};

export default Footer;

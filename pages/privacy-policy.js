import React from "react";
import Image from "next/image";
import { Layout } from "../src/shared";
import Oval from "../assets/Oval.svg";
import styles from "../styles/ContactUs.module.scss";

const PrivacyPolicy = () => {
  return (
    <Layout>
      {/* <div className={styles.contactus__container}>
        <img
          className={styles.banner}
          src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/Made+in+India+Banner+New1.png"
        />
        <div className={styles.contactus__content}>
          <h1>Privacy policy</h1>
        </div>
      </div> */}
      <div className={styles.contactus__container}>
        <div className={styles.elipse} />
        {/* <Image className={styles.oval1} src={Oval} alt="" /> */}
        {/* <Image className={styles.oval2} src={Oval} alt="" /> */}
        <div className={styles.contactus__content}>
          <h1 style={{ color: "#ffffff" }}>Privacy Policy</h1>
        </div>
      </div>

      <div className={styles.content}>
        {/* <h2>Privacy Policy</h2> */}

        <h3 className={styles.subHeading}>
          Thank you for reviewing our Privacy Policy. Please read it carefully to understand how the
          Madeinindia.qcin.org (hereinafter referred to as the <b>“Website”</b>) collects and uses the information
          provided by you through this Portal (hereinafter referred to as <b>“Portal”</b>).
        </h3>

        <div className={styles.points}>
          <ol>
            <li>
              The website limits the collection, use, disclosure or storage of information to that which reasonably
              serves the website’s lawful functions, administrative purposes, research and analysis, internal processing
              or other legally required purposes. By providing the requested information, you express your consent for
              use of such information by the website.
            </li>
            <li>
              The website may gather certain information about a user, including but not limited to, Internet protocol
              (IP) addresses, domain names, browser type, operating system, the date and/or time of the visit, etc. The
              website makes no active attempts to link such information with the identity of individuals visiting this
              Portal unless so required as per law; or for purposes of investigating, preventing, managing, recording or
              responding to unlawful, unauthorized, fraudulent or other unethical conduct, or for any other law
              enforcement purposes.
            </li>
            <li>
              The website does not sell or trade the information collected through this Portal. The website does not
              share your information with third parties for marketing purposes.
            </li>
            <li>
              The website may disclose information collected through this Portal for, inter alia, the discharge of its
              functions; in response to court orders, legal proceedings or requirements of law enforcement; in
              furtherance of public interest, or as required by law.
            </li>
            <li>
              The website implements reasonable security practices and measures to safeguard information provided to
              this Portal against loss, misuse, unauthorized access or disclosure, alteration, or destruction.
            </li>
            <li>
              Users are solely responsible for maintaining the secrecy, confidentiality and security of their
              credentials to login and access this Portal. If users disclose their credentials or other details to third
              parties, the website shall not be responsible for any loss, damages (including, without limitation,
              damages for loss of business projects, loss of profits or any other damage in contract, tort or otherwise
              whether direct, indirect or consequential) or other repercussions arising from the use of or inability to
              use the Portal, or any of its contents, or from any action taken or refrained from being taken.
            </li>
            <li>
              The terms and conditions stated under this Privacy Policy may be revised or amended periodically. In the
              event of any changes or revisions, the same will be posted on this Portal so that the user may be informed
              of the latest amendments in this Privacy Policy.
            </li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;

import React, { useState } from "react";
import Image from "next/image";
import { Input, Select, message } from "antd";
import Mail from "../assets/mail.svg";
import Oval from "../assets/Oval.svg";
import { Layout } from "../src/shared";
import Phone from "../assets/phone.svg";
import CallSupport from "../assets/call_support.svg";
import styles from "../styles/ContactUs.module.scss";
import { ArrowRightOutlined } from "@ant-design/icons";
import apiRequest from "../utils/request";

const ContactUs = () => {
  const { TextArea } = Input;
  const [data, setData] = useState({
    name: "",
    company_email: "",
    company_name: "",
    country: "India",
    message: "",
  });

  const handleSubmit = () => {
    const url = `/api/v1/contact-us/`;
    apiRequest({
      method: "POST",
      url,
      data,
    })
      .then((res) => {
        message.success(res.data.msg);
        setData({ name: "", company_email: "", company_name: "", country: "India", message: "" });
      })
      .catch((error) => {
        console.log(error);
        message.error(error?.data?.error);
      })
      .finally(() => {});
  };

  return (
    <Layout>
      <div>
        <div className={styles.contactus__container}>
          <div className={styles.elipse} />
          <Image className={styles.oval1} src={Oval} alt="" />
          <Image className={styles.oval2} src={Oval} alt="" />
          <div className={styles.contactus__content}>
            <h1>Contact us</h1>
            {/* <h6>
              If you need our help, have questions about how to use the platform or are experiencing technical
              difficulties, please do not hesitate to contact us.
            </h6> */}
          </div>
        </div>
      </div>
      <div className={styles.form__container}>
        <div className={styles.form}>
          <div className={styles.form__row}>
            <div>
              <label>Your Name</label>
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label>Contact email</label>
              <Input
                value={data.company_email}
                onChange={(e) => setData({ ...data, company_email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className={styles.form__row}>
            <div>
              <label>Company name</label>
              <Input
                value={data.company_name}
                onChange={(e) => setData({ ...data, company_name: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div>
              <label>Country</label>
              <Select
                className={styles.select}
                showSearch
                placeholder="Country"
                optionFilterProp="children"
                defaultValue="India"
                value={data.country}
                onChange={(val) => setData({ ...data, country: val })}
                //  onSearch={onSearch}

                options={[
                  {
                    value: "India",
                    label: "India",
                  },
                  {
                    value: "USA",
                    label: "USA",
                  },
                  {
                    value: "Russia",
                    label: "Russia",
                  },
                ]}
              />
            </div>
          </div>
          <div className={styles.form__row}>
            <div>
              <label>Your message</label>
              <TextArea
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
                style={{ width: "95%" }}
                rows={6}
                placeholder="Type your message"
              />
            </div>
          </div>
          <p className={styles.info}>
            By submitting this form you agree to our terms and conditions and our Privacy Policy which explains how we
            may collect, use and disclose your personal information including to third parties.
          </p>
          <div className="btn__orange">
            <p style={{ margin: "auto", color: "white" }} onClick={handleSubmit}>
              Submit
            </p>
          </div>
        </div>
        <div className={styles.contactus__footer}>
          <div className={styles.contactus__col}>
            <div className={styles.icon}>
              <span>
                <Image src={Mail} alt="" />
              </span>
            </div>
            <h5>Email us</h5>
            <p>Email us for general queries, including marketing and partnership opportunities.</p>
            <h6>madeinindia@qcin.org</h6>
          </div>
          {/* <div className={styles.contactus__col}>
            <div className={styles.icon}>
              <span>
                <Image src={Phone} alt="" />
              </span>
            </div>
            <h5>Call us</h5>
            <p>Call us to speak to a member of our team. We are always happy to help.</p>
            <h6>+1 (646) 786-5060</h6>
          </div>
          <div className={styles.contactus__col}>
            <div className={styles.icon}>
              <span>
                <Image src={CallSupport} alt="" />
              </span>
            </div>
            <h5>Support</h5>
            <p>Check out helpful resources, FAQs and developer tools.</p>
            <h6>
              Suppert Center <ArrowRightOutlined />
            </h6>
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;

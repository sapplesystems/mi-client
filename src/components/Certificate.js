import { useState } from "react";
import { Divider, Result, Spin, Row, Col, Input, Button, message } from "antd";
import React from "react";
import styles from "../../styles/ProductDetails.module.scss";
import moment from "moment";
import { CheckOutlined } from "@ant-design/icons";
import apiRequest from "../../utils/request";

const Certificate = (props) => {
  const { Props } = props;
  const [feedback, setFeedback] = useState("");

  if (Props?.product_details === undefined) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.content__container}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Spin />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (Props?.product_details === null) {
    return <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />;
  }

  const product_details = Props?.product_details;

  const renderCompanyLogo = () => {
    if (product_details?.company_logo) {
      return (
        <Col span={6}>
          <div className={styles.org_logo}>
            <div>
              <img style={{ maxHeight: 70 }} src={product_details.company_logo} />
            </div>
          </div>
        </Col>
      );
    } else {
      return (
        <Col span={6}>
          <div className={styles.org_logo}>
            <div>
              <img
                style={{ height: 70 }}
                src={
                  "https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/organization.svg"
                }
              />
            </div>
          </div>
        </Col>
      );
    }
  };

  const renderProductDetails = () => {
    const keys = Object.keys(product_details);

    return keys?.map((item, index) => {
      if (item === "Product" || item === "company_logo" || !product_details[item]) {
        return null;
      } else if (item === "Company Website" && product_details[item]) {
        const websiteUrl = product_details[item];
        const formattedUrl =
          websiteUrl.startsWith("http://") || websiteUrl.startsWith("https://") ? websiteUrl : `http://${websiteUrl}`;

        return (
          <Row key={index} justify="start" style={{ fontWeight: 400, lineHeight: "15px" }}>
            <Col span={10} style={{ textAlign: "start" }}>
              <label style={{ fontWeight: 700 }}>{item}</label>
            </Col>
            <Col span={14} style={{ textAlign: "start" }}>
              <a href={formattedUrl} target="_blank" rel="noopener noreferrer">
                {formattedUrl}
              </a>
            </Col>
            <Divider style={{ opacity: 0 }} />
          </Row>
        );
      } else if (item === "branch_name") {
        return (
          <Row key={index} justify="start" style={{ fontWeight: 400, lineHeight: "15px" }}>
            <Col span={10} style={{ textAlign: "start" }}>
              <label style={{ fontWeight: 700 }}>Branch Name</label>
            </Col>
            <Col span={14} style={{ textAlign: "start" }}>
              <p style={{ wordWrap: "break-word" }}>{product_details[item]}</p>
            </Col>
            <Divider style={{ opacity: 0 }} />
          </Row>
        );
      } else {
        if (item == "Company Website" || item == "updated_at") return null;
        return (
          <Row key={index} justify="start" style={{ fontWeight: 400, lineHeight: "15px" }}>
            <Col span={10} style={{ textAlign: "start" }}>
              <label style={{ fontWeight: 700 }}>{item === "sequence_id" ? "Batch No." : item}</label>
            </Col>
            <Col span={14} style={{ textAlign: "start" }}>
              <p style={{ wordWrap: "break-word" }}>{product_details[item]}</p>
            </Col>
            <Divider style={{ opacity: 0 }} />
          </Row>
        );
      }
    });
  };

  const handleSend = () => {
    apiRequest({
      url: "/api/v1/submit-feedback/",
      method: "POST",
      data: {
        feedback,
        external_application_id: Props?.applicationId,
        sequence_id: Props?.sequenceId,
      },
    })
      .then((resp) => {
        message.success("Feedback submitted successfully!");
        setFeedback("");
      })
      .catch((error) => {
        console.log(error);
        message.error("Something went wrong. Please try again after some time");
      });
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        background: `url(https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/background-doodle.jpg
       )`,
      }}
    >
      <img
        className={styles.img}
        src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/background+01+(1).jpg"
      />
      <Row
        justify="center"
        align="top"
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
        style={{
          height: "100%",
          width: "100%",
          //  margin: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Row className={styles.nav_container} justify="space-between">
          <Col className={styles.img_1}>
            <img src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/NE_Preview1.png" />
          </Col>
          <Col className={styles.heading}>
            <h6>MADE IN INDIA</h6>
            <p>From India, For the World</p>
          </Col>
          <Col className={styles.img_2}>
            <img src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/qci-logo.png" />
          </Col>
        </Row>
        <Col lg={20} md={20} xs={23} sm={20}>
          <Row justify="center">
            <Col xs={26} sm={24} md={24} lg={12}>
              <Row justify="center" align="center" style={{ margin: "4rem" }}>
                <div
                  className={styles.cert__header}
                  style={{
                    fontWeight: 700,
                    lineHeight: "18px",
                    textAlign: "center",
                    color: "#ffffff",
                  }}
                >
                  This is to certify that the Quality Council of India (QCI) has granted permission for the use of the
                  'Made in India' label to the following product. This permission has been granted through a
                  self-declaration process and is effective starting from{" "}
                  {product_details.updated_at && moment(product_details.updated_at).isValid()
                    ? moment(product_details.updated_at).format("DD/MM/YYYY")
                    : moment().format("DD/MM/YYYY")}
                  .
                </div>
              </Row>
              <Row justify="center" align="center" style={{ margin: "2rem" }}>
                {renderCompanyLogo()}
              </Row>
              <Row justify="center" align="center" className={styles.productDetails}>
                <Col span={24}>{renderProductDetails()}</Col>
              </Row>
              <div className={styles.content__right}>
                <h3>Suggestions to improve</h3>
                {/* <span>
                  <CheckOutlined />
                  <p>Please fill this doc</p>
                </span>
                <Divider />
                <span>
                  <CheckOutlined />
                  <p>Please respond to so and so</p>
                </span> */}
                {/* <Divider /> */}
                <h6>Send message</h6>
                <div className={styles.textArea__container}>
                  <Input.TextArea
                    placeholder="Enter your message..."
                    rows={6}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <Button type="primary" onClick={handleSend}>
                    Send
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Certificate;

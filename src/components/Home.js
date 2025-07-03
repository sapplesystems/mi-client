import React from "react";
import { Button, Collapse, Modal, FloatButton } from "antd";
import { Layout } from "../shared";
import styles from "../../styles/Home.module.scss";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useRouter } from "next/router";

import { ArrowRightOutlined, CheckOutlined, LikeFilled, TwitterOutlined, WarningFilled } from "@ant-design/icons";
import { getOrgDetails } from "../../utils/helper";

const baseImagesPath = "https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/";

const Home = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [org, setOrg] = React.useState(null);

  React.useEffect(() => {
    getOrgDetails()
      .then((resp) => {
        setOrg(resp.data);
      })
      .catch((error) => {
        localStorage.clear();
        setOrg(null);
      });
  }, []);

  const handleContinue = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <FloatButton
        description={<p style={{ color: "white" }}>Fraud Alert</p>}
        shape="circle"
        type="default"
        style={{
          left: 5,
          bottom: 10,
          height: 75,
          width: 75,
        }}
        icon={<WarningFilled style={{ color: "white", fontSize: 19 }} />}
        onClick={() => setIsModalOpen(true)}
      />
      <div className={styles.home__container}>
        <div>
          <div className={styles.home__content}>
            <h1>Made in India</h1>
            <p>An initiative by DPIIT, Ministry of Commerce and Industry</p>
          </div>
          <div className={styles.home__cta__section}>
            <div className={styles.home__cta__left}>
              <div className="btn__orange" style={{ cursor: "pointer" }} onClick={() => router.push("/register")}>
                <p>Register</p>
                <ArrowRightOutlined style={{ color: "white", fontSize: 18 }} />
              </div>
              <div className={styles.green__text}>
                <span>
                  <CheckOutlined />
                </span>
                <p>Instant registration</p>
              </div>
              <p>For Manufacturer</p>
              <p>Start here to join as a manufacturer</p>
            </div>
            <div className={styles.home__cta__right}>
              <div
                className={styles.btn}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (org != null) {
                    router.push("/create-application");
                  } else {
                    router.push("/login");
                  }
                }}
              >
                Add Products
              </div>
              <div className={styles.green__text}>
                <span>
                  <CheckOutlined />
                </span>
                <p>In 3 easy steps</p>
              </div>

              <p>Apply Online</p>
              <p>Click here to add products if you are already registered as a manufacturer</p>
            </div>
          </div>
        </div>
        <div className={styles.home__gallery}>
          <div className={styles.item1}>
            <img src={baseImagesPath + "MB1.jpg"} alt="" />
          </div>
          <div className={styles.item2}>
            <img src={baseImagesPath + "MB2.jpeg"} alt="" />
          </div>
          <div className={styles.item3}>
            <img src={baseImagesPath + "MB3.jpeg"} alt="" />
          </div>
          <div className={styles.item4}>
            <img src={baseImagesPath + "MB9.jpg"} alt="" />
          </div>
          <div className={styles.item5}>
            <img src={baseImagesPath + "MB5.jpg"} alt="" />
          </div>
          <div className={styles.item6}>
            <img src={baseImagesPath + "MB12.jpeg"} alt="" />
          </div>
          <div className={styles.item7}>
            <img src={baseImagesPath + "MB7.jpg"} alt="" />
          </div>
        </div>
      </div>
      <Testimonials />
      {/* <div className={styles.brands}>
        <h4>Brands that are ‘Made in India’</h4>
        <div>
          <img src={baseImagesPath + "google.png"} alt="" />
          <img src={baseImagesPath + "google.png"} alt="" />
          <img src={baseImagesPath + "google.png"} alt="" />
          <img src={baseImagesPath + "google.png"} alt="" />
          <img src={baseImagesPath + "google.png"} alt="" />
          <img src={baseImagesPath + "google.png"} alt="" />
        </div>
      </div> */}
      <Products />
      {/* <div className={styles.stats__container}>
        <div className={styles.stats__header}>
          <div> */}
      {/* <img src={baseImagesPath + "logo.svg"} alt="" /> */}
      {/* <h3>Made in India, Making a difference</h3>
          </div>
          <h4>"Unleashing the Power of Indian Manufacturing to the World"</h4>
        </div> */}

      {/* <div className={styles.stats__footer}>
          <div className={styles.stats__footer__col}>
            <span>
              <img src={baseImagesPath + "flag.png"} alt="" />
            </span>
            <p>34M</p>
            <p>Products</p>
          </div>
          <div className={styles.stats__footer__col}>
            <span>
              <img src={baseImagesPath + "person.png"} alt="" />
            </span>
            <p>208K</p>
            <p>Lable issued</p>
          </div>
          <div className={styles.stats__footer__col}>
            <span>
              <img src={baseImagesPath + "people.png"} alt="" />
            </span>
            <p>31K</p>
            <p>Manufactures</p>
          </div>
        </div>
      </div> */}
      {/* <SuccessStories /> */}
      <FAQS />
      <Modal
        width={750}
        centered={true}
        closable={false}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        okText="Continue"
        footer={[
          <Button key="continue" type="primary" onClick={handleContinue}>
            Close
          </Button>,
        ]}
      >
        <div className={styles.apply__header} style={{ marginBottom: 20 }}>
          <span />
          <p style={{ fontSize: 24 }}>Fraud Alert</p>
          <div>
            <p className={styles.modalHeading}>
              Fraud Alert: Protect Yourself from Misuse of Made in India Label and Ponzi Schemes.
            </p>
            <p className={styles.modalHeading}>
              This alert aims to caution the public and manufacturers against fraudulent schemes related to the Made in
              India Label, Ponzi schemes, and deceptive practices associated with claiming the Made in India Label. It's
              crucial to remain vigilant and informed to avoid falling victim to such fraudulent activities.
            </p>
          </div>
          <div className={styles.modalPoints}>
            <ol>
              <li>
                <b> Beware of False Made in India Claims:</b>
                Be cautious of products displaying a counterfeit Made in India Label, implying an incorrect origin of
                the product. Always verify the authenticity of the label and the product's true origin.
              </li>
              <li>
                <b>Avoid Ponzi Schemes:</b>
                Exercise caution when approached with investment opportunities linked to the Made in India label. Ponzi
                schemes often exploit the label to deceive individuals into making investments that are misleading and
                potentially harmful.
              </li>
              <li>
                <b>Verify Legitimate Investment Opportunities:</b>
                Before investing in any venture linked to the Made in India Label, conduct thorough research to ensure
                the opportunity is genuine, legal, and transparent.
              </li>
              <li>
                <b>Report Suspicious Activity: </b>
                If you come across fraudulent usage of the Made in India Label, Ponzi schemes, or requests for fees
                associated with the label, report such activities on madeinindia@qcin.org.
              </li>
            </ol>
            <p className={styles.modalHeading}>
              Together, let's tackle misleading actions linked to the Made in India Label. By staying informed and
              alert, we can shield our consumers and businesses from deceit and uphold the true essence of the Made in
              India Label.
            </p>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

const Testimonials = () => {
  return (
    <div style={{ background: "#f9fbfe" }}>
      <Carousel
        autoPlay={true}
        showArrows={false}
        showStatus={false}
        interval={5000}
        infiniteLoop={true}
        style={{ background: "#f9fbfe", paddingTop: 10 }}
      >
        <div className={styles.testimonials__container}>
          <div className={styles.testimonials__left}>
            <h3>
              “If there’s a 'Made in India' product on any table in the world, the world should have confidence that
              there is nothing better than this. This will be ultimate. Be it our product, our services, our words, our
              institutions, or our decision-making processes, everything will be supreme. Only then can we carry forward
              the essence of excellence.”
            </h3>
            <div>
              <p>Shri Narendra Modi</p>
              <p>Prime Minister of India</p>
            </div>
          </div>
          <div className={styles.testimonials__right}>
            <div>
              <img src={baseImagesPath + "namo.jpg"} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.testimonials__container}>
          <div className={styles.testimonials__left}>
            <h3>“Our talented artisans, craftsmen and entrepreneurs deserve to be supported and promoted.”</h3>
            <div>
              <p>Shri Piyush Goyal</p>
              <p>Commerce and Industry Minister of India</p>
            </div>
          </div>
          <div className={styles.testimonials__right}>
            <div>
              <img src={baseImagesPath + "pg.jpg"} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.testimonials__container}>
          <div className={styles.testimonials__left}>
            <h3>“India to become world’s number one producer of steel.”</h3>
            <div>
              <p>Shri Jyotiraditya Scindia</p>
              <p> Steel Minister of India</p>
            </div>
          </div>
          <div className={styles.testimonials__right}>
            <div>
              <img src={baseImagesPath + "pilot.jpg"} alt="" />
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

const Products = () => {
  const ProductCard = () => {
    return (
      <div className={styles.productCard}>
        <img src={baseImagesPath + "product-steel.jpeg"} alt="" />
        <div className={styles.productDetails}>
          <div>
            <p>Iron and steel</p>
            <p>Description</p>
          </div>
          {/* <span>Details</span> */}
        </div>
      </div>
    );
  };
  return (
    <div className={styles.products__container}>
      <div className={styles.products__title__container}>
        <h2>Products</h2>
        {/* <span>
          <p>See All</p>
          <ArrowRightOutlined />
        </span> */}
      </div>
      <div className={styles.productCard__container}>
        <ProductCard />
      </div>
    </div>
  );
};

const SuccessStories = () => {
  const SuccessCard = () => {
    return (
      <div className={styles.successCard}>
        <div className={styles.successCard__header}>
          <img
            src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/mandy.jpg"
            alt=""
          />
          <div>
            <p>Jaquon Hart</p>
            <p>VP Manager - Lizlle Company</p>
          </div>
        </div>
        <p className={styles.successCard__review}>
          “We belief was that if we kept putting great products in front of customers, that are made in India, we will
          achieve“
        </p>
      </div>
    );
  };

  const SocialCard = () => {
    return (
      <div className={styles.socialCard}>
        <div className={styles.socialCard__header}>
          <span>
            <img
              src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/mandy.jpg"
              alt=""
            />
            <p>Mandy Music</p>
          </span>
          <p>3d ago</p>
        </div>
        <div className={styles.socialCard__post}>
          <img
            src="https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/mandy.jpg"
            alt=""
          />
        </div>
        <div className={styles.socialCard__footer}>
          <p>Made in India Label is the fastest adopted an most sought after logo preferred by Indian masses</p>
          <div className={styles.socialCard__footer__icons}>
            <div>
              <span>
                <LikeFilled />
                <p>123</p>
              </span>
              <span>
                <img src={baseImagesPath + "Chat.svg"} alt="" />
                <p>21K</p>
              </span>
            </div>
            <TwitterOutlined style={{ color: "#00B8D9", fontSize: 20 }} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className={styles.success__container}>
      <p>Success stories</p>
      <h3>People who, Made in India</h3>
      <div className={styles.successCard__container}>
        <SuccessCard />
        <SuccessCard />
        <div className={styles.frwdArrow}>
          <ArrowRightOutlined />
        </div>
      </div>
      <div className={styles.socialCard__container}>
        <SocialCard />
        <SocialCard />
        <SocialCard />
      </div>
    </div>
  );
};

const FAQS = () => {
  const { Panel } = Collapse;
  return (
    <div className={styles.faqs__container}>
      <h2>Frequently asked questions</h2>

      <div className={styles.collapse__container}>
        <Collapse defaultActiveKey={["1"]} className={styles.collapse}>
          <Panel
            className={styles.panel}
            showArrow={false}
            destroyInactivePanel={true}
            header="What is the Scheme for Made In India?"
            key="1"
            extra={<p style={{ fontSize: 26 }}>{true ? "+" : "HIDE"}</p>}
          >
            <p>
              The Scheme for Made in India is a step towards building a robust, self-sustaining machinery to create
              brand value for Indian-made products. This is a voluntary certification scheme to help manufacturers
              demonstrate that their products originate in India and are of good quality.
            </p>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={["2"]} className={styles.collapse}>
          <Panel
            className={styles.panel}
            showArrow={false}
            destroyInactivePanel={true}
            header="What is the objective of the Scheme for Made in India Label?"
            key="1"
            extra={<p style={{ fontSize: 26 }}>{true ? "+" : "HIDE"}</p>}
          >
            <p>
              The Scheme for Made in India Label aims to promote and encourage the production of goods within India,
              fostering domestic industries, and providing consumers with clear information about the origin of their
              purchases.
            </p>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={["2"]} className={styles.collapse}>
          <Panel
            className={styles.panel}
            showArrow={false}
            destroyInactivePanel={true}
            header="Who is eligible to use the Made in India Label on their products?"
            key="1"
            extra={<p style={{ fontSize: 26 }}>{true ? "+" : "HIDE"}</p>}
          >
            <p>
              Manufacturers and producers who manufacture or assemble their products wholly or substantially in India
              are eligible to use the Label. Please refer the Scheme guidelines for detailed criteria for eligibility.
            </p>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={["2"]} className={styles.collapse}>
          <Panel
            className={styles.panel}
            showArrow={false}
            destroyInactivePanel={true}
            header="How can manufacturers obtain the Made in India Label for their products?"
            key="1"
            extra={<p style={{ fontSize: 26 }}>{true ? "+" : "HIDE"}</p>}
          >
            <p>
              Manufacturers can apply online through the official portal, submitting the required documents and product
              details. After verification and approval, they will be granted permission to use the Label on their
              products.
            </p>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={["2"]} className={styles.collapse}>
          <Panel
            className={styles.panel}
            showArrow={false}
            destroyInactivePanel={true}
            header="Are there any specific standards or criteria a product must meet to qualify for the Made in India Label?"
            key="1"
            extra={<p style={{ fontSize: 26 }}>{true ? "+" : "HIDE"}</p>}
          >
            <p>
              Yes, products must meet certain quality and manufacturing standards set by relevant regulatory bodies in
              India. The specific criteria may vary depending on the product category.
            </p>
          </Panel>
        </Collapse>
        <Collapse defaultActiveKey={["2"]} className={styles.collapse}>
          <Panel
            className={styles.panel}
            showArrow={false}
            destroyInactivePanel={true}
            header="Will imported components used in manufacturing affect the eligibility of a product for the Made in India Label?"
            key="1"
            extra={<p style={{ fontSize: 26 }}>{true ? "+" : "HIDE"}</p>}
          >
            <p>
              The use of imported components is allowed, but the product should be substantially manufactured or
              assembled in India. The exact percentage or criteria of domestic content will be sector specific and the
              same shall be outlined in the Scheme's guidelines.
            </p>
          </Panel>
        </Collapse>
      </div>

      {/* <div className={styles.faqs__footer}>
        <h3>Still have a questions?</h3>
        <p>
          If you cannot find answer to your question in our FAQ, you can always
          contact us. We wil answer to you shortly!
        </p>
      </div> */}

      {/* <div className={styles.help__container}>
        <div className={styles.helpCard}>
          <span>
            <img src={baseImagesPath + "phone.svg"} alt="" />
          </span>
          <p>+91 (646) 786-5060</p>
          <p>We are always happy to help.</p>
        </div>
        <div className={styles.helpCard}>
          <span>
            <img src={baseImagesPath + "call_support.svg"} alt="" />
          </span>
          <p>support@helpcenter.com</p>
          <p>Alternative way to get anwser faster.</p>
        </div>
      </div> */}
    </div>
  );
};

export default Home;

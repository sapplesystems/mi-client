import React, { useState } from "react";
import styles from "../../styles/Header.module.scss";
import Logo from "../../assets/logo.svg";
import Link from "next/link";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { useRouter } from "next/router";
import { getOrgDetails } from "../../utils/helper";

const baseImagesPath =
  "https://denb1qwtms1e4.cloudfront.net/warehouses/public_gallery/gallery/images/make_in_india/";
const languages = ["English", "Hindi"];
const Header = () => {
  const [lng, setLng] = useState(languages);
  const handleLanguageChange = (value) => setLng(value);
  const router = useRouter();
  const [org, setOrg] = useState(null);

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

  return (
    <>
      <div className={styles.header__gray}>
        <div className={styles.header__left}>
          {/* <Select
            bordered={false}
            className={styles.header__select}
            defaultValue={languages[0]}
            style={{
              width: 120,
            }}
            onChange={handleLanguageChange}
            options={languages.map((lng) => ({
              label: lng,
              value: lng,
            }))}
          /> */}
          {/* <div className={styles.divider} />
          <div className={styles.header__fonts}>
            <p>Font size</p>
            <p>A-</p>
            <p>A</p>
            <p>A+</p>
          </div> */}
        </div>
        <div className={styles.header__right}>
          <Link href="/contact-us" target="_blank">
            <p>Raise a ticket</p>
          </Link>
          <div className={styles.divider} />
          <span>
            <p>Need Help?</p>
            <DownOutlined />
          </span>
        </div>
      </div>
      <div className={styles.header__container}>
        <div className={styles.header__logo}>
          {/* <img src={baseImagesPath+'logo.svg'} />
           */}
          <Link href="/" className={styles.header__link}>
            <p>Made in India</p>
          </Link>
        </div>
        <div className={styles.header__content}>
          {/* <div className={styles.header__input}>
            <input placeholder="Search products / HSN codes" />
            <SearchOutlined />
          </div> */}
          <Link href="/about-us" className={styles.header__link}>
            About Made in India
          </Link>
          {org ? (
            <div
              className={styles.header__btn}
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Sign out
            </div>
          ) : (
            <div
              className={styles.header__btn}
              onClick={() => router.push("/login/")}
            >
              Sign in
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

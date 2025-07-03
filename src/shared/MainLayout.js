import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Logo from "../../assets/logo.svg";
import Home from "../../assets/home.svg";
import Team from "../../assets/team.svg";
import Organization from "../../assets/organization.svg";
import Product from "../../assets/product.svg";
import { Avatar, Button, Dropdown, Input, Modal, message } from "antd";
import apiRequest, { signOut } from "../../utils/request.js";
import Promotion from "../../assets/promotion.svg";
import useIdleTimeout from "../utils/useIdleTimeout";
import Profile from "../../assets/profile-circled.svg";
import styles from "../../styles/MainLayout.module.scss";
import { UserOutlined } from "@ant-design/icons";
import { is_applicant } from "../../utils/roles.js";
import ReCAPTCHA from "react-google-recaptcha";

const MainLayout = ({ children }) => {
  const captchaRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();
  const { pathname } = router;

  const logout = () => signOut(false);
  const { isIdle } = useIdleTimeout({
    idleTime: process.env.NEXT_PUBLIC_SESSION_TIMEOUT,
    handleIdle: logout,
  });

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};
  const is_superuser = user?.is_superuser;

  const RoleLabel = {
    super_admin: "Super Admin",
    admin: "Admin",
    supervisor: "Supervisor",
    ministry: "Ministry",
    applicant: "Applicant",
  };

  const getRoleLabel = (role) => {
    return RoleLabel[role];
  };

  const items = [
    {
      key: 0,
      disabled: true,
      label: <div>{getRoleLabel(user?.role)}</div>,
    },
    {
      key: "1",
      label: <div onClick={() => setResetModalVisibility(true)}>Reset password</div>,
    },
    {
      key: "2",
      label: <div onClick={() => signOut()}>Sign Out</div>,
    },
  ];

  const [resetModalVisibility, setResetModalVisibility] = useState(false);
  const [password, setPassword] = useState({
    p1: "",
    p2: "",
    old_password: "",
  });

  const resetPassword = () => {
    const url = "/api/v1/reset-password/";
    const data = {
      email: user.email,
      old_password: password.old_password,
      password1: password.p1,
      password2: password.p2,
      token: captchaRef.current,
    };

    apiRequest({ method: "POST", url, data })
      .then((res) => {
        message.success(res.data.msg);
        setPassword({ p1: "", p2: "", old_password: "" });
        setResetModalVisibility(false);
      })
      .catch((error) => {
        message.error(error.data.error);
      })
      .finally(() => {
        window.grecaptcha.reset();
        setIsVerified(false);
      });
  };

  const sideBar = () => {
    if (user?.role === "super_admin") {
      return (
        <div className={styles.sidebar__container}>
          <span className={pathname == "/team" && styles.active}>
            <Link href="/team">
              <Image src={Team} alt="" />
            </Link>
          </span>
          <span className={pathname == "/products" && styles.active}>
            <Link href="/products">
              <Image src={Product} alt="" />
            </Link>
          </span>
          <span className={pathname == "/organizations" && styles.active}>
            <Link href="/organizations">
              <Image src={Organization} alt="" />
            </Link>
          </span>
          <span className={pathname == "/home" && styles.active}>
            <Link href="/home">
              <Image src={Home} alt="" />
            </Link>
          </span>
        </div>
      );
    } else {
      return (
        <div className={styles.sidebar__container}>
          <span className={pathname == "/home" && styles.active}>
            <Link href="/home">
              <Image src={Home} alt="" />
            </Link>
          </span>
          {is_applicant(user?.role) && (
            <span className={pathname == "/settings" && styles.active}>
              <Link href="/settings">
                <Image src={Promotion} alt="" />
              </Link>
            </span>
          )}
          {is_applicant(user?.role) && (
            <span className={pathname == "/profile" && styles.active}>
              <Link href="/profile">
                <Image src={Profile} alt="" />
              </Link>
            </span>
          )}
        </div>
      );
    }
  };

  return (
    <div className={styles.main__container}>
      {sideBar()}
      <div className={styles.main__content}>
        <div className={styles.header__container}>
          <Image className={styles.header__logo} src={Logo} alt="" />

          <div>
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomRight"
              overlayStyle={{ width: 170 }}
              trigger={["click"]}
            >
              <div className={styles.header__pic} style={{ cursor: "pointer" }}>
                <Avatar size="large" icon={<UserOutlined />} />
              </div>
            </Dropdown>
          </div>
        </div>
        <div className={styles.children__container}>{children}</div>
      </div>
      <Modal centered={true} closable={false} closeIcon={null} open={isIdle} footer={null}>
        <p style={{ fontSize: 16, textAlign: "center", color: "#FF4D4E" }}>
          Your session has expired due to 30 minutes of inactivity.
          <br />
          Please log in again to continue.
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
          <Link href="/login">
            <Button type="link" block>
              Login
            </Button>
          </Link>
        </div>
      </Modal>

      <Modal centered={true} closable={false} closeIcon={null} open={resetModalVisibility} footer={null}>
        <p style={{ fontSize: 24, marginBottom: 20 }}>Reset Password</p>

        <p style={{ fontSize: 14, marginBottom: 4 }}>Enter your existing password</p>
        <Input.Password
          style={{ marginBottom: 14 }}
          placeholder="Enter your existing password"
          value={password.old_password}
          onChange={(e) => setPassword({ ...password, old_password: e.target.value })}
        />

        <p style={{ fontSize: 14, marginBottom: 4 }}>Enter new password</p>
        <Input.Password
          style={{ marginBottom: 10 }}
          placeholder="Enter new password"
          value={password.p1}
          onChange={(e) => setPassword({ ...password, p1: e.target.value })}
        />

        <p style={{ fontSize: 14, marginBottom: 4 }}>Confirm password</p>
        <Input.Password
          style={{ marginBottom: 20 }}
          placeholder="Confirm password"
          value={password.p2}
          onChange={(e) => setPassword({ ...password, p2: e.target.value })}
        />

        <ReCAPTCHA
          style={{ marginBottom: 14 }}
          ref={captchaRef}
          sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
          onChange={(response) => {
            if (response) {
              captchaRef.current = response;
              setIsVerified(true);
            }
          }}
          onExpired={(response) => {
            setIsVerified(false);
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button style={{ marginRight: 10 }} onClick={() => setResetModalVisibility(false)}>
            Cancel
          </Button>
          <Button
            type="primary"
            disabled={password.p1 === "" || password.p1 != password.p2 || password.old_password === "" || !isVerified}
            onClick={resetPassword}
          >
            Reset password
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MainLayout;

import { useEffect, useRef, useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Modal, message } from "antd";
import Link from "next/link";
import React from "react";
import styles from "../../styles/Auth.module.scss";
import apiRequest, { login, isLoggedIn } from "../../utils/request.js";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { getOrgDetails } from "../../utils/helper";

const Signin = () => {
  const captchaRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [loggedIn, setLoggedIn] = useState(null);
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (username?.length > 0 && password?.length > 0 && isVerified == true) {
      setLoginDisabled(false);
    } else {
      setLoginDisabled(true);
    }
  }, [username, password, isVerified]);

  useEffect(() => {
    if (isLoggedIn()) {
      routeToLandingPage();
    } else {
      setLoggedIn(false);
    }
    if (username?.length > 0 && password?.length > 0) {
      setLoginDisabled(false);
    } else {
      setLoginDisabled(true);
    }
  }, []);

  const getUser = async () => {
    let user = apiRequest({
      method: "GET",
      url: "/api/v1/get-user/",
    })
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify({ ...resp.data }));
        return resp.data;
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
    return user;
  };

  const routeToLandingPage = () => {
    const user_role = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user"))?.role : "";
    if (user_role === "super_admin") {
      router.push("/team");
    } else if (user_role === "org_admin") {
      apiRequest({ url: "/api/v1/org-details/", method: "GET" })
        .then((resp) => {
          router.push("/home");
        })
        .catch((error) => {
          router.push({ pathname: "/register", query: { step: 4 } });
        });
    } else {
      router.push("/home");
    }
  };

  const handleLogin = () => {
    login(username.trim().toLowerCase(), password, captchaRef.current)
      .then((resp) => {
        getUser().then((resp) => {
          routeToLandingPage();
        });
      })
      .catch((error) => {
        message.error(error?.response?.data?.detail);
      })
      .finally(() => {
        window.grecaptcha.reset();
        setIsVerified(false);
      });
  };

  if (loggedIn == null) {
    return null;
  }

  return (
    <div className={styles.auth__container}>
      <div className={styles.auth__left}></div>
      <div className={styles.auth__right}>
        <div className={styles.backBtn}>
          <p
            className={styles.logout}
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
          >
            Home
          </p>
        </div>
        <div className={styles.auth__link}>
          <p>
            Not a member?
            <Link href="/register">
              <b> Sign up</b>
            </Link>
          </p>
        </div>
        <div className={styles.auth__right__content}>
          <h2>Sign-in</h2>
          <Divider />
          <h4>Enter email address</h4>
          <Input
            prefix={<MailOutlined />}
            placeholder="Your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <h4 style={{ marginTop: 20 }}>Enter password</h4>
          <Input
            type="password"
            value={password}
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <ReCAPTCHA
            style={{ marginTop: 18 }}
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
          {/* loginDisabled */}
          <Button type="primary" disabled={false} onClick={handleLogin}>
            Login
          </Button>
          <p>This site is protected by reCAPTCHA and the Google Privacy Policy.</p>
          <Link href="/forget-password">
            <p className={styles.auth__forget}>Forget password</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;

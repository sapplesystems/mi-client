import Link from "next/link";
import React, { useRef, useState } from "react";
import styles from "../styles/Auth.module.scss";
import { Button, Divider, Input, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import AuthCode from "react-auth-code-input";
import apiRequest from "../utils/request.js";
import ReCAPTCHA from "react-google-recaptcha";
import { isEmailValid } from "../utils/validation.js";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState();
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();

  const captchaRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);

  const renderEmailStep = () => {
    return (
      <div>
        <h2 className={styles.forget_password__heading}>Forget Password?</h2>
        <Divider />
        <h4 className={styles.forget_password__subHeading}>Just enter your email below to get a password reset link</h4>
        <Input
          key="email_input"
          id="email_input"
          prefix={<MailOutlined />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className={styles.input__gray}
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
      </div>
    );
  };

  const renderOtpStep = () => {
    return (
      <div>
        <h2>Verify Code</h2>
        <Divider />
        <h4>We just send you a verify code on your email. Check your inbox and enter below</h4>
        <AuthCode
          containerClassName={styles.otp__container}
          inputClassName={styles.opt__inputs}
          value={otp}
          onChange={(e) => setOtp(e)}
          length={4}
        />
      </div>
    );
  };

  const renderSetPasswordStep = () => {
    return (
      <div>
        <h2>Set Password</h2>
        <Divider />
        <h4>Enter Password</h4>
        <Input
          type="password"
          prefix={<LockOutlined />}
          placeholder="Enter password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        <h4 style={{ marginTop: 20 }}>Confirm Password</h4>
        <Input
          type="password"
          prefix={<LockOutlined />}
          placeholder="Re-enter password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </div>
    );
  };

  const callGetVerificationCode = () => {
    apiRequest({ method: "POST", url: "/api/v1/send-verification-code/", data: { email } })
      .then((resp) => {
        setStep(step + 1);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const handleEmailContinue = () => {
    apiRequest({ method: "GET", url: `/api/v1/check-user/?email=${email}&token=${captchaRef.current}` })
      .then((resp) => {
        callGetVerificationCode();
      })
      .catch((error) => {
        if (error.status == 403) {
          message.error("Invalid captcha");
        }

        if (error.status == 400) {
          message.error(error?.data?.error);
        }
      })
      .finally(() => {
        window.grecaptcha.reset();
        setIsVerified(false);
      });
  };

  const handleOtpVerification = () => {
    apiRequest({ method: "POST", url: `/api/v1/check-verification-code/`, data: { email, code: otp } })
      .then((resp) => {
        setStep(step + 1);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const handleSetPassword = () => {
    apiRequest({ method: "POST", url: `/api/v1/set-password/`, data: { email, password1, password2, code: otp } })
      .then((resp) => {
        message.success(
          <>
            Your password is updated successfully! Please <a href="/login/">click here</a> to login
          </>,
          10
        );
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const handleContinue = () => {
    if (step == 1) {
      handleEmailContinue();
    }
    if (step == 2) {
      handleOtpVerification();
    }
    if (step == 3) {
      handleSetPassword();
    }
  };

  const checkDisabled = () => {
    if (step == 1) {
      if (email.length == 0) return true;
      if (!isEmailValid(email)) return true;
      if (!isVerified) return true;
    }
  };

  return (
    <div className={styles.auth__container}>
      <div className={styles.auth__left}></div>
      <div className={styles.auth__right}>
        <div className={styles.auth__link}>
          <p>
            Already a member?
            <Link href="/login">
              <b> Sign in</b>
            </Link>
          </p>
        </div>
        <div className={styles.auth__right__content}>
          {step == 1 ? renderEmailStep() : step === 2 ? renderOtpStep() : renderSetPasswordStep()}
          <Button type="primary" onClick={handleContinue} disabled={checkDisabled()}>
            Continue
          </Button>
          <p>This site is protected by reCAPTCHA and the Google Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

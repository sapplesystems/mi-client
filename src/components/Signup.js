import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import AuthCode from "react-auth-code-input";

import { Button, Checkbox, Divider, Input, Modal, Select, message, Upload, Row } from "antd";

import styles from "../../styles/Auth.module.scss";
import { LockOutlined, MailOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import apiRequest, { BASE_URL, isLoggedIn } from "../../utils/request.js";
import DynamicTable from "../shared/DynamicTable.js";
import { getStateOptions } from "../constants/location_mapping.js";
import { withRouter } from "next/router";
import { checkEmpty, isEmailValid, isPANValid, isPhoneNoValid } from "../../utils/validation";
import ReCAPTCHA from "react-google-recaptcha";
import { getOrgDetails, getUser } from "../../utils/helper";
import PartnerDetails from "./Profile/PartnerDetails.js";
import BranchDetails from "./Profile/BranchDetails.js";
import { is_applicant } from "../../utils/roles.js";

const formConfig = {
  company_details: {
    section: "Company Details",
    canAddMoreFields: false,
    inputFields: [
      {
        name: "Registered Company Name",
        value: "",
        type: "input",
        tooltipText: false,
        key: "registered_company_name",
        required: true,
        placeholder: "e.g. - Quality Council of India - Delhi",
      },
      {
        name: "Company Address",
        value: "",
        type: "input",
        tooltipText: false,
        key: "company_address",
        required: true,
      },
      {
        name: "Company Email Address",
        value: "",
        type: "input",
        tooltipText: false,
        key: "email",
        required: true,
      },
      {
        name: "Mobile Number",
        value: "",
        type: "input",
        tooltipText: false,
        key: "mobile_number",
        required: true,
      },
      {
        name: "GSTN/Udhyam ID",
        value: "",
        type: "input",
        tooltipText: false,
        key: "gst_number",
        title: "GSTN/Udhyam ID",
        required: true,
      },
      {
        name: "PAN",
        value: "",
        type: "input",
        tooltipText: false,
        key: "pan_no",
        required: true,
      },
      {
        name: "TAN",
        value: "",
        type: "input",
        tooltipText: false,
        key: "tan_no",
        required: true,
      },
      {
        name: "Company website",
        value: "",
        type: "input",
        tooltipText: false,
        key: "company_website",
      },
      {
        name: "",
        value: "",
        type: "upload",
        tooltipText: false,
        key: "logo_url",
        file_upload_category: "Org_Logo",
        upload_type: "public",
      },
    ],
  },
  partner_details: {
    section: "Partners/Directors Details",
    canAddMoreFields: true,
    canAddMoreText: "Add more partners",
    inputFields: [
      {
        title: "Sr. No.",
        name: "Sr. No.",
        value: "",
        type: "input",
        tooltipText: false,
        key: "sr_no",
        required: true,
      },
      {
        title: "Name",
        name: "Name",
        value: "",
        type: "input",
        tooltipText: false,
        key: "name",
        required: true,
      },
      {
        title: "Mobile Number",
        name: "Mobile Number",
        value: "",
        type: "input",
        tooltipText: false,
        key: "mobile_number",
        required: true,
      },
      {
        title: "Email Address",
        name: "Email Address",
        value: "",
        type: "input",
        tooltipText: false,
        key: "email",
        required: true,
      },
      {
        title: "Designation",
        name: "Designation",
        value: "",
        type: "input",
        tooltipText: false,
        key: "designation",
        required: false,
      },
    ],
  },
  branch_details: {
    section: "Branch/Unit Details",
    canAddMoreFields: true,
    canAddMoreText: "Add more branches",
    inputFields: [
      {
        name: "Branch Address",
        value: "",
        type: "input",
        tooltipText: false,
        key: "branch_address",
        title: "Branch Address",
        required: true,
      },
      {
        name: "GSTN/Udhyam ID",
        value: "",
        type: "input",
        tooltipText: false,
        key: "identification_id",
        title: "GSTN/Udhyam ID",
        required: true,
      },
      {
        name: "State",
        value: "",
        type: "select",
        tooltipText: false,
        key: "state",
        title: "State",
        required: true,
        options: getStateOptions(),
      },
    ],
  },
};

const Signup = (props) => {
  const router = useRouter();
  const captchaRef = useRef(null);
  const [email, setEmail] = useState("");
  const [privacyTerms, setPrivacyTerms] = useState(false);
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [companyDetails, setCompanyDetails] = useState({});
  const [partnerDetails, setPartnerDetails] = useState([]);
  const [branchDetails, setBranchDetails] = useState([]);
  const [step, setStep] = useState(null);
  const [otp, setOtp] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newField, setNewField] = useState({
    name: "",
    value: "",
    type: "input",
    tooltipText: false,
  });

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [orgId, setOrgId] = useState(null);
  const [org, setOrg] = useState({
    orgDetails: null,
    partnerDetails: null,
    branchDetails: null,
  });

  const [fetchedBranchEmails, setFetchedBranchEmails] = useState([]);

  const [resendOtp, setResendOtp] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const getStep = async () => {
    if (props?.router?.query?.step) {
      return parseInt(props?.router?.query?.step);
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (is_applicant(user?.role) && isLoggedIn()) {
      try {
        const resp = await apiRequest({
          method: "GET",
          url: "/api/v1/org-details/",
        });
        if (resp?.status == 200) {
          return -1;
        } else {
          return 4;
        }
      } catch (error) {
        return 4;
      }
    }
    return 1;
  };

  const checkDisabled = () => {
    // for email
    if (step == 1) {
      if (privacyTerms == false) return true;
      if (email?.length > 0 && !isEmailValid(email)) return true;
      if (!isVerified) return true;
    }

    //  set password
    if (step == 3) {
      if (password1?.trim() == "" || password1 == null) return true;
      if (password1 != password2) return true;
    }

    //  company details
    if (step == 4) {
      if (Object.keys(companyDetails).length < 7) return true;
      if (checkEmpty(companyDetails)) return true;
      if (!isPhoneNoValid(companyDetails.mobile_number)) {
        return true;
      }
      if (companyDetails.email?.length > 0 && !isEmailValid(companyDetails.email)) return true;
    }
  };

  const setOrganizationDetails = (orgData) => {
    setOrgId(orgData.org.id);

    const companyDetails = orgData.org;

    let existingCompanyDetails = {};
    existingCompanyDetails = {
      registered_company_name: companyDetails.registered_company_name,
      company_address: companyDetails.company_address,
      email: companyDetails.company_email,
      mobile_number: companyDetails.mobile_number,
      gst_number: companyDetails.gst_number,
      pan_no: companyDetails.pan_no,
      tan_no: companyDetails.tan_no,
      company_website: companyDetails.company_website,
    };

    if (companyDetails.logo_url != undefined) {
      let url = companyDetails.logo_url.split("/").slice(3).join("/");
      existingCompanyDetails = {
        ...existingCompanyDetails,
        logo_url: url,
      };
    }

    setCompanyDetails(existingCompanyDetails);

    const patnerDetails = orgData.org_partners;
    if (patnerDetails && patnerDetails.length > 0) {
      setPartnerDetails(patnerDetails);
    }

    const branchDetails = orgData.org_branches;
    if (branchDetails && branchDetails.length > 0) {
      setBranchDetails(branchDetails);
    }

    setOrg({
      orgDetails: orgData.org,
      partnerDetails: orgData.org_partners,
      branchDetails: orgData.org_branches,
    });
  };

  const getBranchEmails = (details) => {
    const emails = details.map((d) => d.email);
    return emails;
  };

  useEffect(() => {
    getOrgDetails()
      .then((res) => {
        if (res.data.org_branches) {
          setFetchedBranchEmails(getBranchEmails(res.data.org_branches));
        }

        setOrganizationDetails(res.data);
      })
      .catch((error) => setOrgId(null));
  }, [step]);

  useEffect(() => {
    getStep().then((resp) => {
      if (resp === -1) {
        router.push("/home");
      } else {
        setStep(resp);
      }
    });
  }, []);

  useEffect(() => {
    setNewField({ name: "", value: "", type: "input", tooltipText: false });
  }, [isModalOpen]);

  const addField = () => {
    setIsModalOpen(false);
  };

  const renderEmailStep = () => {
    return (
      <div>
        <h2>Sign-up</h2>
        <Divider />
        <h4>Enter Email Address</h4>
        <Input
          key="email_input"
          id="email_input"
          prefix={<MailOutlined />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className={styles.input__gray}
        />
        <div className={styles.checkbox__container}>
          <Checkbox value={privacyTerms} onChange={(e) => setPrivacyTerms(e.target.checked)}>
            <p>Privacy statement accepted</p>
          </Checkbox>
        </div>
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
        <Button
          size="small"
          type="link"
          disabled={resendOtp}
          onClick={handleResendVerificationCode}
          style={{ width: "min-content", height: "min-content", marginBottom: -1, marginTop: -1 }}
        >
          Resend OTP
        </Button>
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

  const renderFormElements = (inputs, dom_state, stateHandler) => {
    return inputs.map((item) => {
      const props = {
        name: "file",
        multiple: true,
        headers: { Authorization: `Bearer ${isLoggedIn()}` },
        action: `${BASE_URL}/api/v1/upload/`,
        data: {
          file_upload_category: item.file_upload_category,
          upload_type: item.upload_type,
        },
        beforeUpload: (file) => {
          const isSVG = file.type === "image/svg+xml";
          if (!isSVG) {
            message.error(`${file.name} is not an svg file`);
          }
          return isSVG;
        },
        onChange: (info) => {
          const { status } = info.file;
          if (status === "done") {
            stateHandler({
              ...dom_state,
              [item?.key]: info.fileList[0].response.s3_url,
            });
          }

          if (status === "error") {
            message.error(`File not uploaded`);
            return;
          }
        },
      };
      return (
        <div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <h4>{item.name}</h4>
            <p style={{ marginLeft: 6, color: "red" }}>{item.required && "*"}</p>
          </div>
          {item.type === "input" ? (
            <>
              <Input
                placeholder={item.placeholder ? item.placeholder : `Enter ${item.name}`}
                style={{ marginBottom: 12 }}
                value={dom_state[item?.key]}
                onChange={(e) => stateHandler({ ...dom_state, [item?.key]: e.target.value })}
              />
            </>
          ) : item.type === "select" ? (
            <Select
              placeholder={`Select ${item.name}`}
              options={item.options}
              style={{ marginBottom: 12, width: "100%" }}
              size="large"
              value={dom_state[item?.key]}
              onChange={(selected) => stateHandler({ ...dom_state, [item?.key]: selected })}
            />
          ) : item.type === "upload" ? (
            <div style={{ marginTop: -20 }}>
              <Upload maxCount={1} {...props} item={item}>
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </Upload>
            </div>
          ) : (
            <Input.TextArea
              placeholder={item.name}
              style={{ marginBottom: 12 }}
              value={dom_state[item?.key]}
              onChange={(selected) => stateHandler({ ...dom_state, [item?.key]: selected })}
            />
          )}
        </div>
      );
    });
  };

  const renderCompanyDetails = () => {
    const company_details_config = formConfig?.company_details;
    return (
      <div>
        <h2>{company_details_config.section}</h2>
        <Divider />
        {renderFormElements(company_details_config?.inputFields, companyDetails, setCompanyDetails)}
      </div>
    );
  };

  const handlePartnerDetails = (d) => {
    setPartnerDetails([...partnerDetails, { ...d, key: String(partnerDetails.length - 1) }]);
  };

  const renderPartnerDetails = () => {
    const partner_details_config = formConfig?.partner_details;
    return (
      <div>
        <h2>{partner_details_config.section}</h2>
        <Divider />
        <PartnerDetails org={org} setOrg={setOrg} updateOrgDetails={updateOrgDetails} />
        {/* <DynamicTable
          previewOnly={false}
          key="partner"
          type="partner"
          viewType="add"
          data={partnerDetails}
          setData={(d) => setPartnerDetails(d)}
          fields={partner_details_config?.inputFields}
        /> */}
        {/* renderFormElements(partner_details_config?.inputFields, partnerDetails, setPartnerDetails) */}
      </div>
    );
  };

  const renderBranchDetails = () => {
    const branch_details_config = formConfig?.branch_details;
    return (
      <div>
        <h2>{branch_details_config.section}</h2>
        <Divider />
        <BranchDetails org={org} setOrg={setOrg} updateOrgDetails={updateOrgDetails} />
        {/* <DynamicTable
          previewOnly={false}
          key="branch"
          type="branch"
          viewType="add"
          data={branchDetails}
          setData={(d) => setBranchDetails(d)}
          fields={branch_details_config?.inputFields}
        /> */}
        {/*renderFormElements(branch_details_config?.inputFields, branchDetails, setBranchDetails)*/}
      </div>
    );
  };

  const Step4 = () => {
    return (
      <div>
        <h2>{step >= 4 && formConfig[step - 4]?.section}</h2>
        <Divider />
        {step >= 4 &&
          formConfig[step - 4].inputFields.map((item) => {
            return (
              <div>
                {/* <RenderInput
                  item={item}
                  inputs={inputs}
                  setInputs={setInputs}
                  handleChange={handleChange}
                  styles={{
                    input: styles.input,
                    textArea: styles.textArea,
                    select: styles.select,
                    select_bordered: true,
                  }}
                /> */}
                <h4>{item.name}</h4>
                {item.type === "input" ? (
                  <Input placeholder={`Enter ${item.name}`} style={{ marginBottom: 12 }} />
                ) : item.type === "select" ? (
                  <Select
                    placeholder={`Select ${item.name}`}
                    options={item.options}
                    style={{ marginBottom: 12, width: "100%" }}
                    size="large"
                  />
                ) : (
                  <Input.TextArea placeholder={item.name} style={{ marginBottom: 12 }} />
                )}
              </div>
            );
          })}
        {step >= 4 && formConfig[step - 4]?.canAddMoreFields && (
          <Button icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            {formConfig[step - 4]?.canAddMoreText}
          </Button>
        )}
      </div>
    );
  };

  const callGetVerificationCode = () => {
    apiRequest({
      method: "POST",
      url: "/api/v1/send-verification-code/",
      data: { email: email.trim().toLowerCase() },
    })
      .then((resp) => {
        setStep(step + 1);
      })
      .catch((error) => {
        if (error.status === 409) {
          message.warning(error.data.msg);
          setStep(step + 1);
        } else {
          message.error(error?.data?.error);
        }
      });
  };

  const handleEmailContinue = () => {
    setLoading(true);
    apiRequest({
      method: "GET",
      url: `/api/v1/check-user/?email=${encodeURIComponent(email.trim().toLowerCase())}&token=${captchaRef.current}`,
    })
      .then((resp) => {
        message.success(
          <>
            Username exists! Click{" "}
            <u>
              <a href="/login/">here</a>
            </u>{" "}
            to login
          </>,
          10
        );
      })
      .catch((error) => {
        if (error.status == 400) {
          callGetVerificationCode();
        }

        if (error.status == 403) {
          message.error("Invalid captcha");
        }
      })
      .finally(() => {
        window.grecaptcha.reset();
        setIsVerified(false);
        setLoading(false);
      });
  };

  const handleOtpVerification = () => {
    apiRequest({
      method: "POST",
      url: `/api/v1/check-verification-code/`,
      data: { email: email.trim().toLowerCase(), code: otp },
    })
      .then((resp) => {
        setStep(step + 1);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const handleResendVerificationCode = () => {
    apiRequest({
      method: "POST",
      url: `/api/v1/resend-verification-code/`,
      data: { email: email.trim().toLowerCase() },
    })
      .then((resp) => {
        setResendOtp(true);
        message.success("OTP has been sent to your email ID!");
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const handleSetPassword = () => {
    apiRequest({
      method: "POST",
      url: `/api/v1/set-password/`,
      data: {
        email: email.trim().toLowerCase(),
        password1,
        password2,
        code: otp,
      },
    })
      .then((resp) => {
        message.success("Your password is updated successfully!");
        router.push("/login");
        //   login(email.trim().toLowerCase(), password1).then((resp) => {
        //     setStep(step + 1);
        //   });
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const formatErrors = (error) => {
    const error_msgs = Object.values(error)?.map((e) => {
      return e[0];
    });
    return (
      <p style={{ textAlign: "center" }}>
        Failed to register organization due to following reasons: <br />
        {error_msgs?.map((e) => (
          <Row style={{ textAlign: "center" }}>{e}</Row>
        ))}
      </p>
    );
  };

  const handleRegisterOrg = () => {
    let data = {
      ...companyDetails,
      pan_no: companyDetails.pan_no.toUpperCase(),
      partners: partnerDetails,
      branches: branchDetails,
    };

    apiRequest({ method: "POST", url: `/api/v1/register/`, data })
      .then((resp) => {
        message.success("Your Company is registered successfully!");
        setStep(step + 1);
        setOrgId(resp.data.org_id);
        //   getUser().then((resp) => {
        //     router.push("/home");
        //   });
      })
      .catch((error) => {
        if (error?.status == 400) {
          message.error(formatErrors(error?.data), 4);
        } else {
          message.error(error?.data?.error);
        }
      });
  };

  const handleUpdateOrg = (id) => {
    const url = `api/v1/update-org/${id}/`;

    let companyEmail = companyDetails.email;
    delete companyDetails["email"];

    let data = {
      org: {
        ...companyDetails,
        pan_no: companyDetails.pan_no.toUpperCase(),
        company_email: companyEmail,
      },
    };

    //  delete data[org][email];

    if (partnerDetails && partnerDetails.length > 0) {
      let newPartnerDetails = partnerDetails.map((obj) => {
        const { key, ...newObject } = obj;
        return newObject;
      });

      data = {
        ...data,
        org_partners: newPartnerDetails,
      };
    }

    if (branchDetails.length) {
      let newBranchDetails = branchDetails.map((obj) => {
        const { key, ...newObject } = obj;
        return newObject;
      });

      data = {
        ...data,
        org_branches: newBranchDetails,
      };
    }

    console.log("Payload: ", data);

    apiRequest({ method: "POST", url, data })
      .then((resp) => {
        if (step == 6) {
          getUser().then((resp) => {
            router.push("/home");
          });
        } else {
          setStep(step + 1);
          setOrgId(resp.data.org_id);
        }
      })
      .catch((error) => {
        if (error?.status == 400) {
          message.error(formatErrors(error?.data), 4);
        } else {
          message.error(error?.data?.error);
        }
      });
  };

  const updateOrgDetails = async (organization = null, partners = null, branches = null) => {
    try {
      const url = `api/v1/update-org/${orgId}/`;

      let cleanedBranches = null;
      if (branches) {
        cleanedBranches = branches.map((branch) => {
          if (fetchedBranchEmails.includes(branch.email)) {
            const { email, ...rest } = branch;
            return rest;
          } else {
            return branch;
          }
        });
      }

      let data = {
        org: organization == null ? org.orgDetails : organization,
        org_partners: partners == null ? org.partnerDetails : partners,
        org_branches: branches == null ? org.branchDetails : cleanedBranches,
      };

      let logo_url = null;
      if (data?.org?.logo_url) {
        logo_url = data.org.logo_url.split("/").slice(3).join("/");
      }
      data.org.logo_url = logo_url;

      const res = await apiRequest({ method: "POST", url, data });
      getOrgDetails()
        .then((res) => {
          if (res.data.org_branches) {
            setFetchedBranchEmails(getBranchEmails(res.data.org_branches));
          }
          setOrganizationDetails(res.data);
        })
        .catch((error) => setOrgId(null));
      // message.success(res.data.msg);
    } catch (error) {
      console.log(error);
      message.error(error?.data?.error);
      getOrgDetails()
        .then((res) => {
          if (res.data.org_branches) {
            setFetchedBranchEmails(getBranchEmails(res.data.org_branches));
          }
          setOrganizationDetails(res.data);
        })
        .catch((error) => setOrgId(null));
    }
  };

  const validateCompanyDetails = async () => {
    if (checkEmpty(companyDetails)) {
      message.error("Company details cannot be empty!");
      return false;
    }
    if (!isPhoneNoValid(companyDetails.mobile_number)) {
      message.error("Please enter a valid mobile number!");
      return false;
    }

    if (!companyDetails.email || !isEmailValid(companyDetails.email)) {
      message.error("Please enter a valid email address!");
      return false;
    }

    if (companyDetails.pan_no && companyDetails.pan_no.length < 10) {
      message.error("PAN must have atleast 10 digits");
      return false;
    }

    if (companyDetails.pan_no && companyDetails.pan_no.length > 10) {
      message.error("PAN cannot contain more than 10 characters!");
      return false;
    }

    if (companyDetails.pan_no && !isPANValid(companyDetails.pan_no.toUpperCase())) {
      message.error("Please enter a valid PAN number!");
      return false;
    }

    const missingRequiredFields = [];

    for (const field of formConfig.company_details.inputFields) {
      if (field.required && (!companyDetails[field.key] || companyDetails[field.key].trim() === "")) {
        missingRequiredFields.push(field.name);
      }
    }

    if (missingRequiredFields.length > 0) {
      // const errorMessage = `Please fill in the following required fields: ${missingRequiredFields.join(", ")}`;
      // message.error(errorMessage);
      message.error("Please fill in all the required fields");
      return false;
    }

    const results = await Promise.all([
      checkForExistingMobileNumber(),
      // checkForExistingCompanyName(),
      checkForExistingCompanyAddress(),
      checkForExistingGST(),
    ]);

    if (results.some((result) => !result)) {
      return false;
    }

    return true;
  };

  const checkForExistingMobileNumber = async () => {
    try {
      const url = `/api/v1/check-org-phone-number/?phone_number=${companyDetails.mobile_number}`;
      const res = await apiRequest({ method: "GET", url });
      return true;
    } catch (error) {
      message.error(error.data.error);
      return false;
    }
  };

  const checkForExistingCompanyName = async () => {
    try {
      const url = `/api/v1/check-org-name/?company_name=${companyDetails.registered_company_name}`;
      const res = await apiRequest({ method: "GET", url });
      return true;
    } catch (error) {
      message.error(error.data.error);
      return false;
    }
  };

  const checkForExistingCompanyAddress = async () => {
    try {
      const url = `/api/v1/check-org-address/?company_address=${companyDetails.company_address}`;
      const res = await apiRequest({ method: "GET", url });
      return true;
    } catch (error) {
      message.error(error.data.error);
      return false;
    }
  };

  const checkForExistingGST = async () => {
    try {
      const url = `/api/v1/check-org-gst/?gst_number=${companyDetails.gst_number}`;
      const res = await apiRequest({ method: "GET", url });
      return true;
    } catch (error) {
      message.error(error.data.error);
      return false;
    }
  };

  const handleContinue = async () => {
    if (step == 1) {
      setIsPrivacyModalOpen(true);
    }
    if (step == 2) {
      handleOtpVerification();
    }
    if (step == 3) {
      handleSetPassword();
    }
    if (step == 4) {
      if (orgId) {
        handleUpdateOrg(orgId);
      } else {
        if (await validateCompanyDetails()) {
          handleRegisterOrg();
        }
      }
    }
    if (step == 5) {
      setStep(6);
    }
    if (step == 6) {
      getUser().then((resp) => {
        router.push("/home");
      });
    }
  };

  const renderSignInOption = () => {
    if (step > 2) {
      return null;
    }

    return (
      <div className={styles.auth__link}>
        <p>
          Already a member?
          <Link href="/login">
            <b> Sign in</b>
          </Link>
        </p>
      </div>
    );
  };

  const renderBack = () => {
    if (step > 4) {
      return (
        <Button onClick={() => setStep(step - 1)} style={{ marginRight: 10 }}>
          Back
        </Button>
      );
    }
    return null;
  };

  if (step && step > 0) {
    return (
      <div className={styles.auth__container}>
        <div className={styles.auth__left}></div>
        <div className={styles.auth__right}>
          {token && step > 3 && (
            <>
              <div className={styles.signoutBtn}>
                <p
                  className={styles.logout}
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                  }}
                >
                  Sign out
                </p>
              </div>
            </>
          )}
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
          {renderSignInOption()}
          <div className={styles.auth__right__content}>
            {step == 1
              ? renderEmailStep()
              : step === 2
              ? renderOtpStep()
              : step === 3
              ? renderSetPasswordStep()
              : step === 4
              ? renderCompanyDetails()
              : //  renderBranchDetails()
              step === 5
              ? renderPartnerDetails()
              : step === 6
              ? renderBranchDetails()
              : null}
            <div style={{ display: "flex", width: "100%" }}>
              {renderBack()}
              <Button type="primary" onClick={handleContinue} disabled={checkDisabled()}>
                {step === 6 ? "Finish" : "Continue"}
              </Button>
            </div>
            <p>This site is protected by reCAPTCHA and the Google Privacy Policy.</p>
          </div>
        </div>
        <Modal
          centered
          open={isModalOpen}
          onOk={addField}
          okText="Add Field"
          okButtonProps={{
            disabled: newField.name === "",
          }}
          onCancel={() => setIsModalOpen(false)}
        >
          <div className={styles.modal__container}>
            <span>
              <h4>Enter Field Name</h4>
              <Input
                placeholder="Enter Field Name"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              />
            </span>
            <span>
              <h4>Select Field Type</h4>
              <Select
                placeholder="Select Field Type"
                className={styles.select}
                showArrow={false}
                onChange={(e) => {
                  setNewField({ ...newField, type: e });
                }}
                value={newField.type}
                options={[
                  {
                    value: "input",
                    label: "input",
                  },
                  {
                    value: "text area",
                    label: "text area",
                  },
                ]}
              />
            </span>
          </div>
        </Modal>
        <Modal
          width={750}
          centered={true}
          closable={false}
          open={isPrivacyModalOpen && isVerified}
          onCancel={() => setIsPrivacyModalOpen(false)}
          okText="Continue"
          onOk={handleEmailContinue}
          okButtonProps={{ disabled: loading }}
          cancelButtonProps={{ disabled: loading }}
        >
          <div className={styles.apply__header} style={{ marginBottom: 20 }}>
            <span />
            <p style={{ fontSize: 24 }}>Privacy Policy</p>
            <div>
              <p className={styles.modalHeading}>
                Thank you for reviewing our Privacy Policy. Please read it carefully to understand how the
                Madeinindia.qcin.org (hereinafter referred to as the <b>“Website”</b>) collects and uses the information
                provided by you through this Portal (hereinafter referred to as <b>“Portal”</b>).
              </p>
            </div>
            <div className={styles.modalPoints}>
              <ol>
                <li>
                  The website limits the collection, use, disclosure or storage of information to that which reasonably
                  serves the website’s lawful functions, administrative purposes, research and analysis, internal
                  processing or other legally required purposes. By providing the requested information, you express
                  your consent for use of such information by the website.
                </li>
                <li>
                  The website may gather certain information about a user, including but not limited to, Internet
                  protocol (IP) addresses, domain names, browser type, operating system, the date and/or time of the
                  visit, etc. The website makes no active attempts to link such information with the identity of
                  individuals visiting this Portal unless so required as per law; or for purposes of investigating,
                  preventing, managing, recording or responding to unlawful, unauthorized, fraudulent or other unethical
                  conduct, or for any other law enforcement purposes.
                </li>
                <li>
                  The website does not sell or trade the information collected through this Portal. The website does not
                  share your information with third parties for marketing purposes.
                </li>
                <li>
                  The website may disclose information collected through this Portal for, inter alia, the discharge of
                  its functions; in response to court orders, legal proceedings or requirements of law enforcement; in
                  furtherance of public interest, or as required by law.
                </li>
                <li>
                  The website implements reasonable security practices and measures to safeguard information provided to
                  this Portal against loss, misuse, unauthorized access or disclosure, alteration, or destruction.
                </li>
                <li>
                  Users are solely responsible for maintaining the secrecy, confidentiality and security of their
                  credentials to login and access this Portal. If users disclose their credentials or other details to
                  third parties, the website shall not be responsible for any loss, damages (including, without
                  limitation, damages for loss of business projects, loss of profits or any other damage in contract,
                  tort or otherwise whether direct, indirect or consequential) or other repercussions arising from the
                  use of or inability to use the Portal, or any of its contents, or from any action taken or refrained
                  from being taken.
                </li>
                <li>
                  The terms and conditions stated under this Privacy Policy may be revised or amended periodically. In
                  the event of any changes or revisions, the same will be posted on this Portal so that the user may be
                  informed of the latest amendments in this Privacy Policy.
                </li>
              </ol>
            </div>
          </div>
        </Modal>
      </div>
    );
  } else {
    return null;
  }
};

export default withRouter(Signup);

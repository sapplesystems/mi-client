import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { isEmailValid, isPhoneNoValid } from "../../../utils/validation";

const PartnerDetails = (props) => {
  const { org, setOrg, updateOrgDetails } = props;
  console.log("partnerDetails:", org);
  const [visibility, setVisibility] = useState(false);
  const [details, setDetails] = useState({
    sr_no: "",
    name: "",
    email: "",
    mobile_number: "",
    designation: "",
  });

  const columns = [
    {
      title: "Serial number",
      dataIndex: "sr_no",
      key: "sr_no",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mobile number",
      dataIndex: "mobile_number",
      key: "mobile_number",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Button icon={<EditOutlined />} onClick={() => setVisibility(true)}>
            Edit
          </Button>
        );
      },
    },
  ];
  console.log("partnerDetails", org);
  return (
    <div>
      <Table
        columns={columns}
        dataSource={org.partnerDetails || []}
        rowClassName="cursor"
        onRow={(record, rowIndex) => {
          return {
            onClick: (evt) => {
              setDetails(record);
            },
          };
        }}
        pagination={false}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={() => {
            setDetails({});
            setVisibility(true);
          }}
        >
          Add new partner
        </Button>
      </div>
      <EditPartnerDetails
        org={org}
        setOrg={setOrg}
        details={details}
        setDetails={setDetails}
        visibility={visibility}
        setVisibility={setVisibility}
        updateOrgDetails={updateOrgDetails}
      />
    </div>
  );
};

const EditPartnerDetails = (props) => {
  const { org, setOrg, details, setDetails, visibility, setVisibility, updateOrgDetails } = props;

  const handleChange = (e) => {
    let key = e.target.name;
    let value = e.target.value;

    setDetails({ ...details, [key]: value });
  };

  const validateFields = () => {
    if (
      !Object.hasOwn(details, "email") ||
      !Object.hasOwn(details, "mobile_number") ||
      !Object.hasOwn(details, "name") ||
      !Object.hasOwn(details, "sr_no")
    ) {
      message.error("Please fill all the required fields!");
      return false;
    }

    if (details.name?.trim() == "" || details.email?.trim() == "" || details.mobile_number?.trim() == "") {
      message.error("Please fill all the required fields!");
      return false;
    }

    if (isNaN(details?.sr_no)) {
      message.error("Serial number must be a valid number");
      return false;
    }

    if (details.email?.trim() != "" && !isEmailValid(details.email)) {
      message.error("Please enter a valid email address!");
      return false;
    }

    if (
      Object.hasOwn(details, "mobile_number") &&
      details.mobile_number?.trim() != "" &&
      details.mobile_number.length < 10
    ) {
      message.error("Mobile number must contain at least 10 digits!");
      return false;
    }
    if (
      Object.hasOwn(details, "mobile_number") &&
      details.mobile_number?.trim() != "" &&
      details.mobile_number.length > 10
    ) {
      message.error("Mobile number cannot contain more than 10 digits!");
      return false;
    }

    if (
      Object.hasOwn(details, "mobile_number") &&
      details.mobile_number?.trim() != "" &&
      !isPhoneNoValid(details.mobile_number)
    ) {
      message.error("Please enter a valid mobile number!");
      return false;
    }

    const trimmedEmail = details.email?.trim();
    const trimmedMobileNumber = details.mobile_number?.trim();

    const emailExists = org?.partnerDetails?.some(
      (partner) => partner.email === trimmedEmail && partner.id !== details.id
    );

    const mobileNumberExists = org?.partnerDetails?.some(
      (partner) => partner.mobile_number === trimmedMobileNumber && partner.id !== details.id
    );

    if (emailExists) {
      message.error("Email already exists in partner details!");
      return false;
    }

    if (mobileNumberExists) {
      message.error("Mobile number already exists in partner details!");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!org.partnerDetails) {
      const newPartnerDetails = [details];
      updateOrgDetails(null, newPartnerDetails, null);
      setOrg({ ...org, partnerDetails: newPartnerDetails });
    } else {
      const existingPartnerIndex = org.partnerDetails.findIndex(
        (partner) => partner.email === details.email || partner.mobile_number === details.mobile_number
      );

      if (existingPartnerIndex !== -1) {
        let updatedPartnerDetails = [...org.partnerDetails];
        updatedPartnerDetails[existingPartnerIndex] = {
          ...updatedPartnerDetails[existingPartnerIndex],
          ...details,
        };

        updateOrgDetails(null, updatedPartnerDetails, null);
        setOrg({ ...org, partnerDetails: updatedPartnerDetails });
      } else {
        const newPartnerDetails = [...org.partnerDetails, details];
        updateOrgDetails(null, newPartnerDetails, null);
        setOrg({ ...org, partnerDetails: newPartnerDetails });
      }
    }

    setVisibility(false);
  };

  return (
    <Modal
      centered
      title="Partner Details"
      open={visibility}
      onOk={() => {
        if (validateFields()) {
          handleSave();
        }
      }}
      onCancel={() => setVisibility(false)}
      okText="Save"
    >
      <div style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
        <p style={{ marginBottom: 6 }}>
          Serial Number <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="sr_no"
          placeholder="Serial Number"
          value={details["sr_no"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>
      <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ marginBottom: 6 }}>
          Name <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="name"
          placeholder="Name"
          value={details["name"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>
      <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ marginBottom: 6 }}>
          Mobile number <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="mobile_number"
          placeholder="Mobile Number"
          value={details["mobile_number"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>
      <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ marginBottom: 6 }}>
          Email <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="email"
          placeholder="Email"
          value={details["email"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>
      <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ marginBottom: 6 }}>Designation </p>
        <Input
          name="designation"
          placeholder="Designation"
          value={details["designation"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export default PartnerDetails;

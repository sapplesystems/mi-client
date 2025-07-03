import React, { useState } from "react";
import styles from "../../../styles/Product.module.scss";
import { Button, Input, Modal, Select, Table, message } from "antd";
import { getStateOptions } from "../../constants/location_mapping";
import { EditOutlined } from "@ant-design/icons";
import { isEmailValid } from "../../../utils/validation";

const BranchDetails = (props) => {
  const { org, setOrg, updateOrgDetails } = props;
  const [visibility, setVisibility] = useState(false);
  const [details, setDetails] = useState({});

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Branch address",
      dataIndex: "branch_address",
      key: "branch_address",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "GSTN/ Udhyam ID",
      dataIndex: "identification_id",
      key: "identification_id",
    },
    {
      title: "PAN",
      dataIndex: "pan_no",
      key: "pan_no",
    },
    {
      title: "TAN",
      dataIndex: "tan_no",
      key: "tan_no",
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

  return (
    <div>
      <Table
        columns={columns}
        dataSource={org.branchDetails || []}
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
          Add new branch
        </Button>
      </div>
      <EditBranchDetails
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

const EditBranchDetails = (props) => {
  const { org, setOrg, details, setDetails, visibility, setVisibility, updateOrgDetails } = props;

  const handleChange = (e) => {
    console.log(e.target.name);
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    console.log({ details });
    if (
      !Object.hasOwn(details, "branch_name") ||
      !Object.hasOwn(details, "email") ||
      !Object.hasOwn(details, "branch_address") ||
      !Object.hasOwn(details, "identification_id") ||
      !Object.hasOwn(details, "state") ||
      !Object.hasOwn(details, "pan_no") ||
      !Object.hasOwn(details, "tan_no")
    ) {
      message.error("Please fill all the required fields!");
      return false;
    }

    if (
      details.branch_name?.trim() == "" ||
      details.email?.trim() == "" ||
      details.branch_address?.trim() == "" ||
      details.identification_id?.trim() == "" ||
      details.state?.trim() == "" ||
      details.pan_no?.trim() == "" ||
      details.tan_no?.trim() == ""
    ) {
      message.error("Please fill all the required fields!");
      return false;
    }

    if (details.email?.trim() != "" && !isEmailValid(details.email)) {
      message.error("Please enter a valid email address!");
      return false;
    }

    console.log({ details });
    console.log({ org });
    const trimmedEmail = details.email?.trim();
    const emailExists = org?.branchDetails?.some((branch) => branch.email === trimmedEmail && branch.id !== details.id);
    //  const emailExists = org?.branchDetails?.some((branch) => branch.email === trimmedEmail);
    console.log({ emailExists });
    if (emailExists) {
      message.error("Email already exists in branch details!");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!org.branchDetails) {
      const newBranchDetails = [details];
      updateOrgDetails(null, null, newBranchDetails);
      setOrg({ ...org, branchDetails: newBranchDetails });
    } else {
      const existingBranchIndex = org.branchDetails.findIndex((branch) => branch.id === details.id);

      if (existingBranchIndex !== -1) {
        let updatedBranchDetails = [...org.branchDetails];
        updatedBranchDetails[existingBranchIndex] = {
          ...updatedBranchDetails[existingBranchIndex],
          ...details,
        };

        setOrg({ ...org, branchDetails: updatedBranchDetails });
        console.log({ updatedBranchDetails });
        updateOrgDetails(null, null, updatedBranchDetails);
      } else {
        const newBranchDetails = [...org.branchDetails, details];
        console.log({ newBranchDetails });
        updateOrgDetails(null, null, newBranchDetails);
        setOrg({ ...org, branchDetails: newBranchDetails });
      }
    }

    setVisibility(false);
  };

  return (
    <Modal
      centered
      title="Branch Details"
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
          Branch Name <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="branch_name"
          placeholder="Branch Name"
          value={details["branch_name"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>

      <div style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
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

      <div style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
        <p style={{ marginBottom: 6 }}>
          Branch address <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="branch_address"
          placeholder="Branch Address"
          value={details["branch_address"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>

      <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ marginBottom: 6 }}>
          GSTN/ Udhyam ID <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="identification_id"
          placeholder=" GSTN/ Udhyam ID"
          value={details["identification_id"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>

      <div style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <p style={{ marginBottom: 6 }}>
          State <span style={{ color: "red" }}>*</span>
        </p>

        <Select
          placeholder={"State"}
          className={styles.select}
          style={{ backgroundColor: "transparent" }}
          showArrow={false}
          value={details["state"]}
          onChange={(val) => setDetails({ ...details, state: val })}
          options={getStateOptions()}
        />
      </div>

      <div style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
        <p style={{ marginBottom: 6 }}>
          PAN <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="pan_no"
          placeholder="PAN"
          value={details["pan_no"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>

      <div style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
        <p style={{ marginBottom: 6 }}>
          TAN <span style={{ color: "red" }}>*</span>
        </p>
        <Input
          name="tan_no"
          placeholder="TAN"
          value={details["tan_no"]}
          style={{ cursor: "default", color: "#6d6d6d", marginBottom: 10 }}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export default BranchDetails;

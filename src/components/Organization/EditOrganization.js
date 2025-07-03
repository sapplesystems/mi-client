import React, { useEffect, useState, useRef } from "react";
import { ConsoleSqlOutlined, DownOutlined } from "@ant-design/icons";
import apiRequest from "../../../utils/request";
import { PlusOutlined } from "@ant-design/icons";
import RenderInput from "../../utils/RenderInput";
import styles from "../../../styles/Product.module.scss";

import { Button, Modal, Form, Input, Dropdown, Space, Select, Divider, message } from "antd";
const { TextArea } = Input;

const fields = [
  {
    name: "Name",
    title: "Name",
    type: "input",
    tooltipText: false,
    key: "registered_company_name",
  },
  {
    name: "Email",
    title: "Email",
    type: "input",
    tooltipText: false,
    key: "company_email",
  },
];

const EditOrganization = ({ org, updateOrgDetails }) => {
  const [orgState, setOrgState] = useState({});
  const [showError, setShowError] = useState(false);
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (org) {
      setOrgState(org);
    }
  }, [org]);

  // const editOrg = async () => {
  //   apiRequest({
  //     url: `/api/v1/update-org/${org.id}/`,
  //     method: "POST",
  //     data: orgState,
  //   })
  //     .then((resp) => {
  //       message.success(resp.data.msg);
  //     })
  //     .catch((error) => {
  //       message.error(error?.data?.msg);
  //     });
  // };

  const handleEdit = () => {
    console.log(orgState);
    updateOrgDetails(orgState, null, null);
    //Call API to invite
    // let show_error =
    //   orgState.name &&
    //   orgState.description &&
    //   orgState.category &&
    //   orgState.hsn_code
    //     ? false
    //     : true;
    // setShowError(show_error);
    // if (show_error) return;
    // if (org) {
    //   editOrg().then(() => {
    //     handleOk();
    //   });
    // } else {
    //   addProduct().then(() => {
    //     handleOk(orgState.hsn_code);
    //   });
    // }
  };

  return (
    <Form
      labelCol={{
        span: 7,
      }}
      wrapperCol={{
        span: 18,
      }}
    >
      <div className={styles.org_detail_row}>
        <label>Id:</label>
        <Input
          disabled={true}
          defaultValue={orgState.id}
          name="id"
          value={orgState.id}
          //onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Address:</label>
        <TextArea
          defaultValue={orgState.id}
          name="address"
          value={orgState.company_address}
          onChange={(e) =>
            setOrgState((prevState) => {
              return { ...prevState, company_address: e.target.value };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Name:</label>
        <Input
          defaultValue={orgState.registered_company_name}
          name="name"
          value={orgState.registered_company_name}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                registered_company_name: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Company Email:</label>
        <Input
          defaultValue={orgState.company_email}
          name="Email"
          value={orgState.company_email}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                company_email: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Mobile Number:</label>
        <Input
          defaultValue={orgState.mobile_number}
          name="mobile_number"
          value={orgState.mobile_number}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                mobile_number: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Logo URL:</label>
        <Input
          defaultValue={orgState.logo_url}
          name="logo_url"
          value={orgState.logo_url}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                logo_url: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Aadhar Number:</label>
        <Input
          defaultValue={orgState.aadhar_no}
          name="aadhar_no"
          value={orgState.aadhar_no}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                aadhar_no: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>CIN Number:</label>
        <Input
          defaultValue={orgState.cin_no}
          name="cin_no"
          value={orgState.cin_no}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                cin_no: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>GST Number:</label>
        <Input
          defaultValue={orgState.gst_number}
          name="gst_number"
          value={orgState.gst_number}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                gst_number: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>GST verified?:</label>
        <Select
          defaultValue={orgState.gst_verified}
          value={orgState.gst_verified}
          onChange={(v) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                gst_verified: v,
              };
            })
          }
          options={[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ]}
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>PAN Number:</label>
        <Input
          defaultValue={orgState.pan_no}
          name="pan_no"
          value={orgState.pan_no}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                pan_no: e.target.value,
              };
            })
          }
        />
      </div>

      <div className={styles.org_detail_row}>
        <label>TAN Number:</label>
        <Input
          defaultValue={orgState.tan_no}
          name="tan_no"
          value={orgState.tan_no}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                tan_no: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Created at:</label>
        <Input
          disabled
          defaultValue={orgState.created_at}
          name="created_at"
          value={orgState.created_at}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                created_at: e.target.value,
              };
            })
          }
        />
      </div>
      <div className={styles.org_detail_row}>
        <label>Updated at:</label>
        <Input
          disabled
          defaultValue={orgState.updated_at}
          name="updated_at"
          value={orgState.updated_at}
          onChange={(e) =>
            setOrgState((prevState) => {
              return {
                ...prevState,
                updated_at: e.target.value,
              };
            })
          }
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={handleEdit}>
          Edit
        </Button>
      </div>
      {showError && <div style={{ color: "red" }}>{"Please enter all required info!"}</div>}
    </Form>
  );
};

export default EditOrganization;

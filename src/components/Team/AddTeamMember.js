import React, { useEffect, useState } from "react";
import apiRequest from "../../../utils/request.js";
import { Modal, Form, Input, Select, message } from "antd";

const options = [
  { value: "ministry", label: "Ministry" },
  { value: "admin", label: "Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "customer_support", label: "Customer Support" },
];

const AddTeamMember = ({ isModalOpen, handleCancel, handleOk, user }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [showError, setShowError] = useState(false);
  const [data, setData] = useState({
    email: user?.username,
    role: user?.user_role,
  });

  const updateUser = async () => {
    apiRequest({
      url: `/api/v1/update-user/${user.id}/`,
      method: "POST",
      data: { user_role: role },
    })
      .then((resp) => {
        message.success(resp.data.msg);
      })
      .catch((error) => {
        message.error(error?.data?.msg);
      });
  };

  const addUser = async () => {
    let resp = apiRequest({
      url: "/api/v1/register-user/",
      method: "POST",
      data: { email: email, role: role },
    })
      .then((resp) => {
        message.success(resp.data.msg);
        return resp;
      })
      .catch((error) => {
        message.error(error?.data?.msg);
      });
    return resp;
  };

  useEffect(() => {
    setEmail(user?.username);
    setRole(user?.user_role);
  }, [user]);

  const inviteUser = () => {
    //Call API to invite
    let show_error = email && role ? false : true;
    setShowError(show_error);
    if (show_error) return;

    if (user) {
      updateUser().then(() => {
        handleOk();
      });
    } else {
      addUser().then((resp) => {
        handleOk(email);
      });
    }
    handleOk();
    setEmail("");
    setRole("");
  };

  return (
    <Modal
      title={user ? "Edit Team Member" : "Add Team Member"}
      open={isModalOpen}
      onOk={inviteUser}
      onCancel={handleCancel}
      okText={user ? "Edit" : "Add"}
      destroyOnClose={true}
    >
      <Form>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            disabled={user}
            defaultValue={email}
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Role"
          defaultValue={role}
          name="role"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{ height: 35 }}
            className="select"
            defaultValue={role}
            value={role}
            onChange={(v) => setRole(v)}
            options={options}
          />
        </Form.Item>
        {showError && <div style={{ color: "red" }}>{"Please enter email and role!"}</div>}
      </Form>
    </Modal>
  );
};

export default AddTeamMember;

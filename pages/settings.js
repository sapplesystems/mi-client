import React, { useEffect, useState } from "react";
import apiRequest from "../utils/request";
import { MainLayout } from "../src/shared";
import styles from "../styles/Product.module.scss";
import { Button, message, Popconfirm, Tooltip } from "antd";
import CopyToClipboard from "react-copy-to-clipboard";
import { CopyOutlined } from "@ant-design/icons";

const Settings = () => {
  const [token, setToken] = useState("");

  const getToken = () => {
    const url = `/api/v1/get-api-token/`;
    apiRequest({
      method: "GET",
      url,
    })
      .then((resp) => {
        setToken(resp.data.token);
      })
      .catch((error) => {
        setToken("");
      });
  };

  const generateToken = () => {
    const url = `/api/v1/generate-api-token/`;
    apiRequest({
      method: "POST",
      url,
      data: {},
    })
      .then((resp) => {
        setToken(resp.data.token);
      })
      .catch((error) => {
        setToken("");
        message.error(error?.data?.error);
      });
  };

  const updateToken = () => {
    const url = `/api/v1/update-api-token/`;
    apiRequest({
      method: "POST",
      url,
      data: {},
    })
      .then((resp) => {
        setToken(resp.data.token);
      })
      .catch((error) => {
        setToken("");
        message.error(error?.data?.error);
      });
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <MainLayout>
      <div className={styles.apply__container} style={{ width: "100%" }}>
        <div className={styles.apply__header} style={{ marginBottom: 20 }}>
          <span />
          <p style={{ fontSize: 24 }}>Settings</p>
        </div>

        {token == "" ? (
          <Button className={styles.generate__btn} onClick={generateToken}>
            Generate Token
          </Button>
        ) : (
          <Popconfirm
            style={{ maxWidth: 400 }}
            title="Delete the task"
            description="Are you sure you want to generate new token? This action will disable the current API token."
            onConfirm={updateToken}
            okText="Yes"
            cancelText="No"
          >
            <Button className={styles.generate__btn}>Generate Token</Button>
          </Popconfirm>
        )}

        <div className={styles.token__row}>
          <p>{token != "" ? token : "No token found"}</p>
          <CopyToClipboard
            text={token}
            onCopy={() => token && message.success("Token copied")}
          >
            <Button icon={<CopyOutlined />} disabled={token == ""}>
              Copy to Clipboard
            </Button>
          </CopyToClipboard>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;

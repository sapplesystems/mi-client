import { Form, Input, message, Modal, Spin, Table } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MainLayout } from "../src/shared";
import apiRequest from "../utils/request";
import styles from "../styles/Product.module.scss";
import { SearchOutlined } from "@ant-design/icons";

const ApplicationItems = () => {
  const router = useRouter();
  const { query } = router;

  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [applicationItems, setApplicationItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [item, setItem] = useState({});
  const [searchInput, setSearchInput] = useState("");

  const getApplicationItems = (id) => {
    let url = `/api/v1/application/${id}/items/`;
    apiRequest({ method: "GET", url })
      .then((resp) => {
        setLoading(false);
        setApplicationItems(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        message.error(error?.data?.error);
      });
  };

  const updateApplication = () => {
    let url = `/api/v1/application-item/${item?.id}/update/`;
    apiRequest({ method: "POST", url, data: itemDetails })
      .then((resp) => {
        message.success(resp.data.msg);
        setOpenModal(false);
        getApplicationItems(query.application_id);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const searchApplicationItems = (search_input) => {
    let url = `/api/v1/search-application-item/${query.application_id}/?query=${search_input}`;
    apiRequest({
      method: "GET",
      url,
    })
      .then((resp) => {
        setApplicationItems(resp.data);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  useEffect(() => {
    if (query.application_id) {
      getApplicationItems(query.application_id);
    }
  }, [query]);

  useEffect(() => {
    if (query.application_id) {
      searchApplicationItems(searchInput);
    }
  }, [query, searchInput]);

  const columns = [
    {
      title: "Sequence id",
      dataIndex: "sequence_id",
      key: "sequence_id",
    },
    {
      title: "Item key",
      dataIndex: "item_key",
      key: "item_key",
    },
    {
      title: "Last updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (_, data) => {
        return <p>{moment(data.updated_at).format("DD/MM/YYYY hh:mm A")}</p>;
      },
    },
  ];

  const renderItemDetailsForm = () => {
    return Object.keys(itemDetails).map((key) => (
      <Form>
        <Form.Item>
          <label>{key}</label>
          <Input
            placeholder={key}
            value={itemDetails[key]}
            onChange={(e) => {
              setItemDetails({ ...itemDetails, [key]: e.target.value });
            }}
          />
        </Form.Item>
      </Form>
    ));
  };

  return (
    <MainLayout>
      <>
        <div className={styles.apply__container} style={{ width: "100%" }}>
          <div className={styles.apply__header} style={{ marginBottom: 20 }}>
            <span />
            <p style={{ fontSize: 24 }}>Application Items</p>
          </div>
          <>
            <div style={{ marginBottom: 20, width: 340 }}>
              <Input
                allowClear
                style={{ height: 40 }}
                className={styles.input__gray}
                prefix={<SearchOutlined style={{ color: "#6F767E", marginRight: 5 }} />}
                placeholder="Search by name, approver etc"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Table
              loading={loading}
              columns={columns}
              dataSource={applicationItems}
              rowClassName="cursor"
              onRow={(record, rowIndex) => {
                return {
                  onClick: (evt) => {
                    setItem(record);
                    setItemDetails(record.item_details);
                    setOpenModal(true);
                  },
                };
              }}
            />
          </>
        </div>
      </>
      <Modal
        centered={true}
        closable={false}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        okText="Update"
        onOk={updateApplication}
      >
        <div className={styles.apply__header} style={{ marginBottom: 20 }}>
          <span />
          <p style={{ fontSize: 24 }}>Items</p>
        </div>
        {renderItemDetailsForm()}
      </Modal>
    </MainLayout>
  );
};

export default ApplicationItems;

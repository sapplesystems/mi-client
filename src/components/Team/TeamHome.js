import React, { useEffect, useState } from "react";
import { Button, Input, message, Segmented, Select, Table, Tooltip } from "antd";
import styles from "../../../styles/Team.module.scss";
import ShoppingBag from "../../../assets/shopping.svg";
import { CopyOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import apiRequest from "../../../utils/request";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useRouter } from "next/router";
import { getOrgDetails } from "../../../utils/helper";
import AddTeamMember from "./AddTeamMember";

const TeamHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (email) => {
    setIsModalOpen(false);
    setEmail(email);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.main__container}>
      <div className={styles.home}>
        <h3>Team</h3>
        <Button type="primary" onClick={showModal}>
          <PlusOutlined /> Add Team Member
        </Button>
        <AddTeamMember isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} email={""} role={""} />
      </div>
      {/* <OverView /> */}
      <Users email={email} />
    </div>
  );
};

const Users = ({ email }) => {
  const router = useRouter();
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};

  const [segment, setSegment] = useState("all");
  const [applications, setApplications] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [org, setOrg] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [userToEdit, setUserToEdit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUserToEdit("");
  };

  const handleOk = () => {
    handleCancel();
    getUsers();
  };

  const getUsers = (page = 1) => {
    const url =
      `/api/v1/get-all-users/?` +
      (searchInput !== "" ? `query=${searchInput}&` : ``) +
      (segment !== "all" ? `role=${segment}&` : ``) +
      `page=${page}`;
    setTableLoading(true);
    apiRequest({
      method: "GET",
      url,
    })
      .then((resp) => {
        setDataSource(resp?.data?.users);
        setTotalCount(resp?.data?.total_count);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => setTableLoading(false));
  };

  useEffect(() => {
    getUsers();
  }, [email, searchInput, segment]);

  useEffect(() => {
    getOrgDetails().then((res) => {
      setOrg(res.data);
    });
  }, []);

  const options = [
    {
      label: "All",
      value: "all",
    },
    {
      label: `Admin`,
      value: "admin",
    },
    {
      label: `Supervisor`,
      value: "supervisor",
    },
    {
      label: `Ministry`,
      value: "ministry",
    },
    {
      label: `Customer Support`,
      value: "customer_support",
    },
  ];

  const columns = [
    {
      width: 400,
      title: "User Name",
      dataIndex: "username",
      key: "username",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data?.username}</p>
            </span>
          </>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "user_role",
      key: "user_role",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data.user_role}</p>
            </span>
          </>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, data) => {
        return (
          <>
            <span>
              <Button
                style={{
                  marginRight: 10,
                  fontSize: 12,
                  marginTop: 4,
                }}
                type="primary"
                ghost={true}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserToEdit(data);
                  showModal();
                  // applicationAction(data.unique_application_id, "approved");
                }}
              >
                Edit
              </Button>
            </span>
          </>
        );
      },
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange = (page) => {
    getUsers(page);
    setCurrentPage(page);
  };

  const config = {
    pagination: {
      position: ["bottomCenter"],
      onChange: handleTableChange,
      pageSize: 10,
      current: currentPage,
      total: Math.ceil(totalCount / 10) * 10,
    },
  };

  return (
    <div className={styles.application__container}>
      <div className={styles.overview__heading}>
        <span />
        <h4>Team members</h4>
      </div>
      <div className={styles.application__header}>
        <div>
          <Input
            allowClear
            className={styles.input__gray}
            prefix={<SearchOutlined style={{ color: "#6F767E" }} />}
            placeholder="Search by name"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
        <div>
          <Segmented
            size="small"
            className={styles.segment}
            options={options}
            value={segment}
            onChange={(e) => setSegment(e)}
          />
        </div>
      </div>
      <div>
        <p className={styles.infoText}>Showing {totalCount} members</p>
        <Table
          {...config}
          loading={tableLoading}
          rowSelection={rowSelection}
          rowClassName={styles.table_row_styles}
          rowKey={(record) => record.unique_application_id}
          onRow={(record, rowIndex) => {
            return {
              onClick: (evt) => {},
            };
          }}
          dataSource={dataSource ? dataSource : []}
          columns={columns}
        />
      </div>
      <AddTeamMember isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} user={userToEdit} />
    </div>
  );
};

export default TeamHome;

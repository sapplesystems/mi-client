import React, { useEffect, useState } from "react";
import styles from "../../styles/Main.module.scss";

import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, List, message, Modal, Radio, Segmented, Space, Table, Tooltip } from "antd";

import Stats from "./Stats";

import { useRouter } from "next/router";
import apiRequest from "../../utils/request";
import { getOrgDetails } from "../../utils/helper";
import ChangeRequestModal from "../shared/ChangeRequestModal";
import { is_applicant } from "../../utils/roles";

const Main = () => {
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};

  return (
    <div className={styles.main__container}>
      <div className={styles.home}>
        <h3>Home</h3>
        {is_applicant(user?.role) && (
          <Button type="primary" href="/create-application">
            <PlusOutlined /> Apply for product
          </Button>
        )}
      </div>
      {(user?.role === "admin" || user?.role === "ministry" || user?.role === "super_admin") && <Stats />}
      {user?.role !== "ministry" && <Applications />}
    </div>
  );
};

const Applications = () => {
  const router = useRouter();
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : "";
  const is_staff = user?.is_staff;

  const [segment, setSegment] = useState("all");
  const [applications, setApplications] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [org, setOrg] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [comments, setComments] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [changeRequestVisible, setChangeRequestVisible] = useState(false);

  const [supervisors, setSupervisors] = useState(null);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [assignedState, setAssignedState] = useState("all");
  const { Search } = Input;

  const handleOpenChangeRequest = (data) => {
    setApplicationId(data.id);
    setChangeRequestVisible(true);
  };

  const getApplications = async (page = 1, status = null, state = "all") => {
    const url = `/api/v1/search-application-v2/?&query=${searchInput}&page=${page}&status=${status}&state=${state}`;
    setTableLoading(true);

    try {
      const resp = await apiRequest({
        method: "GET",
        url,
      });

      return resp.data;
    } catch (error) {
      message.error(error?.data?.error);
    } finally {
      setTableLoading(false);
    }
  };

  const applicationAction = (id, action) => {
    setTableLoading(true);
    apiRequest({
      method: "POST",
      url: `/api/v1/application/${id}/update-status/`,
      data: { status: action },
    })
      .then((resp) => {
        message.success(resp.data.msg);
        getApplications(1, segment, assignedState).then((data) => {
          setDataSource(data.applications);
          setTotalCount(data.total_count);
          setApplications(data.applications);
        });
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => setTableLoading(false));
  };

  const handleChangeRequestStatus = () => {
    setTableLoading(true);
    const url = `/api/v1/application-review/`;

    const payload = {
      application_id: applicationId,
      review_comment: comments,
    };

    apiRequest({
      method: "POST",
      url: url,
      data: payload,
    })
      .then((resp) => {
        message.success("Application sent to review");
        getApplications(1, segment, assignedState).then((data) => {
          setDataSource(data.applications);
          setTotalCount(data.total_count);
          setApplications(data.applications);
        });
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => {
        setChangeRequestVisible(false);
        setComments("");
        setApplicationId(null);
        setTableLoading(false);
      });
  };

  const getAllSuperVisors = () => {
    const url = `/api/v1/get-all-users/?role=supervisor`;
    apiRequest({
      method: "GET",
      url,
    })
      .then((res) => {
        setSupervisors(res.data.users);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => setTableLoading(false));
  };

  const assignApplication = () => {
    const url = `/api/v1/assign-application/${selectedApplication.id}/`;
    setTableLoading(true);
    setOpenAssignModal(false);
    setSelectedApplication(null);
    setSelectedAssignee(null);
    apiRequest({
      method: "POST",
      url,
      data: {
        reviewer_id: selectedAssignee.id,
      },
    })
      .then((res) => {
        message.success(res.data.msg);
        getApplications(1, segment, assignedState).then((data) => {
          setDataSource(data.applications);
          setTotalCount(data.total_count);
          setApplications(data.applications);
        });
        getAllSuperVisors();
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => setTableLoading(false));
  };

  useEffect(() => {
    getApplications(1, segment, assignedState).then((data) => {
      setDataSource(data.applications);
      setTotalCount(data.total_count);
      setApplications(data.applications);
    });
  }, [segment, assignedState, searchInput]);

  useEffect(() => {
    if (is_applicant(user?.role)) {
      getOrgDetails().then((res) => {
        setOrg(res.data);
      });
    }
    if (user?.role === "admin" || user?.role === "super_admin") {
      getAllSuperVisors();
    }
  }, []);

  const options = [
    {
      label: "All",
      value: "all",
    },
    {
      label: `Approved`,
      value: "approved",
    },
    {
      label: `Submitted`,
      value: "submitted",
    },
    {
      label: `Resubmitted`,
      value: "resubmitted",
    },
    {
      label: `Change Requested`,
      value: "changeRequest",
    },
    {
      label: `Rejected`,
      value: "rejected",
    },
    {
      label: `Drafted`,
      value: "draft",
    },
  ];

  const columns = [
    {
      width: 360,
      title: "Application",
      dataIndex: "application",
      key: "application",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data.product.name}</p>
              <p className={styles.col_subvalue}>
                {data.product.category} - {data.product.hsn_code}
              </p>
            </span>
          </>
        );
      },
    },
    {
      title: "Applicant",
      dataIndex: "applicant",
      key: "applicant",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data.org.registered_company_name}</p>
            </span>
          </>
        );
      },
    },
    {
      align: "center",
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, data) => {
        if (data.status === "approved") {
          return <div className={styles.approved}>approved</div>;
        }
        if (data.status === "draft") {
          return <div className={styles.draft}>drafted</div>;
        }
        if (data.status === "submitted") {
          return <div className={styles.submitted}>submitted</div>;
        }
        if (data.status === "changeRequest") {
          return <div className={styles.draft}>change-request</div>;
        }
        if (data.status === "resubmitted") {
          return <div className={styles.resubmitted}>resubmitted</div>;
        }
        if (data.status === "rejected") {
          return <div className={styles.rejected}>rejected</div>;
        }
      },
    },
    {
      align: "center",
      title: "Application Date",
      dataIndex: "applicationDate",
      key: "applicationDate",
      render: (_, data) => {
        return (
          <>
            <Space align="center" direction="vertical">
              <p className={styles.col_value}>{moment(data.application_date).format("DD/MM/YYYY")}</p>
              <p className={styles.col_value}>{moment(data.application_date).format("hh:mm A")}</p>
            </Space>
          </>
        );
      },
    },
    {
      align: "center",
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (_, data) => {
        return (
          <>
            <Space align="center" direction="vertical">
              <p className={styles.col_value}>{moment(data.updated_at).format("DD/MM/YYYY")}</p>
              <p className={styles.col_value}>{moment(data.updated_at).format("hh:mm A")}</p>
            </Space>
          </>
        );
      },
    },
  ];

  const adminColumns = [
    {
      width: 100,
      align: "center",
      title: "Action",
      dataIndex: "assignee",
      key: "assignee",
      render: (_, data) => {
        return (
          <>
            {!data.supervisor &&
              (user?.role === "admin" || user?.role === "super_admin") &&
              data.status === "submitted" && (
                <Button
                  ghost
                  type="primary"
                  size="small"
                  style={{ fontSize: 12, marginTop: 4, width: 100 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // getAllSuperVisors();
                    setOpenAssignModal(true);
                    setSelectedApplication(data);
                  }}
                >
                  Assign
                </Button>
              )}
            {data.supervisor && (
              <div>
                <span>
                  <p className={styles.col_value} style={{ fontSize: 12 }}>
                    {data?.supervisor?.supervisor_name}
                  </p>
                </span>
                <div>
                  {data.status !== "approved" && data.status !== "rejected" && (
                    <Button
                      ghost
                      type="primary"
                      size="small"
                      style={{ fontSize: 12, marginTop: 4, width: 120 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // getAllSuperVisors();
                        setOpenAssignModal(true);
                        setSelectedApplication(data);
                      }}
                    >
                      Change Assignee
                    </Button>
                  )}
                </div>
              </div>
            )}
            {!data.supervisor && data.status != "submitted" && <p>-</p>}
            <div style={{ marginTop: 6 }}> {renderCopyToClipboardButton(data)}</div>
          </>
        );
      },
    },
  ];

  const supervisorColumns = [
    {
      width: 100,
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, data) => renderActionButtons(data),
    },
  ];

  const applicantColumns = [
    {
      width: 100,
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, data) => renderActionButtons(data),
    },
  ];

  const getColumns = (role) => {
    if (role === "super_admin" || role === "admin") {
      return [...columns, ...adminColumns];
    } else if (role == "supervisor") {
      return [...columns, ...supervisorColumns];
    } else if (is_applicant(role)) {
      const filteredColumns = columns.filter((col) => col.dataIndex !== "applicant");
      return [...filteredColumns, ...applicantColumns];
    } else {
      return columns;
    }
  };

  const renderActionButtons = (data) => {
    if (!is_applicant(user?.role)) {
      return (
        <>
          {(data.status === "submitted" || data.status == "resubmitted") && (
            <>
              <div>
                {data.status != "resubmitted" && (
                  <Button
                    style={{
                      fontSize: 12,
                      marginTop: 4,
                      flex: 1,
                      width: "100%",
                    }}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenChangeRequest(data);
                    }}
                  >
                    Change Request
                  </Button>
                )}
              </div>
              <div style={{ display: "flex" }}>
                <Button
                  style={{
                    marginRight: 10,
                    fontSize: 12,
                    marginTop: 4,
                    flex: 1,
                  }}
                  type="primary"
                  ghost={true}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    applicationAction(data.unique_application_id, "approved");
                  }}
                >
                  Approve
                </Button>
                <Button
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    padding: "0 12px",
                    flex: 1,
                  }}
                  type="primary"
                  danger={true}
                  ghost={true}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    applicationAction(data.unique_application_id, "rejected");
                  }}
                >
                  Reject
                </Button>
              </div>
            </>
          )}
          <div style={{ marginTop: 6 }}>{renderCopyToClipboardButton(data)}</div>
        </>
      );
    } else {
      return renderCopyToClipboardButton(data);
    }
  };

  const renderCopyToClipboardButton = (data, size = "medium") => {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <CopyToClipboard text={data.unique_application_id} onCopy={() => message.success("Application Id copied")}>
          <Tooltip title="Copy application ID" placement="bottom">
            <Button size={size} icon={<CopyOutlined />}>
              Copy to Clipboard
            </Button>
          </Tooltip>
        </CopyToClipboard>
      </div>
    );
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange = (page) => {
    setCurrentPage(page);
    getApplications(page, segment).then((data) => {
      setDataSource(data.applications);
      setTotalCount(data.total_count);
      setApplications(data.applications);
    });
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

  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredSupervisors = supervisors?.filter((supervisor) =>
    supervisor?.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.application__container}>
      <div className={styles.overview__heading}>
        <span />
        <h4>Applications</h4>
      </div>
      <div className={styles.application__header}>
        <div>
          <Input
            allowClear
            className={styles.input__gray}
            prefix={<SearchOutlined style={{ color: "#6F767E" }} />}
            placeholder="Search by name, approver etc"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
        <div>
          <Segmented
            size="medium"
            className={styles.segment}
            options={user?.role !== "applicant" ? options.filter((option) => option.value !== "draft") : options}
            value={segment}
            onChange={(e) => setSegment(e)}
          />
        </div>
      </div>
      <div>
        <p className={styles.infoText}>Showing {totalCount} applications</p>
        {user?.role === "admin" && (
          <div style={{ marginLeft: 8, marginBottom: 12 }}>
            <Radio.Group onChange={(e) => setAssignedState(e.target.value)} value={assignedState}>
              <Radio value={"all"}>All</Radio>
              <Radio value={"assigned"}>Assigned</Radio>
              <Radio value={"unassigned"}>Unassigned</Radio>
            </Radio.Group>
          </div>
        )}
        <Table
          {...config}
          loading={tableLoading}
          rowSelection={rowSelection}
          rowClassName={styles.table_row_styles}
          rowKey={(record) => record.unique_application_id}
          onRow={(record, rowIndex) => {
            return {
              onClick: (evt) => {
                router.push({
                  pathname: `/view-application/${record.id}`,
                });
              },
            };
          }}
          dataSource={dataSource ? dataSource : []}
          columns={getColumns(user?.role)}
        />
      </div>
      <ChangeRequestModal
        visible={changeRequestVisible}
        onCancel={() => {
          setChangeRequestVisible(false);
          setComments("");
        }}
        onSubmit={handleChangeRequestStatus}
        comments={comments}
        setComments={setComments}
      />
      <Modal
        centered
        className="modalStyles"
        open={openAssignModal}
        title="Choose assignee"
        onCancel={() => {
          setOpenAssignModal(false);
          setSelectedAssignee(null);
          setSelectedApplication(null);
        }}
        footer={[
          <Button
            key="cancel"
            style={{ marginBottom: 20 }}
            onClick={() => {
              setOpenAssignModal(false);
              setSelectedAssignee(null);
              setSelectedApplication(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            style={{ marginRight: 20 }}
            key="submit"
            type="primary"
            onClick={() => assignApplication()}
            disabled={!selectedAssignee}
          >
            Assign
          </Button>,
        ]}
      >
        <div>
          <div style={{ padding: "0 20px" }}>
            <Search
              style={{ marginTop: 12, marginBottom: 12 }}
              placeholder="Search..."
              onSearch={handleSearch}
              enterButton
            />
          </div>
          <List
            className={styles.list_container}
            itemLayout="horizontal"
            dataSource={filteredSupervisors}
            renderItem={(item, index) => (
              <List.Item
                className={
                  selectedAssignee && selectedAssignee.id === item.id ? styles.list_item_active : styles.list_item
                }
                onClick={() => setSelectedAssignee(item)}
              >
                <List.Item.Meta
                  title={
                    <p
                      style={{
                        fontWeight: 500,
                        marginTop: -6,
                        marginBottom: 10,
                        marginLeft: 20,
                      }}
                    >
                      {" "}
                      {item.username}
                    </p>
                  }
                  description={
                    <p
                      style={{
                        marginTop: -6,
                        marginBottom: 10,
                        marginLeft: 20,
                      }}
                    >
                      Assigned applications - {item.assigned_application_count}
                    </p>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Main;

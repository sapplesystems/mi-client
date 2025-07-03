import React, { useEffect, useState } from "react";
import { Button, Input, message, Segmented, Select, Table, Tooltip } from "antd";
import styles from "../../../styles/Main.module.scss";
import { CopyOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import apiRequest from "../../../utils/request";
import { useRouter } from "next/router";
import { getOrgDetails } from "../../../utils/helper";
import ShowOrganization from "./ShowOrganization";

const OrgKeyToHeading = {
  id: "ID",
  company_address: "Address",
  registered_company_name: "Name",
  company_email: "Email",
  company_website: "Company Website",
  mobile_number: "Mobile number",
  logo_url: "Logo URL",
  aadhar_no: "Aadhar number",
  cin_no: "CIN number",
  gst_number: "GST number",
  gst_verified: "GST verified?",
  pan_no: "PAN number",
  tan_no: "TAN Number",
  created_at: "Created at",
  updated_at: "Updated at",
};

const orgKeys = [
  "id",
  "registered_company_name",
  "company_email",
  "company_website",
  "mobile_number",
  "company_address",
  "logo_url",
  "aadhar_no",
  "cin_no",
  "gst_number",
  "gst_verified",
  "pan_no",
  "tan_no",
  //   "created_at",
  //   "updated_at",
];

const OrganizationHome = () => {
  return (
    <div className={styles.main__container}>
      <div className={styles.home}>
        <h3>Organizations</h3>
      </div>
      <Organizations />
    </div>
  );
};

const Organizations = () => {
  const router = useRouter();
  const [segment, setSegment] = useState("all");
  const [tableLoading, setTableLoading] = useState(false);
  const [org, setOrg] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [orgToView, setOrgToView] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    getOrgs();
    setIsModalOpen(false);
    setOrgToView("");
  };

  const getOrgs = (page = 1) => {
    const url = `/api/v1/get-all-orgs/?` + (searchInput !== "" ? `query=${searchInput}&` : ``) + `page=${page}`;

    setTableLoading(true);
    apiRequest({
      method: "GET",
      url,
    })
      .then((resp) => {
        if (resp.status === 204) {
          message.warning("No organizations found!");
        } else {
          setTotalCount(resp?.data?.total_count);
          setDataSource(resp?.data);
        }
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => setTableLoading(false));
  };

  useEffect(() => {
    getOrgs();
  }, [searchInput, segment]);

  const columns = [
    {
      // width: 300,
      title: "Name",
      dataIndex: "registered_company_name",
      key: "registered_company_name",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data?.org?.registered_company_name}</p>
            </span>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "company_email",
      key: "company_email",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data.org?.company_email}</p>
            </span>
          </>
        );
      },
    },
    {
      width: 300,
      title: "Address",
      dataIndex: "company_address",
      key: "company_address",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data?.org?.company_address}</p>
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
                  setOrgToView({
                    org: data.org,
                    partnerDetails: data.org_partners,
                    branchDetails: data.org_branches,
                  });
                  showModal();
                }}
              >
                View
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
    setCurrentPage(page);
    getOrgs(page);
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
        <h4>Organizations</h4>
      </div>
      <div className={styles.application__header}>
        <div>
          <Input
            allowClear
            className={styles.input__gray}
            prefix={<SearchOutlined style={{ color: "#6F767E" }} />}
            placeholder="Search by name, email etc"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <p className={styles.infoText}>Showing {dataSource?.length} organizations</p>
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
          //  pagination={{
          //     position: ["bottomCenter"],
          //  }}
        />
      </div>
      <ShowOrganization isModalOpen={isModalOpen} handleOk={handleOk} org={orgToView} getOrgs={getOrgs} />
    </div>
  );
};

export default OrganizationHome;

import React, { useEffect, useState } from "react";
import styles from "../../../styles/Product.module.scss";

import { Modal, Button, ConfigProvider, Segmented, Upload, message } from "antd";
import EditOrganization from "./EditOrganization";
import PartnerDetails from "../Profile/PartnerDetails";
import BranchDetails from "../Profile/BranchDetails";
import { getOrgDetails } from "../../../utils/helper";
import apiRequest from "../../../utils/request";

const options = [
  {
    label: "Organization Details",
    value: "orgDetails",
  },
  {
    label: `Partners/Directors Details`,
    value: "partnerDetails",
  },
  {
    label: `Branch/Unit Details`,
    value: "branchDetails",
  },
];

const ShowOrganization = ({ isModalOpen, handleCancel, handleOk, org }) => {
  const [data, setData] = useState({});
  const [segment, setSegment] = useState("orgDetails");
  const [orgState, setOrgState] = useState({
    orgDetails: null,
    partnerDetails: null,
    branchDetails: null,
  });

  const getOrgDetails = async (orgId) => {
    const url = `/api/v1/get-org-details-by-id/${orgId}/`;
    const res = await apiRequest({ method: "GET", url, data });
    const orgData = res.data;

    setOrgState({
      orgDetails: orgData.org,
      partnerDetails: orgData.org_partners || null,
      branchDetails: orgData.org_branches || null,
    });
  };

  useEffect(() => {
    if (org) {
      getOrgDetails(org.org.id);
    }
  }, [org, isModalOpen]);

  const updateOrgDetails = async (organization = null, partners = null, branches = null) => {
    try {
      const url = `/api/v1/update-org/${org.org.id}/`;
      let data = {
        org: organization == null ? org.org : organization,
        org_partners: partners == null ? org.partnerDetails : partners,
        org_branches: branches == null ? org.branchDetails : branches,
      };

      console.log("Update-Org Payload:", data);
      let org_url = data.org.logo_url;
      if (org_url) {
        const split_url = org_url.split("/");
        if (split_url.length > 0 && split_url[0] == "https:") {
          const url = split_url.slice(3).join("/").split("?")[0];
          data.org.logo_url = url;
        } else {
          message.error("Invalid URL format:", org_url);
          return;
        }
      }
      const res = await apiRequest({ method: "POST", url, data });
      message.success(res.data.msg);
      getOrgDetails(org.org.id);
    } catch (error) {
      console.log(error);
      message.error(error?.data?.error);
    }
  };

  const renderSegments = () => {
    if (segment === "orgDetails") {
      return (
        <EditOrganization org={orgState.orgDetails} handleChange={handleChange} updateOrgDetails={updateOrgDetails} />
      );
    } else if (segment === "partnerDetails") {
      return <PartnerDetails org={orgState} setOrg={setOrgState} updateOrgDetails={updateOrgDetails} />;
    } else {
      return <BranchDetails org={orgState} setOrg={setOrgState} updateOrgDetails={updateOrgDetails} />;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedOrg = { ...org };
    updatedOrg.orgDetails = {
      ...updatedOrg.orgDetails,
      [name]: value,
    };

    setOrgState(updatedOrg);
  };

  const columns = [
    {
      title: "id",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "id",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <Modal
      centered
      title=""
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleOk}
      cancelButtonProps={{ style: { display: "none" } }}
      destroyOnClose={true}
      width={950}
      footer={null}
    >
      <div style={{ flex: 1, maxHeight: 500, minHeight: 500, overflow: "scroll" }}>
        <ConfigProvider
          theme={{
            components: {
              Segmented: {
                itemActiveBg: "red",
                itemHoverColor: "red",
              },
            },
          }}
        >
          <Segmented
            block
            size="large"
            className={`${styles.segment}`}
            style={{ marginBottom: -10 }}
            options={options}
            value={segment}
            onChange={(e) => setSegment(e)}
          />
        </ConfigProvider>

        <div className={styles.apply__container} style={{ width: "100%", flex: 1, borderRadius: 8 }}>
          {renderSegments()}
        </div>
      </div>
    </Modal>
  );
};

export default ShowOrganization;

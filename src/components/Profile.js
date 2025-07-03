import React, { useEffect, useState ,useMemo} from "react";

import { MainLayout } from "../../src/shared";
import { getOrgDetails } from "../../utils/helper";
import styles from "../../styles/Product.module.scss";
import apiRequest, { BASE_URL, isLoggedIn } from "../../utils/request";

import { UploadOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Segmented, Upload, message } from "antd";
import OrgDetails from "../../src/components/Profile/OrgDetails";
import PartnerDetails from "../../src/components/Profile/PartnerDetails";
import BranchDetails from "../../src/components/Profile/BranchDetails";

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

const Profile = () => {
  //   const [user, setUser] = useState({});
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};
  const [segment, setSegment] = useState("orgDetails");
  const [uploading, setUploading] = useState(false);
  const [org, setOrg] = useState({
    orgDetails: null,
    partnerDetails: null,
    branchDetails: null,
  });
  const [fetchedBranchEmails, setFetchedBranchEmails] = useState([]);

  const getBranchEmails = (details) => {
    const emails = details.map((d) => d.email);
    return emails;
  };

  useEffect(() => {
    getOrgDetails()
      .then((res) => {
        if (res.data.org_branches) {
          setFetchedBranchEmails(getBranchEmails(res.data.org_branches));
        }
        setOrg({
          orgDetails: res.data.org,
          partnerDetails: res.data.org_partners,
          branchDetails: res.data.org_branches,
        });
      })
      .catch((error) => {
        console.log(error);
        message.error(error?.data?.error);
      });

    //  let user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};
    //  setUser(user);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!user) return [];
    return user.role === "branch_user"
      ? options.filter((opt) => opt.value === "orgDetails")
      : options;
  }, [user]);
  const updateOrgDetails = async (organization = null, partners = null, branches = null) => {
    try {
      const url = `/api/v1/update-org/${org.orgDetails.id}/`;

      let cleanedBranches = null;
      if (branches) {
        cleanedBranches = branches.map((branch) => {
          if (fetchedBranchEmails.includes(branch.email)) {
            const { email, ...rest } = branch;
            return rest;
          } else {
            return branch;
          }
        });
      } else if (org.branchDetails.length > 0) {
        cleanedBranches = org.branchDetails.map((branch) => {
          if (fetchedBranchEmails.includes(branch.email)) {
            const { email, ...rest } = branch;
            return rest;
          } else {
            return branch;
          }
        });
      }

      let data = {
        org: organization == null ? org.orgDetails : organization,
        org_partners: partners == null ? org.partnerDetails : partners,
        org_branches: cleanedBranches,
      };

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

      getOrgDetails()
        .then((res) => {
          if (res.data.org_branches) {
            setFetchedBranchEmails(getBranchEmails(res.data.org_branches));
          }

          setOrg({
            orgDetails: res.data.org,
            partnerDetails: res.data.org_partners,
            branchDetails: res.data.org_branches,
          });
        })
        .catch((error) => {
          console.log(error);
          message.error(error?.data?.error);
          getOrgDetails().then((res) => {
            if (res.data.org_branches) {
              setFetchedBranchEmails(getBranchEmails(res.data.org_branches));
            }

            setOrg({
              orgDetails: res.data.org,
              partnerDetails: res.data.org_partners,
              branchDetails: res.data.org_branches,
            });
          });
        });
    } catch (error) {
      console.log(error);
      message.error(error?.data?.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedOrg = { ...org };
    updatedOrg.orgDetails = {
      ...updatedOrg.orgDetails,
      [name]: value,
    };

    setOrg(updatedOrg);
  };

  const renderSegments = () => {
    console.log(segment,org.branchDetails);
    if (segment === "orgDetails") {
      
      return <OrgDetails org={org.orgDetails} handleChange={handleChange} updateOrgDetails={updateOrgDetails} branch={org.branchDetails} />;
    } else if (segment === "partnerDetails") {
      return <PartnerDetails org={org} setOrg={setOrg} updateOrgDetails={updateOrgDetails} />;
    } else {
      return <BranchDetails org={org} setOrg={setOrg} updateOrgDetails={updateOrgDetails} />;
    }
  };

  return (
    <MainLayout>
      <div className={styles.apply__header} style={{ marginBottom: 40 }}>
        <span style={{ background: "#cabdff" }} />
        <p style={{ fontSize: 40, fontWeight: 600, marginLeft: 10 }}>Profile</p>
      </div>
      <div style={{ display: "flex" }}>
        <ProfileCard org={org?.orgDetails} setOrg={setOrg} user={user} />

        <div style={{ flex: 1 }}>
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
              options={filteredOptions}
              value={segment}
              onChange={(e) => setSegment(e)}
            />
            {/* <Segmented
              block
              size="large"
              className={`${styles.segment}`}
              options={
                user.role === "branch_user" ? options.filter((option) => option.value === "orgDetails") : options
              }
              value={segment}
              onChange={(e) => setSegment(e)}
            /> */}
          </ConfigProvider>

          <div className={styles.apply__container} style={{ width: "100%", flex: 1, borderRadius: 8 }}>
            {renderSegments()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const ProfileCard = (props) => {
  const { org, setOrg, user } = props;

  const updateOrgLogo = (logo_url) => {
    apiRequest({
      method: "POST",
      url: `/api/v1/update-org-logo/${org.id}/`,
      data: {
        logo_url,
      },
    })
      .then((resp) => {
        message.success("Logo updated successfully");
        getOrgDetails()
          .then((res) => {
            setOrg({
              orgDetails: res.data.org,
              partnerDetails: res.data.org_partners,
              branchDetails: res.data.org_branches,
            });
          })
          .catch((error) => {
            message.error(error?.data?.error);
          });
      })
      .catch((error) => {
        message.error("Something went wrong");
      });
  };

  const Props = {
    name: "file",
    multiple: false,
    headers: { Authorization: `Bearer ${isLoggedIn()}` },
    action: `${BASE_URL}/api/v1/upload/`,
    accept: ".svg",
    data: {
      file_upload_category: "Org_Logo",
      upload_type: "public",
    },
    beforeUpload: (file) => {
      const isSVG = file.type === "image/svg+xml";
      if (!isSVG) {
        message.error(`${file.name} is not an svg file`);
      }
      return isSVG;
    },
    onChange: (info) => {
      // setUploading(true);
      const { status } = info.file;
      if (status === "done") {
        updateOrgLogo(info.file.response.s3_url);
      } else {
        //   setUploading(false);
      }

      if (status === "error") {
        message.error(info.file.response.error);
        //   setUploading(false);
        return;
      }
    },
  };

  return (
    <div className={styles.profile_card}>
      <div className={styles.logo_container}>
        <img src={org?.logo_url} alt="LOGO" />
      </div>
      <p>{org?.registered_company_name}</p>
      {user.role !== "branch_user" && (
        <Upload maxCount={1} {...Props}>
          <Button icon={<UploadOutlined style={{ color: "#6F767E" }} />}>
            <span style={{ color: "#6F767E", fontWeight: 600 }}>Update logo</span>
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default Profile;
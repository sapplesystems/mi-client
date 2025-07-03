"use client"
import React, { useState } from "react";
import { Button, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import styles from "../../../styles/Product.module.scss";
import {  useEffect } from "react";
const OrgDetails = (props) => {
  // const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};
  const { org, handleChange, updateOrgDetails, branch } = props;
  const [previewOnly, setPreviewOnly] = useState(true);

const [user, setUser] = useState(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }
}, []);
if (!user) return null; 

  return (
    <>
      {branch?.length != 0 &&
      user.role !== 'org_admin' ? (
        branch?.filter(org => org.user === user.id).map(org => (
          <div key={org.id} style={{ display: "flex", flexDirection: "column", background: "#ffffff" }}>
            <div className={styles.org_detail_row}>
              <label>Branch Name:</label>
              <Input
                name="branch_name"
                value={org?.branch_name ?? "-"}
                disabled
                style={{ cursor: "default", color: "#6d6d6d" }}
                onChange={handleChange}
              />
            </div>
            <div className={styles.org_detail_row}>
              <label>Email:</label>
              <Input
                name="email"
                value={org?.email ?? "-"}
                disabled={previewOnly}
                style={{ cursor: "default", color: "#6d6d6d" }}
                onChange={handleChange}
              />
            </div>
            <div className={styles.org_detail_row}>
              <label>Branch address:</label>
              <Input
                name="branch_address"
                value={org?.branch_address ?? "-"}
                disabled
                style={{ cursor: "default", color: "#6d6d6d" }}
                onChange={handleChange}
              />
            </div>
            <div className={styles.org_detail_row}>
              <label>GSTN/ Udhyam ID:</label>
              <Input
                name="identification_id"
                value={org?.identification_id ?? "-"}
                disabled
                style={{ cursor: "default", color: "#6d6d6d" }}
                onChange={handleChange}
              />
            </div>
            <div className={styles.org_detail_row}>
              <label>State:</label>
              <Input
                name="state"
                value={org?.state ?? "-"}
                disabled
                style={{ cursor: "default", color: "#6d6d6d" }}
                onChange={handleChange}
              />
            </div>
            <div className={styles.org_detail_row}>
              <label>PAN:</label>
              <Input
                name="pan_no"
                value={org?.pan_no ?? "-"}
                disabled
                style={{ cursor: "default", color: "#6d6d6d" }}
                onChange={handleChange}
              />
            </div>
            <div className={styles.org_detail_row}>
              <label>TAN:</label>
              <Input
                name="tan_no"
                value={org?.tan_no ?? "-"}
                disabled
                style={{ cursor: "default", color: "#6d6d6d" }}
                onChange={handleChange}
              />
            </div>
          </div>
        ))
      ) : (
        <div style={{ display: "flex", flexDirection: "column", background: "#ffffff" }}>
          <div className={styles.org_detail_row}>
            <label>Registered Company name:</label>
            <Input
              name="registered_company_name"
              value={org?.registered_company_name ?? "-"}
              disabled
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>Company address:</label>
            <Input
              name="company_address"
              value={org?.company_address ?? "-"}
              disabled={previewOnly}
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>Company email:</label>
            <Input
              name="company_email"
              value={org?.company_email ?? "-"}
              disabled
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>Mobile number:</label>
            <Input
              name="mobile_number"
              value={org?.mobile_number ?? "-"}
              disabled
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>TAN:</label>
            <Input
              name="tan_no"
              value={org?.tan_no ?? "-"}
              disabled
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>PAN:</label>
            <Input
              name="pan_no"
              value={org?.pan_no ?? "-"}
              disabled
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>GST number:</label>
            <Input
              name="gst_number"
              value={org?.gst_number ?? "-"}
              disabled
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>Aadhar number:</label>
            <Input
              name="aadhar_no"
              value={org?.aadhar_no ?? "-"}
              disabled
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div className={styles.org_detail_row}>
            <label>Company Website:</label>
            <Input
              name="company_website"
              value={org?.company_website ?? "-"}
              disabled={previewOnly}
              style={{ cursor: "default", color: "#6d6d6d" }}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {user.role !== "branch_user" && (
              <Button
                type="primary"
                style={{ marginTop: 20 }}
                onClick={() => {
                  if (previewOnly) {
                    setPreviewOnly(false);
                  } else {
                    updateOrgDetails(org);
                    setPreviewOnly(true);
                  }
                }}
                icon={<EditOutlined />}
              >
                {!previewOnly ? "Save" : "Edit"}
              </Button>
            )}
          </div>
        </div>
      )
      }
      
    </>

    // <>
    //   {user.role !== 'org_admin' ? (

    //     <div style={{ display: "flex", flexDirection: "column", background: "#ffffff" }}>
    //       <div className={styles.org_detail_row}>
    //         <label>Branch Name:</label>
    //         <Input
    //           name="branch_name"
    //           value={
    //             org?.branch_name ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>Email:</label>
    //         <Input
    //           name="email"
    //           value={
    //             org?.email ?? "-"}
    //           disabled={previewOnly}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>Branch address:</label>
    //         <Input
    //           name="branch_address"
    //           value={
    //             org?.branch_address ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>GSTN/ Udhyam ID:</label>
    //         <Input
    //           name="identification_id"
    //           value={
    //             org?.identification_id ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>State:</label>
    //         <Input
    //           name="state"
    //           value={
    //             org?.state ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>PAN:</label>
    //         <Input
    //           name="pan_no"
    //           value={
    //             org?.pan_no ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>TANr:</label>
    //         <Input
    //           name="tan_no"
    //           value={
    //             org?.tan_no ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //     </div>
    //   ) : (
    //     <div style={{ display: "flex", flexDirection: "column", background: "#ffffff" }}>
    //       <div className={styles.org_detail_row}>
    //         <label>Registered Company name:</label>
    //         <Input
    //           name="registered_company_name"
    //           value={org?.registered_company_name ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>Company address:</label>
    //         <Input
    //           name="company_address"
    //           value={org?.company_address ?? "-"}
    //           disabled={previewOnly}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>Company email:</label>
    //         <Input
    //           name="company_email"
    //           value={org?.company_email ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>Mobile number:</label>
    //         <Input
    //           name="mobile_number"
    //           value={org?.mobile_number ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>TAN:</label>
    //         <Input
    //           name="tan_no"
    //           value={org?.tan_no ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>PAN:</label>
    //         <Input
    //           name="pan_no"
    //           value={org?.pan_no ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>GST number:</label>
    //         <Input
    //           name="gst_number"
    //           value={org?.gst_number ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>Aadhar number:</label>
    //         <Input
    //           name="aadhar_no"
    //           value={org?.aadhar_no ?? "-"}
    //           disabled={true}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className={styles.org_detail_row}>
    //         <label>Company Website:</label>
    //         <Input
    //           name="company_website"
    //           value={org?.company_website ?? "-"}
    //           disabled={previewOnly}
    //           style={{ cursor: "default", color: "#6d6d6d" }}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div style={{ display: "flex", justifyContent: "flex-end" }}>
    //         {user.role !== "branch_user" && (
    //           <Button
    //             type="primary"
    //             style={{ marginTop: 20 }}
    //             onClick={() => {
    //               if (previewOnly) {
    //                 setPreviewOnly(false);
    //               } else {
    //                 updateOrgDetails(org);
    //                 setPreviewOnly(true);
    //               }
    //             }}
    //             icon={<EditOutlined />}
    //           >
    //             {!previewOnly ? "Save" : "Edit"}
    //           </Button>
    //         )}
    //       </div>
    //     </div>
    //   )}
    // </>
  );

};

export default OrgDetails;

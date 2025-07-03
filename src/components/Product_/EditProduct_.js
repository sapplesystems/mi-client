import React, { useState } from "react";
import { MainLayout } from "../../shared";
import styles from "../../../styles/Product.module.scss";
import { Button, Input, Select, Tooltip, Upload } from "antd";
import { InfoCircleFilled, UploadOutlined } from "@ant-design/icons";

const data = [
  {
    heading: "Product Information",
    inputFields: [
      {
        label: "HSN Code of product",
        type: "input",
        tooltipText: "HSS Code of product",
      },
      {
        label: "Product Description",
        type: "textArea",
        tooltipText: "Description for your product",
      },
      {
        label: "Category",
        type: "select",
        tooltipText: "Category",
        options: [
          {
            value: "category 1",
            label: "category 1",
          },
          {
            value: "category 2",
            label: "category 2",
          },
        ],
      },
    ],
  },
  {
    heading: "Certification",
    inputFields: [
      {
        label: "Certification level",
        type: "input",
        tooltipText: "Certification level",
      },
      {
        label: "Validity",
        type: "input",
        tooltipText: "Validity",
      },
      {
        label: "State of Issue",
        type: "input",
        tooltipText: "State of issue",
      },
      {
        label: "Upload accredition report / tests",
        type: "file upload",
        tooltipText: "Upload accredition report / tests",
      },
    ],
  },
  {
    heading: "Pricing",
    inputFields: [
      {
        label: "Product Price",
        type: "input",
        tooltipText: "Price of your product",
      },
      {
        label: "Making Price",
        type: "input",
        tooltipText: "Making Price",
      },
    ],
  },
  {
    heading: "Composition",
    inputFields: [
      {
        label: "Product Price",
        type: "input",
        tooltipText: "Price of your product",
      },
      {
        label: "Making Price",
        type: "input",
        tooltipText: "Making Price",
      },
    ],
  },
];

const EditProduct = () => {
  const [inputs, setInputs] = useState([]);
  const handleChange = (evt, item) => {
    setInputs({ ...inputs, [evt.target.id]: evt.target.value });
  };
  const renderInput = (item) => {
    if (item.type === "input") {
      return (
        <Input
          className={styles.input__gray}
          placeholder={item.label}
          id={item.label}
          value={inputs[item.label]}
          onChange={(e) => handleChange(e, item)}
        />
      );
    } else if (item.type === "textArea") {
      return (
        <Input.TextArea
          rows={5}
          placeholder={item.label}
          className={styles.textArea}
          id={item.label}
          value={inputs[item.label]}
          onChange={(e) => handleChange(e, item)}
        />
      );
    } else if (item.type === "select") {
      return (
        <Select
          placeholder={item.label}
          className={styles.select}
          bordered={false}
          showArrow={false}
          onChange={(e) => {
            setInputs({ ...inputs, [item.label]: e });
          }}
          options={item.options}
        />
      );
    } else if (item.type === "file upload") {
      const { Dragger } = Upload;
      const props = {
        name: "file",
        multiple: true,
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        onChange(info) {
          const { status } = info.file;
          if (status !== "uploading") {
            console.log(info.file, info.fileList);
          }
          if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
        onDrop(e) {
          console.log("Dropped files", e.dataTransfer.files);
        },
      };
      return (
        <Dragger {...props} className={styles.fileupload}>
          <div className={styles.uploadBtn}>
            <UploadOutlined />
            <p>Click or drop Files</p>
          </div>
        </Dragger>
      );
    }
  };
  return (
    <MainLayout>
      <div className={styles.editing__headings}>
        <h3>Editing application ABC industries / towel</h3>
        <h4>Notifications about any updates made here will be sent to ABC Industries via email and their dashboard</h4>
      </div>
      <div className={styles.edit__container}>
        {data.map((item) => {
          return (
            <div className={styles.product__details}>
              <div className={styles.product__heading}>
                <span />
                <h4>{item.heading}</h4>
              </div>

              <div className={styles.details__container}>
                {item.inputFields.map((item) => {
                  return (
                    <div className={styles.input__container}>
                      <div>
                        <label>{item.label}</label>
                        <Tooltip title={item.tooltipText}>
                          <InfoCircleFilled />
                        </Tooltip>
                      </div>
                      {renderInput(item)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className={styles.ctaBtns}>
          <Button>Discard</Button>
          <Button type="primary">Save Changes</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProduct;

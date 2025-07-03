import React, { useState } from "react";
import { Input, message, Radio, Select, Upload, Spin, Form, Tooltip, Button } from "antd";
import { UploadOutlined, InfoCircleFilled } from "@ant-design/icons";
import styles from "../../styles/Product.module.scss";
import apiRequest, { BASE_URL, isLoggedIn } from "../../utils/request.js";

const RenderInput = (props) => {
  const { handleChange, item, item_value, previewOnly, placeholder } = props;

  const renderTooltip = (item) => {
    if (item?.tooltipText) {
      return (
        <Tooltip title={item.tooltipText}>
          <InfoCircleFilled />
        </Tooltip>
      );
    }
    return null;
  };

  const renderLabel = () => {
    return (
      <div className={styles.input__label__container}>
        <label className={styles.input__label}>{item.name}</label>
        {renderTooltip(item)}
      </div>
    );
  };

  const handleChangeByInputType = (val, input_type) => {
    if (input_type === "numeric") {
      handleChange(val.replace(/\D/g, ""));
    } else if (input_type === "alphabetic") {
      handleChange(val.replace(/[^A-Za-z]/gi, ""));
    } else {
      handleChange(val);
    }
  };

  const render = () => {
    if (item.type === "input") {
      return (
        <Form.Item
          key={item?.key}
          name={item?.key}
          label={renderLabel()}
          rules={[
            {
              required: item?.required,
              message: "This field is required!",
            },
          ]}
        >
          <Input
            className={styles.input__gray}
            placeholder={item.placeholder ? item.placeholder : item.name}
            id={item.name}
            name={item.key}
            value={item_value}
            onChange={(e) => handleChangeByInputType(e.target.value, item.inputType)}
            disabled={item?.disabled || false || previewOnly}
            type={item.inputType == "numeric" ? "number" : "text"}
          />
        </Form.Item>
      );
    } else if (item.type === "textArea") {
      return (
        <Form.Item
          key={item?.key}
          name={item?.key}
          label={renderLabel()}
          rules={[
            {
              required: item?.required,
              message: "This field is required!",
            },
          ]}
        >
          <Input.TextArea
            rows={5}
            placeholder={item.name}
            className={styles.textArea}
            id={item.name}
            value={item_value}
            onChange={(e) => handleChange(e.target.value)}
            disabled={item?.disabled || false || previewOnly}
          />
        </Form.Item>
      );
    } else if (item.type === "select") {
      return (
        <Form.Item
          key={item?.key}
          name={item?.key}
          label={renderLabel()}
          rules={[
            {
              required: item?.required,
              message: "This field is required!",
            },
          ]}
        >
          <Select
            placeholder={item.placeholder ? item.placeholder : item.name}
            className={styles.select}
            bordered={false}
            showArrow={false}
            value={item_value}
            onChange={(e) => handleChange(e)}
            options={item.options}
            disabled={item?.disabled || false || previewOnly}
          />
        </Form.Item>
      );
    } else if (item.type === "select-search") {
      return (
        <Form.Item
          key={item?.key}
          name={item?.key}
          label={renderLabel()}
          rules={[
            {
              required: item?.required,
              message: "This field is required!",
            },
          ]}
        >
          <Select
            filterOption={false}
            showSearch
            placeholder="Start typing..."
            size="large"
            loading={item?.loading}
            onChange={(e, option) => {
              handleChange(option);
            }}
            onSearch={item?.onSearch}
            options={item?.options}
            value={item_value}
            notFoundContent={item?.loading ? <Spin size="small" /> : null}
            disabled={item?.disabled || false || previewOnly}
          />
        </Form.Item>
      );
    } else if (item.type === "radio") {
      return (
        <Form.Item
          key={item?.key}
          name={item?.key}
          label={renderLabel()}
          rules={[
            {
              required: item?.required,
              message: "This field is required!",
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            value={item_value}
            options={item?.options}
            disabled={item?.disabled || false || previewOnly}
          />
        </Form.Item>
      );
    } else if (item.type === "file upload") {
      const { Dragger } = Upload;
      const props = {
        name: "file",
        multiple: true,
        headers: { Authorization: `Bearer ${isLoggedIn()}` },
        action: `${BASE_URL}/api/v1/upload/`,
        data: {
          file_upload_category: "application_files",
          upload_type: "private",
        },
        beforeUpload: (info) => {
          const size_in_MB = info.size / 1024;
          if (size_in_MB > 2048) {
            message.error("File size cannot exceed 2MB");
            info.status = "error";
            return false;
          }
        },
        onChange(info) {
          const { status } = info.file;
          console.log(
            "info",
            info.fileList?.map((f) => f?.response?.s3_url)
          );

          if (status === "done") {
            handleChange(info.fileList?.map((f) => f?.response?.s3_url));
            message.success(`File uploaded successfully`);
          }

          if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
            return;
          }
        },
        onDrop(e) {
          console.log("Dropped files", e.dataTransfer.files);
        },
        onRemove(e) {
          message.warning(`File removed successfully`);
        },
      };

      const handleDownload = () => {
        item_value.forEach((fileUrl) => {
          const urlObject = new URL(fileUrl);
          const fileName = urlObject.pathname.split("/").pop();
          fetch(fileUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              link.click();
              window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
              console.error(`Error downloading file ${fileName}:`, error);
            });
        });
      };

      return (
        <Form.Item
          key={item?.key}
          name={item?.key}
          label={renderLabel()}
          rules={[
            {
              required: item?.required,
              message: "This field is required!",
            },
          ]}
        >
          {!previewOnly ? (
            <Dragger {...props} className={styles.fileupload} maxCount={item.multiple != undefined ? 1 : 100}>
              <div className={styles.uploadBtn}>
                <UploadOutlined />
                <p>Click or drop Files</p>
              </div>
            </Dragger>
          ) : (
            <Button
              disabled={item_value ? false : true}
              type="primary"
              ghost
              onClick={() => {
                handleDownload();
              }}
            >
              Download
            </Button>
          )}
        </Form.Item>
      );
    }
  };
  return render();
};

export default RenderInput;

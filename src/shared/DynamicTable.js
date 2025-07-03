import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Popconfirm, Table, Tooltip } from "antd";
import DynamicModal from "./DynamicModal.js";

const DynamicTable = ({ previewOnly, fields, data, setData, type, viewType, status }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const handleModalSubmit = (d) => {
    let uniqueKey = "sr_no";
    if (type == "branch") uniqueKey = "identification_id";
    const newData = [...data, { ...d, key: d[uniqueKey] }];
    setData(newData);
    setModalOpen(false);
  };

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleDownload = (item_value) => {
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

  const columns = fields?.map((col) => {
    if (col.type === "file upload") {
      return {
        title: col?.title,
        key: col?.key,
        dataIndex: col?.key,
        render: (_, record) => {
          if (record.files) {
            return (
              <Button
                disabled={status === "draft" || status === "changeRequest"}
                onClick={() => {
                  if (record.files) {
                    handleDownload(record.files);
                  }
                }}
              >
                Download
              </Button>
            );
          } else {
            return (
              <Tooltip title="No files found">
                <Button disabled={true}>Download</Button>
              </Tooltip>
            );
          }
        },
      };
    }
    return {
      title: col?.title,
      key: col?.key,
      dataIndex: col?.key,
    };
  });

  if (previewOnly == false || status === "draft" || status == undefined) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        if (data.length >= 1) {
          return (
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          );
        }
        return null;
      },
    });
  }

  return (
    <div>
      {previewOnly == false && (
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add {type || "row"}
        </Button>
      )}
      <DynamicModal
        open={modalOpen}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        fields={fields}
        type={type}
      />
      <Table bordered dataSource={data} columns={columns} pagination={false}></Table>
    </div>
  );
};
export default DynamicTable;

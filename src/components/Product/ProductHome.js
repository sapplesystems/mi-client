import React, { useEffect, useState } from "react";
import { Button, Input, message, Table } from "antd";
import styles from "../../../styles/Team.module.scss";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import apiRequest from "../../../utils/request";
import { useRouter } from "next/router";
import AddProduct from "./AddProduct";

const getCategories = (setCategories) => {
  const url = `/api/v1/get-all-product-categories/?`;
  apiRequest({
    method: "GET",
    url,
  })
    .then((resp) => {
      setCategories(resp?.data);
    })
    .catch((error) => {
      message.error(error?.data?.error);
    });
};

const ProductHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = (productId) => {
    setIsModalOpen(false);
    getProducts();
    setProductId(productId);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getProducts = (page = 1) => {
    const url = `/api/v1/get-all-products/?` + (searchInput !== "" ? `query=${searchInput}&` : ``) + `page=${page}`;
    setTableLoading(true);
    apiRequest({
      method: "GET",
      url,
    })
      .then((resp) => {
        setDataSource(resp?.data?.products);
        setTotalCount(resp?.data?.total_count);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => setTableLoading(false));
  };

  return (
    <div className={styles.main__container}>
      <div className={styles.home}>
        <h3>Products</h3>
        <Button type="primary" onClick={showModal}>
          <PlusOutlined /> Add Products
        </Button>
        <AddProduct
          product={null}
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          // categories={categories}
        />
      </div>
      <Products
        searchInput={searchInput}
        dataSource={dataSource}
        productId={productId}
        totalCount={totalCount}
        getProducts={getProducts}
        tableLoading={tableLoading}
        setTableLoading={setTableLoading}
      />
    </div>
  );
};

const Products = ({ searchInput, dataSource, totalCount, productId, getProducts, tableLoading, setTableLoading }) => {
  const router = useRouter();
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : {};

  const [segment, setSegment] = useState("all");

  const [org, setOrg] = useState();
  const [categories, setCategories] = useState([]);
  const [productToEdit, setProductToEdit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setProductToEdit("");
  };

  const handleOk = () => {
    handleCancel();
    getProducts();
  };

  const getCategories = async () => {
    const url = `/api/v1/get-all-product-categories/?`;
    apiRequest({
      method: "GET",
      url,
    })
      .then((resp) => {
        setCategories(resp?.data);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  useEffect(() => {
    getProducts();
  }, [searchInput, segment, productId]);

  useEffect(() => {
    getCategories();
  }, []);

  const columns = [
    {
      width: 400,
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data?.name}</p>
            </span>
          </>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data.category}</p>
            </span>
          </>
        );
      },
    },
    {
      title: "HSN Code",
      dataIndex: "hsn_code",
      key: "hsn_code",
      render: (_, data) => {
        return (
          <>
            <span>
              <p className={styles.col_value}>{data.hsn_code}</p>
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
                  setProductToEdit(data);
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
    setCurrentPage(page);
    getProducts(page);
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
        <h4>Products</h4>
      </div>
      <div className={styles.application__header}>
        <div>
          <Input
            style={{
              width: 350,
            }}
            allowClear
            className={styles.input__gray}
            prefix={<SearchOutlined style={{ color: "#6F767E" }} />}
            placeholder="Search by name, category, HSN Code"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <p className={styles.infoText}>Showing {dataSource?.length} products</p>
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
      <AddProduct isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} product={productToEdit} />
    </div>
  );
};

export default ProductHome;

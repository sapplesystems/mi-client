import React, { useState } from "react";
import { Input, Select, Form, Spin, Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import apiRequest from "../../utils/request.js";
import { debounce } from "../utils/search.js";
import styles from "../../styles/Product.module.scss";

const ProductSearch = ({ data, handleChange, previewOnly, viewType, step }) => {
  const [products, setProducts] = useState({ loading: false, data: [] });
  const [loading, setLoading] = useState(false);

  const searchProducts = (query) => {
    setProducts({ ...products, loading: true });
    setLoading(true);
    apiRequest({ url: `/api/v1/search-product/?query=${query}` })
      .then((resp) => {
        setProducts({ data: resp?.data, loading: false });
        setLoading(false);
      })
      .catch((error) => {
        setProducts({ ...products, loading: false });
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (query) => {
    setLoading(true);
    debounce(() => {
      searchProducts(query);
    }, 800)();
  };

  const getProductOptions = (product_list) => {
    return product_list?.data?.map((p) => {
      return {
        label: `${p?.hsn_code} - ${p?.name}`,
        name: p?.name,
        value: p?.hsn_code,
        id: p?.id,
        category: p?.category,
        description: p?.description,
        hsn_code: p?.hsn_code,
      };
    });
  };

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
      <div>
        <label className={styles.input__label}>{data.name}</label>
        {renderTooltip(data)}
      </div>
    );
  };

  return (
    <Form.Item
      key={data?.key}
      name={data?.key}
      label={renderLabel()}
      rules={[
        {
          required: data?.required,
          message: "This field is required!",
        },
      ]}
    >
      <Select
        filterOption={false}
        showSearch
        placeholder="Search by product name/HSN code"
        size="large"
        loading={loading || data?.loading}
        onChange={(e, option) => {
          handleChange(option);
        }}
        onSearch={handleSearch}
        options={getProductOptions(products)}
        notFoundContent={data?.loading ? <Spin size="small" /> : null}
        disabled={previewOnly || (step == 1 && viewType === "edit")}
      />
    </Form.Item>
  );
};

export default ProductSearch;

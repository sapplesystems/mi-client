import React, { useEffect, useState, useRef } from "react";
import { ConsoleSqlOutlined, DownOutlined } from "@ant-design/icons";
import apiRequest from "../../../utils/request";
import { PlusOutlined } from "@ant-design/icons";

import { Button, Modal, Form, Input, Dropdown, Space, Select, Divider, message } from "antd";
const { TextArea } = Input;

const AddProduct = ({ isModalOpen, handleCancel, handleOk, product }) => {
  const [productState, setProductState] = useState({});
  const [showError, setShowError] = useState(false);
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({});
  const inputRef = useRef(null);
  const [form] = Form.useForm();

  const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const getCategories = () => {
    const url = `/api/v1/get-all-product-categories/?`;
    apiRequest({
      method: "GET",
      url,
    })
      .then((resp) => {
        let data = resp?.data;
        setCategories(data);
        let o = data?.map((c) => {
          return { value: c.category, label: c.category };
        });
        setOptions(o);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setProductState({
        name: product.name,
        description: product.description,
        category: product.category,
        category_code: product.category_code,
        hsn_code: product.hsn_code,
      });
    } else {
      setProductState({});
    }
  }, [isModalOpen, product]);

  useEffect(() => {}, [isModalOpen]);

  const addProduct = async () => {
    apiRequest({
      url: "/api/v1/add-product/",
      method: "POST",
      data: productState,
    })
      .then((resp) => {
        message.success(resp.data.msg);
      })
      .catch((error) => {
        message.error(error?.data?.msg);
      });
  };

  const editProduct = async () => {
    apiRequest({
      url: `/api/v1/update-product/${product.id}/`,
      method: "POST",
      data: productState,
    })
      .then((resp) => {
        message.success(resp.data.msg);
      })
      .catch((error) => {
        message.error(error?.data?.msg);
      });
  };

  const handleSubmit = () => {
    //Call API to invite
    let show_error =
      productState.name && productState.description && productState.category && productState.hsn_code ? false : true;
    setShowError(show_error);
    if (show_error) return;
    if (product) {
      editProduct().then(() => {
        form.resetFields();
        handleOk();
      });
    } else {
      addProduct().then(() => {
        form.resetFields();
        handleOk(productState.hsn_code);
      });
    }
  };

  const getCategoryCode = (category) => {
    return categories.find((c_data) => c_data.category === category).category_code;
  };

  const addCategory = () => {
    if (
      categories.find((c) => {
        return c.category === newCategory.category;
      })
    ) {
      message.error("Same Category already exists!");
    } else {
      setOptions((prevState) => {
        return [{ label: newCategory.category, value: newCategory.category }, ...prevState];
      });
      setCategories((prevState) => {
        return [
          {
            category: newCategory.category,
            category_code: newCategory.category_code,
          },
          ...prevState,
        ];
      });
      setNewCategory({});
    }
  };

  return (
    <Modal
      title={product ? "Edit Product" : "Add Product"}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={product ? "Edit" : "Add"}
      destroyOnClose={true}
    >
      <Form
        form={form}
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 19,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TextArea
            rows={4}
            value={productState.name}
            defaultValue={productState.name}
            onChange={(e) =>
              setProductState((prevState) => {
                return { ...prevState, name: e.target.value };
              })
            }
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TextArea
            rows={4}
            defaultValue={productState.description}
            value={productState.description}
            onChange={(e) =>
              setProductState((prevState) => {
                return { ...prevState, description: e.target.value };
              })
            }
          />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            disabled={product}
            showSearch
            defaultValue={productState.category}
            value={productState.category}
            filterOption={filterOption}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Space
                  style={{
                    padding: "0 8px 4px",
                  }}
                >
                  <Input
                    placeholder="Category"
                    ref={inputRef}
                    value={newCategory.category}
                    onChange={(e) =>
                      setNewCategory((prevState) => {
                        return { ...prevState, category: e.target.value };
                      })
                    }
                  />
                  <Input
                    placeholder="Category code"
                    ref={inputRef}
                    value={newCategory.category_code}
                    onChange={(e) =>
                      setNewCategory((prevState) => {
                        return { ...prevState, category_code: e.target.value };
                      })
                    }
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addCategory}></Button>
                </Space>
              </>
            )}
            onChange={(v) =>
              setProductState((prevState) => {
                return {
                  ...prevState,
                  category: v,
                  category_code: getCategoryCode(v),
                };
              })
            }
            options={options}
          />
        </Form.Item>
        <Form.Item
          label="HSN Code"
          name="hsn_code"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            disabled={product}
            defaultValue={productState.hsn_code}
            type="number"
            value={productState.hsn_code}
            onChange={(e) =>
              setProductState((prevState) => {
                return { ...prevState, hsn_code: e.target.value };
              })
            }
          />
        </Form.Item>
        {showError && <div style={{ color: "red" }}>{"Please enter all required info!"}</div>}
      </Form>
    </Modal>
  );
};

export default AddProduct;

import React, { useState, useEffect } from "react";
import { MainLayout } from "../../shared";
import { CloseOutlined, InfoCircleFilled } from "@ant-design/icons";
import styles from "../../../styles/Product.module.scss";
import { Button, Divider, Modal, Tooltip, message, Form, Select } from "antd";
import Success from "../../../assets/success.svg";
import Image from "next/image";
import RenderInput from "../../utils/RenderInput";
import apiRequest from "../../../utils/request.js";
import { debounce } from "../../utils/search.js";
import DynamicTable from "../../shared/DynamicTable.js";
import { useRouter } from "next/router";
import ProductSearch from "../../shared/ProductSearch.js";
import DynamicForm from "../../shared/DynamicForm.js";

let defaultStepKeys = [
  "product_selection",
  //'regulation_details',
  "label_criteria",
];

let lvaKeys = ["product_details", "compositions", "sm_process", "pricing_details", "certifications", "declaration"];

const defaultSidebarItems = ["Product Selection", "Made in India Label Criteria"];

const lvaSidebarItems = [
  "Product Details",
  "Raw material Details",
  "Special Manufacturing Process",
  "Product Price Information",
  "Certification",
  "Declaration",
];

const lvaElements = [
  {
    name: "Select label criteria",
    type: "radio",
    options: [
      { label: "Melted and Poured", value: "melted_poured" },
      { value: "local_value_addition", label: "Local Value Addition (LVA)" },
    ],
    tooltipText: false,
    key: "label_criteria",
    title: "Select label criteria",
  },
];

const meltedElements = [
  ...lvaElements,
  {
    name: "Melted & Poured criteria",
    type: "select",
    options: [
      { label: "Scrape Steel", value: "Scrape Steel" },
      { value: "Iron Ore", label: "Iron Ore" },
    ],
    tooltipText: false,
    key: "melted_criteria",
    title: "Melted & Poured criteria",
  },
];

const AddProduct = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productSelection, setProductSelection] = useState({
    wholly_grown_product: true,
  });
  const [productRegulation, setProductRegulation] = useState({});
  const [labelCriteria, setLabelCriteria] = useState({
    label_criteria: "melted_poured",
  });
  const [productDetails, setProductDetails] = useState({});
  const [compositions, setCompositions] = useState([]);
  const [smProcess, setSmProcess] = useState({});
  const [pricingDetails, setPricingDetails] = useState({});
  const [certifications, setCertifications] = useState({});
  const [declaration, setDeclaration] = useState({});
  const [applicationId, setApplicationId] = useState("");
  const [products, setProducts] = useState({ loading: false, data: [] });
  const [stepKeys, setStepKeys] = useState(defaultStepKeys);
  const [sidebarItems, setSidebarItems] = useState(defaultSidebarItems);

  const getProductOptions = (product_list) => {
    return product_list?.data?.map((p) => {
      return {
        label: `${p?.name} - ${p?.hsn_code}`,
        name: p?.name,
        value: p?.hsn_code,
        id: p?.id,
        category: p?.category,
        description: p?.description,
        hsn_code: p?.hsn_code,
      };
    });
  };

  const searchProducts = (query) => {
    setProducts({ ...products, loading: true });
    apiRequest({ url: `/api/v1/search-product/?query=${query}` })
      .then((resp) => {
        setProducts({ data: resp?.data, loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formElements = {
    product_selection: {
      section: "Product Selection",
      inputFields: [
        {
          name: "Search for product",
          type: "custom",
          tooltipText: "HSN Code of product",
          key: "product",
          component: ProductSearch,
          title: "Search for product",
        },
        {
          name: "HSN Code",
          type: "input",
          key: "hsn_code",
          disabled: true,
          title: "HSN Code",
        },
        {
          name: "Product Description",
          type: "textArea",
          tooltipText: "Description for your product",
          key: "description",
          disabled: true,
          title: "Product Description",
        },
        {
          name: "Product Category",
          type: "input",
          tooltipText: false,
          disabled: true,
          key: "category",
          title: "Product Category",
        },
        {
          name: "Are imported/non-Indian origin product(s) used in the manufacturing/processing of this product?",
          type: "radio",
          options: [
            { value: true, label: "No" },
            { label: "Yes", value: false },
          ],
          tooltipText: false,
          key: "wholly_grown_product",
          title: "Are imported/non-Indian origin product(s) used in the manufacturing/processing of this product?",
        },
      ],
    },
    label_criteria: {
      section: "Made in India Label Criteria",
      inputFields: meltedElements,
    },
    product_details: {
      section: "Product Details",
      inputFields: [
        {
          name: "Units",
          title: "Units",
          type: "input",
          tooltipText: false,
          key: "units",
        },
        {
          name: "Total cost price",
          title: "Total cost price",
          type: "input",
          tooltipText: false,
          key: "total_cost_price",
        },
        {
          name: "Total labour cost",
          title: "Total labour cost",
          type: "input",
          tooltipText: false,
          key: "total_labour_cost",
        },
        {
          name: "Total Overhead cost",
          title: "Total labour cost",
          type: "input",
          tooltipText: false,
          key: "total_overhead_cost",
        },
      ],
    },
    compositions: {
      section: "Raw Material Details",
      type: "multi-row",
      inputFields: [
        {
          name: "S.No",
          type: "input",
          tooltipText: false,
          key: "sr_no",
          title: "S.No",
          required: true,
        },
        {
          type: "custom",
          name: "Search for product HSN Code",
          tooltipText: "HSN Code of product",
          key: "hsn_code",
          title: "HSN Code",
          required: true,
          component: ProductSearch,
        },
        {
          name: "Quantity",
          type: "input",
          tooltipText: false,
          key: "quantity",
          title: "Quantity",
          required: true,
        },
        {
          name: "Unit price of each raw",
          type: "input",
          tooltipText: false,
          key: "unit_price",
          title: "Unit price of each raw",
          required: true,
        },
        {
          name: "Total price of raw",
          type: "input",
          tooltipText: false,
          key: "total_price",
          title: "Total price of raw",
          required: true,
        },
        {
          name: "Units",
          type: "input",
          tooltipText: false,
          key: "units",
          title: "Units",
          required: true,
        },
        {
          name: "Domestic/Imported",
          type: "radio",
          options: [
            { label: "Domestic", value: "Domestic" },
            { label: "Imported", value: "Imported" },
          ],
          tooltipText: false,
          key: "is_imported",
          title: "Domestic/Imported",
          required: true,
        },
        {
          name: "Upload Supporting Documents",
          type: "file upload",
          tooltipText: false,
          key: "files",
          title: "Upload Supporting Documents",
          required: false,
        },
      ],
    },
    sm_process: {
      section: "Special Manufacturing process",
      inputFields: [
        {
          name: "Process Details",
          title: "Process Details",
          type: "textArea",
          tooltipText: false,
          key: "details",
        },
        {
          name: "Upload Supporting",
          title: "Upload Supporting",
          type: "file upload",
          tooltipText: false,
          key: "files",
        },
      ],
    },
    pricing_details: {
      section: "Product Price Information",
      inputFields: [
        {
          name: "Ex-Factory Price per Unit",
          title: "Ex-Factory Price per Unit",
          type: "input",
          tooltipText: false,
          key: "price_per_unit",
        },
        {
          name: "Profit % per unit",
          title: "Profit % per unit",
          type: "input",
          tooltipText: false,
          key: "profit_per_unit",
        },
        {
          name: "Value Added in India",
          title: "Value Added in India",
          type: "input",
          tooltipText: false,
          key: "value_added",
        },
      ],
    },
    certifications: {
      section: "Certification",
      inputFields: [
        {
          name: "Upload Relevant Certification Documents",
          title: "Upload Relevant Certification Documents",
          type: "file upload",
          tooltipText: false,
          key: "files",
        },
        {
          name: "Upload CA Declaration",
          title: "Upload CA Declaration",
          type: "file upload",
          tooltipText: false,
          key: "ca_declarations",
        },
      ],
    },
    declaration: {
      section: "Declaration",
      inputFields: [
        {
          name: "Place",
          title: "Place",
          type: "input",
          tooltipText: false,
          key: "place",
        },
        {
          name: "Digital signature",
          title: "Digital signature",
          type: "input",
          tooltipText: false,
          key: "signature",
        },
        {
          name: "Signatory Name",
          title: "Signatory Name",
          type: "input",
          tooltipText: false,
          key: "signatory_name",
        },
        {
          name: "Date of signing",
          title: "Date of signing",
          type: "input",
          tooltipText: false,
          key: "date_of_signing",
        },
      ],
    },
  };

  const [formsConfig, setFormsConfig] = useState(formElements);

  const handleProductSelection = (k, v, data) => {
    if (k === "product") {
      setProductSelection({
        ...data,
        product_id: v?.id,
        description: v?.name,
        hsn_code: v?.hsn_code,
        category: v?.category,
      });
    } else {
      setProductSelection({ ...productSelection, [k]: v });
    }
  };

  useEffect(() => {
    if (labelCriteria?.label_criteria == "local_value_addition") {
      setSidebarItems([...defaultSidebarItems, ...lvaSidebarItems]);
      setStepKeys([...defaultStepKeys, ...lvaKeys]);
    } else {
      setSidebarItems(defaultSidebarItems);
      setStepKeys(defaultStepKeys);
    }
  }, [labelCriteria]);

  const renderForm = () => {
    const stepKey = stepKeys[step - 1];
    const stepDetails = formsConfig[stepKey];
    let formState, stateHandler;
    let primaryButtonText = "Next";

    if (step == 8 || (step == 2 && labelCriteria?.label_criteria == "melted_poured")) {
      primaryButtonText = "Finish";
    }
    if (stepKey == "product_selection") {
      formState = productSelection;
      stateHandler = handleProductSelection;
    } else if (stepKey == "label_criteria") {
      formState = labelCriteria;
      stateHandler = setLabelCriteria;
      if (labelCriteria?.label_criteria == "local_value_addition") {
        stepDetails["inputFields"] = lvaElements;
      } else {
        stepDetails["inputFields"] = meltedElements;
      }
    } else if (stepKey == "product_details") {
      formState = productDetails;
      stateHandler = setProductDetails;
    } else if (stepKey == "compositions") {
      formState = compositions;
      stateHandler = setCompositions;
    } else if (stepKey == "sm_process") {
      formState = smProcess;
      stateHandler = setSmProcess;
    } else if (stepKey == "pricing_details") {
      formState = pricingDetails;
      stateHandler = setPricingDetails;
    } else if (stepKey == "certifications") {
      formState = certifications;
      stateHandler = setCertifications;
    } else if (stepKey == "declaration") {
      formState = declaration;
      stateHandler = setDeclaration;
    } else {
      return null;
    }

    let onSubmit = (values) => {
      stateHandler(values);
      if (primaryButtonText == "Next") {
        setStep(step + 1);
      } else {
        let data = {
          ...productSelection,
          ...labelCriteria,
          application_status: "submitted",
          //is_product_regulated: productRegulation['is_product_regulated'],
          is_imported: !productSelection?.wholly_grown_product,
          product_details: productDetails,
          pricing: pricingDetails,
          compositions: compositions,
          sm_process: smProcess,
          attachment_urls: certifications?.files,
          declaration: declaration,
        };
        if (stepKey == "label_criteria") {
          data = { ...data, ...values };
        } else {
          data["declaration"] = values;
        }
        handleApplyProduct(data);
      }
    };

    return (
      <DynamicForm
        previewOnly={type != "add"}
        type={stepDetails?.type}
        section={stepDetails?.section}
        fields={stepDetails["inputFields"]}
        primaryButtonText={primaryButtonText}
        onSubmit={onSubmit}
        onInputChange={stateHandler}
        formData={formState}
        bodyClassName={styles.details__container}
        hasCancelButton={step != 1}
        onCancel={() => setStep(step - 1)}
        cancelButtonText="Back"
      />
    );
  };

  const renderStep = () => {
    const stepKey = stepKeys[step - 1];
    const stepDetails = formsConfig[stepKey];

    return (
      <div>
        <div className={styles.product__heading}>
          <span />
          <h4>{stepDetails?.section}</h4>
        </div>
        <Divider />
        {renderForm()}
      </div>
    );
  };

  const handleApplyProduct = (data) => {
    apiRequest({ method: "POST", url: "/api/v1/product-apply/", data })
      .then((resp) => {
        setApplicationId(resp?.data?.external_id);
        setIsModalOpen(true);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const renderFormElements = () => {
    return (
      <div className={styles.product__details}>
        {renderStep()}
        <div style={{ paddingLeft: "24px" }}></div>
      </div>
    );
  };

  const renderSidebarElement = (item, i) => {
    return (
      <div className={`${i + 1 == step && styles.active__step} ${styles.sidebar__item}`}>
        <p>{item}</p>
      </div>
    );
  };

  const onCloseModal = () => {
    router.push("/home");
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className={styles.apply__container}>
        <div className={styles.apply__header}>
          <span />
          <h4>Apply</h4>
        </div>

        <div className={styles.apply__details__container}>
          <div className={styles.apply__sidebar}>
            <p>
              Step {step}/{sidebarItems.length}
            </p>
            {sidebarItems.map(renderSidebarElement)}
          </div>
          {renderFormElements()}
        </div>
      </div>
      <Modal
        centered={true}
        closable={false}
        footer={null}
        open={isModalOpen}
        onCancel={() => onCloseModal()}
        style={{ width: 400 }}
      >
        <div className={styles.modal__container}>
          <div className={styles.modal__header}>
            <div>
              <span />
              <h3>Applied for QR code</h3>
            </div>
            <CloseOutlined style={{ cursor: "pointer" }} onClick={() => onCloseModal()} />
          </div>
          <Divider />
          <div style={{ textAlign: "center" }}>
            <p>
              Please note this application ID for further processing:
              <br />
              <div style={{ fontWeight: "600", color: "#39B5E0" }}>{applicationId}</div>
              <br />
              You can now track the status of the application on your dashboard
            </p>
            <Image src={Success} alt="" />
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default AddProduct;

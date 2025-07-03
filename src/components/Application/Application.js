import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button, Divider, message, Modal, Spin } from "antd";
import { debounce } from "../../utils/search.js";
import { CloseOutlined } from "@ant-design/icons";
import RenderInput from "../../utils/RenderInput";
import Success from "../../../assets/success.svg";
import apiRequest from "../../../utils/request.js";
import DynamicForm from "../../shared/DynamicForm.js";
import DynamicTable from "../../shared/DynamicTable.js";
import styles from "../../../styles/Product.module.scss";
import { MainLayout, ProductSearch } from "../../shared";
import Link from "next/link.js";
import ChangeRequestModal from "../../shared/ChangeRequestModal.js";
import { is_applicant } from "../../../utils/roles.js";

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
      { label: "Scrap Steel", value: "Scrap Steel" },
      { value: "Iron Ore", label: "Iron Ore" },
    ],
    tooltipText: false,
    key: "melted_criteria",
    title: "Melted & Poured criteria",
    placeholder: "Select Melted & Poured criteria",
    required: true,
  },
  {
    name: "Product Authenticity Verification Documents",
    type: "file upload",
    tooltipText: "Includes relevant documentation that validates the product's authenticity",
    key: "application_doc",
    title: "Upload Supporting Documents",
    required: true,
    multiple: false,
  },
];

const Application = (props) => {
  const { type, formValues, application_id, uniqueApplicationId, status, review = null } = props;
  const router = useRouter();

  let formElements = {
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
        //   {
        //     name: "Are imported/non-Indian origin product(s) used in the manufacturing/processing of this product?",
        //     type: "radio",
        //     options: [
        //       { value: true, label: "No" },
        //       { value: false, label: "Yes" },
        //     ],
        //     tooltipText: false,
        //     key: "wholly_grown_product",
        //     title: "Are imported/non-Indian origin product(s) used in the manufacturing/processing of this product?",
        //   },
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
          inputType: "numeric",
          tooltipText: "Please add the number of units you are entering the below cost values for",
          key: "units",
        },
        {
          name: "Total cost price",
          title: "Total cost price",
          type: "input",
          inputType: "numeric",
          tooltipText: "Please enter values in INR",
          key: "total_cost_price",
        },
        {
          name: "Total labour cost",
          title: "Total labour cost",
          type: "input",
          inputType: "numeric",
          tooltipText: "Please enter values in INR",
          key: "total_labour_cost",
        },
        {
          name: "Total Overhead cost",
          title: "Total labour cost",
          type: "input",
          inputType: "numeric",
          tooltipText: "Please enter values in INR",
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
          inputType: "numeric",
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
          inputType: "numeric",
          tooltipText: false,
          key: "quantity",
          title: "Quantity",
          required: true,
        },
        {
          name: "Unit price of each raw",
          type: "input",
          inputType: "numeric",
          tooltipText: false,
          key: "unit_price",
          title: "Unit price of each raw",
          required: true,
        },
        {
          name: "Total price of raw",
          type: "input",
          inputType: "numeric",
          tooltipText: false,
          key: "total_price",
          title: "Total price of raw",
          required: true,
        },
        {
          name: "Units",
          type: "input",
          inputType: "numeric",
          tooltipText: "Please add the number of units you are entering the  values for",
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
          inputType: "numeric",
          tooltipText: "Please enter values in INR",
          key: "price_per_unit",
        },
        {
          name: "Profit % per unit",
          title: "Profit % per unit",
          type: "input",
          inputType: "numeric",
          tooltipText: false,
          key: "profit_per_unit",
        },
        {
          name: "Value Added in India",
          title: "Value Added in India",
          type: "input",
          inputType: "numeric",
          tooltipText: false,
          key: "value_added",
        },
      ],
    },
    certifications: {
      section: "Certification",
      inputFields: [
        {
          name: "Relevant Certification Documents",
          title: "Upload Relevant Certification Documents",
          type: "file upload",
          tooltipText: false,
          key: "certification_documents",
        },
        {
          name: "CA Declaration",
          title: "CA Declaration",
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
          inputType: "alphabetic",
          tooltipText: false,
          key: "signatory_name",
        },
        {
          name: "Date of signing",
          title: "Date of signing",
          placeholder: "dd/mm/yyyy",
          type: "input",
          tooltipText: false,
          key: "date_of_signing",
        },
      ],
    },
  };

  const [loading, setLoading] = useState(false);

  let user;
  if (typeof localStorage !== "undefined") {
    user = JSON.parse(localStorage?.getItem("user"));
  }
  const [step, setStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stepKeys, setStepKeys] = useState(defaultStepKeys);
  const [sidebarItems, setSidebarItems] = useState(defaultSidebarItems);
  const [formsConfig, setFormsConfig] = useState(formElements);

  const [productSelection, setProductSelection] = useState({
    wholly_grown_product: true,
  });
  const [labelCriteria, setLabelCriteria] = useState({
    label_criteria: "melted_poured",
  });

  const [productRegulation, setProductRegulation] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [compositions, setCompositions] = useState([]);
  const [smProcess, setSmProcess] = useState({});
  const [pricingDetails, setPricingDetails] = useState({});
  const [certifications, setCertifications] = useState({});
  const [declaration, setDeclaration] = useState({});
  const [applicationId, setApplicationId] = useState("");
  const [products, setProducts] = useState({ loading: false, data: [] });
  const [indianPercentage, setIndianPercentage] = useState(0);

  const [commentsModal, setCommentsModal] = useState(false);

  const [comments, setComments] = useState("");
  const [changeRequestVisible, setChangeRequestVisible] = useState(false);

  useEffect(() => {
    if (router.query.id || applicationId) {
      getApplication(router.query.id);
    }
  }, []);

  useEffect(() => {
    if (status === "changeRequest") {
      const updatedFormElements = { ...formElements };
      let selectedLabelCriteriaIndex = updatedFormElements.label_criteria.inputFields.findIndex(
        (item) => item.name === "Select label criteria"
      );
      if (selectedLabelCriteriaIndex !== -1) {
        updatedFormElements.label_criteria.inputFields[selectedLabelCriteriaIndex].disabled = true;
      }
      setFormsConfig(updatedFormElements);
    }
  }, [step]);

  //   useEffect(() => {
  //     if (type != "add" && formValues) {
  //       console.log("WORKING", formValues);
  //       setLoading(false);
  //       setProductSelection({
  //         product: formValues?.product_selection?.name,
  //         ...formValues?.product_selection,
  //       });
  //       setLabelCriteria({
  //         label_criteria: formValues?.label_criteria,
  //         melted_criteria: formValues?.melted_criteria,
  //         application_doc: [formValues?.application_doc],
  //       });
  //       setProductDetails(formValues?.product_details);
  //       setCompositions(formValues?.compositions);
  //       setSmProcess(formValues?.sm_process);
  //       setPricingDetails(formValues?.pricing_details);
  //       setCertifications(formValues?.certification);
  //       setDeclaration(formValues?.declaration);
  //     } else setLoading(false);
  //   }, [formValues]);

  useEffect(() => {
    if (labelCriteria?.label_criteria == "local_value_addition") {
      setSidebarItems([...defaultSidebarItems, ...lvaSidebarItems]);
      setStepKeys([...defaultStepKeys, ...lvaKeys]);
    } else {
      setSidebarItems(defaultSidebarItems);
      setStepKeys(defaultStepKeys);
    }
  }, [labelCriteria]);

  const handleProductSelection = (k, v, data) => {
    if (k === "product") {
      setProductSelection({
        product_id: v?.id,
        description: v?.name,
        hsn_code: v?.hsn_code,
        category: v?.category,
      });
    } else {
      // setProductSelection({ ...productSelection, [k]: v });
    }
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

  const hasExistingApplication = () => {
    const url = `/api/v1/check-for-application/${productSelection.product_id}`;
    apiRequest({ method: "GET", url })
      .then((resp) => {
        if (resp.data === true) {
          message.error(
            "An application for this product has already been submitted. \nPlease check the status of your existing application."
          );
        } else {
          setStep(step + 1);
        }
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const updateProductIndianness = async (data) => {
    try {
      const url = `/api/v1/calculate-indianness/`;
      const res = await apiRequest({ method: "POST", url, data: compositions });
      const percentage = res.data;
      setIndianPercentage(percentage);
      if (percentage >= 50) {
        message.success("Congratulations, your product is eligble for the label");
        handleUpdateProduct(data);
      } else {
        setStep(step + 1);
      }
    } catch (error) {
      message.error(error?.data?.error);
    }
  };

  const checkDisabled = () => {
    if (type === "view") return false;
    // product selection
    //  if (step == 1) {
    //    if (!productSelection.hasOwnProperty("product_id")) return true;
    //  }

    if (step == 1) {
      if (type != "edit" && !productSelection.product_id) return true;
    }
    if (step == 2) {
      if (labelCriteria.label_criteria == "melted_poured" && !labelCriteria.hasOwnProperty("melted_criteria"))
        return true;
    }

    return false;
  };

  console.log("status: ", status);

  const renderForm = () => {
    const stepKey = stepKeys[step - 1];
    const stepDetails = formsConfig[stepKey];
    let formState, stateHandler;
    let primaryButtonText = "Next";
    let hidePrimaryButton = false;

    if (step == 8 || (step == 2 && labelCriteria?.label_criteria == "melted_poured")) {
      if (status === undefined || status == "draft") {
        primaryButtonText = "Finish";
      } else {
        primaryButtonText = "Update";
      }
      if (!((is_applicant(user?.role) && (status === "changeRequest" || status === "draft")) || type === "add")) {
        hidePrimaryButton = true;
      }
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
      if (status === "submitted" || status === "approved" || status === "rejected") {
        setStep(step + 1);
        return;
      }
      stateHandler(values);
      let attachments = {
        certification_documents:
          certifications?.certification_documents && certifications.certification_documents.length > 0
            ? [...certifications.certification_documents]
            : [],
        ca_declarations:
          certifications?.ca_declarations && certifications.ca_declarations.length > 0
            ? [...certifications.ca_declarations]
            : [],
      };

      // TODO: make sure to only extract url if it is a signed url.

      const modifiedCompositions = compositions.map((item) => {
        if (item.files && item.files.length > 0) {
          console.log("item.files", item.files);
          let files = item.files;

          item.files = files.map((f) => {
            const split_url = f.split("/");
            if (split_url[0] == "https:") {
              console.log("signed  url");
              const url = split_url.slice(3).join("/").split("?")[0];
              return url;
            } else {
              return f;
            }
          });
        }

        return item;
      });

      let modifiedSmProcess = { ...smProcess };
      if (modifiedSmProcess.files && Array.isArray(modifiedSmProcess.files) && modifiedSmProcess.files.length > 0) {
        modifiedSmProcess.files = modifiedSmProcess.files.map((f) => {
          const split_url = f.split("/");
          if (split_url[0] == "https:") {
            return split_url.slice(3).join("/").split("?")[0];
          } else {
            return f;
          }
        });
      } else {
        modifiedSmProcess.files = null;
      }

      const modifiedAttachments = { ...attachments };
      for (const key in modifiedAttachments) {
        if (modifiedAttachments.hasOwnProperty(key)) {
          const filesArray = modifiedAttachments[key];

          if (filesArray && Array.isArray(filesArray) && filesArray.length > 0) {
            modifiedAttachments[key] = filesArray.map((f) => {
              const split_url = f.split("/");
              if (split_url[0] == "https:") {
                return split_url.slice(3).join("/").split("?")[0];
              } else {
                return f;
              }
            });
          } else {
            modifiedAttachments[key] = null;
          }
        }
      }

      let data = {
        ...productSelection,
        ...labelCriteria,
        is_imported: !productSelection?.wholly_grown_product,
        product_details: productDetails,
        pricing: pricingDetails,
        compositions: modifiedCompositions,
        sm_process: modifiedSmProcess,
        attachment_urls: null,
        declaration: declaration,
        attachments: modifiedAttachments,
      };

      let application_doc = null;
      if (labelCriteria.application_doc) {
        application_doc = labelCriteria.application_doc[0];
        const split_url = application_doc.split("/");
        if (split_url[0] == "https:") {
          application_doc = split_url.slice(3).join("/").split("?")[0];
        }

        data = { ...data, ...values, application_doc };
      }

      console.log("payload", data);

      if (stepKey == "label_criteria") {
        //   data = { ...data, ...values, application_doc };
      } else {
        data["declaration"] = values;
      }
      if (is_applicant(user?.role)) {
        if (primaryButtonText == "Next") {
          if (type === "add" || status === "draft" || status === "changeRequest") {
            //  if (step == 1) {
            //    hasExistingApplication();
            //  } else
            if (is_applicant(user?.role) && step === 4) {
              let application_status = "draft";
              if (status == undefined || status === "draft") {
                application_status = "draft";
              } else {
                application_status = "changeRequest";
              }
              data = { ...data, application_status };
              updateProductIndianness(data);
            } else {
              if (router.query.id || applicationId) {
                let application_status = "draft";
                if (status == undefined || status === "draft") {
                  application_status = "draft";
                } else {
                  application_status = "changeRequest";
                }
                data = { ...data, application_status };
                handleUpdateProduct(data);
              } else {
                data = { ...data, application_status: "draft" };
                handleApplyProduct(data);
              }
            }
          } else {
            setStep(step + 1);
          }
        } else {
          if (status === "changeRequest") {
            data = { ...data, application_status: "resubmitted", application_doc };
            handleUpdateProduct(data, true);
          } else {
            data = { ...data, application_status: "submitted" };
            handleUpdateProduct(data, true);
          }
        }
      } else {
        setStep(step + 1);
      }
    };

    console.log(type);

    // preview only
    //  true -> editing not allowed
    // false -> editing is allowed
    return (
      <DynamicForm
        step={step}
        previewOnly={
          !((is_applicant(user?.role) && (status === "changeRequest" || status === "draft")) || type === "add")
        }
        viewType={type}
        type={stepDetails?.type}
        section={stepDetails?.section}
        fields={stepDetails["inputFields"]}
        primaryButtonText={primaryButtonText}
        hidePrimaryButton={hidePrimaryButton}
        disableNextButton={checkDisabled()}
        onSubmit={onSubmit}
        onInputChange={stateHandler}
        formData={formState}
        bodyClassName={styles.details__container}
        hasCancelButton={step != 1}
        onCancel={() => {
          //  setStep(step + 1);
          if (step == 6 && indianPercentage >= 50) {
            setStep(step - 2);
          } else setStep(step - 1);
        }}
        cancelButtonText="Back"
        uniqueApplicationId={uniqueApplicationId}
        status={status}
        applicationId={application_id}
      />
    );
  };

  const getApplication = (id) => {
    apiRequest({
      method: "GET",
      url: `/api/v1/application/${id}/details`,
    })
      .then((resp) => {
        setApplicationId(resp.data.application.id);

        setProductDetails(resp.data.product_details ? resp.data.product_details : {});
        setProductSelection({
          product_id: resp.data.application.product?.id,
          product: resp.data.application.product?.name,
          ...resp.data.application.product,
        });

        setLabelCriteria({
          label_criteria: resp?.data?.label_criteria,
          melted_criteria: resp?.data?.melted_criteria,
          application_doc: resp.data.application_doc ? [resp.data.application_doc] : null,
        });

        setCompositions(resp.data.compositions ? resp.data.compositions : []);
        setSmProcess(resp.data.sm_process ? resp.data.sm_process : {});
        setPricingDetails(resp.data.pricing ? resp.data.pricing : {});
        setCertifications({
          certification_documents:
            resp.data.attachments && resp.data.attachments.certification_documents
              ? resp.data.attachments.certification_documents
              : [],
          ca_declarations:
            resp.data.attachments && resp.data.attachments.ca_declarations ? resp.data.attachments.ca_declarations : [],
        });
        setDeclaration(resp?.data?.declaration);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleApplyProduct = (data) => {
    apiRequest({ method: "POST", url: "/api/v1/product-apply/", data })
      .then((resp) => {
        setApplicationId(resp?.data?.application?.id);
        getApplication(resp?.data?.id);
        setStep(step + 1);
        //  setIsModalOpen(true);
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const handleUpdateProduct = (data, finished = false) => {
    apiRequest({ method: "POST", url: `/api/v1/update-application/${applicationId}/`, data })
      .then((resp) => {
        if (finished) {
          message.success("Application created successfully");
          router.push("/home");
        } else {
          getApplication(applicationId);
          setStep(step + 1);
        }
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const applicationAction = (action) => {
    apiRequest({
      method: "POST",
      url: `/api/v1/application/${uniqueApplicationId}/update-status/`,
      data: { status: action },
    })
      .then((resp) => {
        message.success(resp?.data?.msg);
        router.push("/home");
      })
      .catch((error) => {
        message.error(error?.data?.error);
      });
  };

  const handleOpenChangeRequest = () => {
    setChangeRequestVisible(true);
  };

  const handleChangeRequestStatus = () => {
    const url = `/api/v1/application-review/`;

    const payload = {
      application_id: router.query.id,
      review_comment: comments,
    };

    apiRequest({
      method: "POST",
      url: url,
      data: payload,
    })
      .then((resp) => {
        message.success("Application sent to review");
        applicationAction("changeRequest");
      })
      .catch((error) => {
        message.error(error?.data?.error);
      })
      .finally(() => {
        setComments("");
        setChangeRequestVisible(false);
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
      <div className={`${i + 1 === step && styles.active__step} ${styles.sidebar__item}`}>
        <p>{item}</p>
      </div>
    );
  };

  const onCloseModal = () => {
    router.push("/home");
    setIsModalOpen(false);
  };

  const renderTitle = () => {
    if (type === "add") return <h4>Apply</h4>;
    if (type === "view" || user?.role !== "applicant")
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <h4>View Application</h4>
          <Link
            href={{
              pathname: "/application-items",
              query: {
                application_id: application_id,
              },
            }}
          >
            <div className={styles.items_btn}>Show Items</div>
          </Link>
          {review != null && (
            <div style={{ marginLeft: 8 }} className={styles.items_btn} onClick={() => setCommentsModal(true)}>
              Show Comments
            </div>
          )}
        </div>
      );
    if (type === "edit")
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <h4>Edit Application</h4>
          <div className={styles.items_btn} onClick={() => setCommentsModal(true)}>
            Show Comments
          </div>
        </div>
      );
  };

  return (
    <MainLayout>
      {loading ? (
        <Spin />
      ) : (
        <div className={styles.apply__container}>
          <div className={styles.apply__header}>
            <span />
            {renderTitle()}
          </div>

          {user?.role === "supervisor" && status === "submitted" && (
            <Button
              style={{ marginRight: 18, position: "absolute", right: 22, top: 32 }}
              onClick={(e) => handleOpenChangeRequest()}
            >
              Change Request
            </Button>
          )}

          <div className={styles.apply__details__container}>
            <div className={styles.apply__sidebar}>
              {type === "add" && (
                <p>
                  Step {step}/{sidebarItems.length}
                </p>
              )}
              {sidebarItems.map(renderSidebarElement)}
            </div>
            {renderFormElements()}
          </div>
        </div>
      )}
      <ChangeRequestModal
        visible={changeRequestVisible}
        onCancel={() => {
          setChangeRequestVisible(false);
          setComments("");
        }}
        onSubmit={handleChangeRequestStatus}
        comments={comments}
        setComments={setComments}
      />
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
      <Modal
        centered={true}
        closable={false}
        footer={null}
        open={commentsModal}
        onCancel={() => setCommentsModal(false)}
        style={{ width: 400 }}
      >
        <div className={styles.modal__container} style={{ padding: 0 }}>
          <div className={styles.modal__header}>
            <div>
              <span />
              <h3>Comments</h3>
            </div>
            <CloseOutlined style={{ cursor: "pointer" }} onClick={() => setCommentsModal(false)} />
          </div>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <p>{review}</p>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Application;

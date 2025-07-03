import React, { useState, useEffect } from "react";
import { Button, Form, message } from "antd";
import RenderInput from "../utils/RenderInput.js";
import DynamicTable from "./DynamicTable.js";
import apiRequest from "../../utils/request.js";
import { useRouter } from "next/router";

const DynamicForm = ({
  previewOnly,
  type,
  viewType,
  section,
  onSubmit,
  fields,
  primaryButtonText,
  hidePrimaryButton,
  disableNextButton,
  extraActionButtons,
  bodyClassName,
  onInputChange,
  formData,
  hasCancelButton,
  cancelButtonText,
  onCancel,
  uniqueApplicationId,
  status,
  step,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [fieldsData, setFieldsData] = useState({});
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "supervisor") {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, []);

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

  const handleFieldInputChange = (k, v) => {
    setFieldsData({ ...fieldsData, [k]: v });
    onInputChange({ ...formData, [k]: v });
  };

  const handleCustomInputChange = (k, v) => {
    handleFieldInputChange(k, v);
    onInputChange(k, v, formData);
  };

  const renderFieldInput = (field) => {
    if (field?.type == "custom") {
      const CustomComponent = field?.component;
      return (
        <CustomComponent
          data={field}
          handleChange={(v) => handleCustomInputChange(field?.key, v)}
          previewOnly={previewOnly}
          viewType={viewType}
          step={step}
        />
      );
    }
    return (
      <RenderInput
        handleChange={(v) => handleFieldInputChange(field?.key, v)}
        item={field}
        item_value={formData[field.key]}
        previewOnly={previewOnly}
      />
    );
  };

  const onFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onSubmit(values);
        // Validation is successful
      })
      .catch((errors) => {
        console.log("Validate Failed:", errors);
        // Errors in the fields
      });
  };

  const renderCancelButton = () => {
    if (hasCancelButton) {
      return (
        <Button onClick={() => onCancel()} style={{ marginRight: 20 }}>
          {cancelButtonText}
        </Button>
      );
    }

    return null;
  };

  if (type == "multi-row") {
    return (
      <div>
        <div className={bodyClassName}>
          <DynamicTable
            previewOnly={previewOnly}
            type={section}
            viewType={viewType}
            data={formData}
            setData={(d) => onInputChange(d)}
            fields={fields}
            status={status}
          />
        </div>
        <div style={{ paddingLeft: "24px" }}>
          {renderCancelButton()}
          <Button type="primary" onClick={() => onSubmit(formData)}>
            {primaryButtonText}
          </Button>
        </div>
      </div>
    );
  }

  form.setFieldsValue(formData);
  //   comment;
  return (
    <Form form={form} layout="vertical" name="form_in_modal">
      <div className={bodyClassName}>{fields?.map(renderFieldInput)}</div>
      <div style={{ paddingLeft: "24px" }}>
        {renderCancelButton()}

        {hidePrimaryButton && hasCancelButton && isStaff && status !== "approved" && status !== "rejected" && (
          <>
            <Button type="primary" ghost={true} onClick={(e) => applicationAction("approved")}>
              Approve
            </Button>
            <Button
              style={{ margin: "0 18px" }}
              type="primary"
              danger={true}
              ghost={true}
              onClick={(e) => applicationAction("rejected")}
            >
              Reject
            </Button>
          </>
        )}
        {!hidePrimaryButton && (
          <Button type="primary" onClick={onFormSubmit} disabled={disableNextButton}>
            {primaryButtonText}
          </Button>
        )}
      </div>
    </Form>
  );
};

export default DynamicForm;

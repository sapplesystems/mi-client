import React, { useState, useCallback } from "react";
import { Button, Form, Input, Modal, Radio, message } from "antd";
import RenderInput from "../utils/RenderInput.js";
import { isEmailValid, isPhoneNoValid } from "../../utils/validation.js";

const DynamicModal = ({ open, onSubmit, onCancel, fields, type }) => {
  const [form] = Form.useForm();
  const [fieldsData, setFieldsData] = useState({});

  const handleFieldInputChange = (k, v) => {
    if (k.hasOwnProperty("hsn_code")) {
      setFieldsData({ ...fieldsData, hsn_code: k["hsn_code"] });
    } else {
      setFieldsData({ ...fieldsData, [k]: v });
    }
  };

  const checkDisabled = () => {
    if (Object.hasOwn(fieldsData, "email") && fieldsData.email?.trim() != "" && !isEmailValid(fieldsData.email))
      return true;

    if (
      Object.hasOwn(fieldsData, "mobile_number") &&
      fields.mobile_number?.trim() != "" &&
      !isPhoneNoValid(fieldsData.mobile_number)
    )
      return true;

    return false;
  };

  const validateFields = () => {
    if (Object.hasOwn(fieldsData, "email") && fieldsData.email?.trim() != "" && !isEmailValid(fieldsData.email)) {
      message.error("Please enter a valid email address!");
      return false;
    }

    if (
      Object.hasOwn(fieldsData, "mobile_number") &&
      fields.mobile_number?.trim() != "" &&
      fieldsData.mobile_number.length < 10
    ) {
      message.error("Mobile number must contain at least 10 digits!");
      return false;
    }
    if (
      Object.hasOwn(fieldsData, "mobile_number") &&
      fields.mobile_number?.trim() != "" &&
      fieldsData.mobile_number.length > 10
    ) {
      message.error("Mobile number cannot contain more than 10 digits!");
      return false;
    }

    if (
      Object.hasOwn(fieldsData, "mobile_number") &&
      fields.mobile_number?.trim() != "" &&
      !isPhoneNoValid(fieldsData.mobile_number)
    ) {
      message.error("Please enter a valid mobile number!");
      return false;
    }

    return true;
  };

  const renderFieldInput = (field) => {
    if (field?.type == "custom") {
      const CustomComponent = field?.component;
      return <CustomComponent data={field} handleChange={handleFieldInputChange} />;
    }
    return (
      <RenderInput
        handleChange={(v) => handleFieldInputChange(field?.key, v)}
        item={field}
        item_value={fieldsData[field?.key]}
      />
    );
  };

  const onFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (validateFields()) {
          form.resetFields();
          onSubmit(fieldsData);
        }
      })
      .catch((errors) => {
        console.log("Validate Failed:", errors);
        // Errors in the fields
      });
  };

  return (
    <div>
      <Modal
        open={open}
        title={`Add new ${type}`}
        okText="Submit"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => onFormSubmit()}
        okButtonProps={
          {
            //  disabled: checkDisabled(),
          }
        }
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          {fields?.map(renderFieldInput)}
        </Form>
      </Modal>
    </div>
  );
};

export default DynamicModal;

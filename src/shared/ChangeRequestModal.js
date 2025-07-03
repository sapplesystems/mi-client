import { Modal, Input, Button } from "antd";

const ChangeRequestModal = (props) => {
  const { visible, comments, setComments, onCancel, onSubmit } = props;
  return (
    <Modal
      open={visible}
      title="Add Change Request"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit} disabled={comments.trim() === ""}>
          Submit
        </Button>,
      ]}
    >
      <Input.TextArea
        rows={4}
        placeholder="Add your comments here"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
    </Modal>
  );
};

export default ChangeRequestModal;

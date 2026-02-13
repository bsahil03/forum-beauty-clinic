import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalConfirm = ({ show, onHide, onConfirm, title, message }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm}>Confirm</Button>
    </Modal.Footer>
  </Modal>
);

export default ModalConfirm;
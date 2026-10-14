import { useCallback, useState } from "react";
import Modal from "./Modal";
import "./styles.css";

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  function handleDelete() {
    setDeleted(true);
    closeModal();
  }

  function handleSave(event) {
    event.preventDefault();

    if (!name.trim()) return;

    setSavedName(name.trim());
    setName("");
    closeModal();
  }

  return (
    <main className="app">
      <div className="page-heading">
        <h1>Reusable Modal Demo</h1>
        <p>
          Explore confirmation dialogs and forms using one
          reusable component.
        </p>
      </div>

      <section className="demo-card">
        <h2>Confirmation dialog</h2>
        <p>
          Open a modal and confirm a destructive action.
        </p>

        <button
          className="button button-danger"
          onClick={() => setActiveModal("delete")}
          disabled={deleted}
        >
          {deleted ? "Item Deleted" : "Delete Item"}
        </button>
      </section>

      <section className="demo-card">
        <h2>Form dialog</h2>
        <p>
          Open the same modal component with different content.
        </p>

        <button
          className="button button-primary"
          onClick={() => setActiveModal("form")}
        >
          Open Form
        </button>

        {savedName && (
          <p className="success-message">
            Saved name: {savedName}
          </p>
        )}
      </section>

      <Modal
        isOpen={activeModal === "delete"}
        onClose={closeModal}
        title="Delete item?"
        size="small"
      >
        <p className="modal-description">
          Are you sure you want to delete this item?
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button className="button button-secondary" onClick={closeModal}>
            Cancel
          </button>

          <button className="button button-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "form"}
        onClose={closeModal}
        title="Enter your details"
        size="medium"
        closeOnOutsideClick={false}
      >
        <form onSubmit={handleSave}>
          <label className="form-label" htmlFor="name">
            Name
          </label>

          <input
            id="name"
            className="form-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            required
          />

          <div className="modal-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button type="submit" className="button button-primary">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}


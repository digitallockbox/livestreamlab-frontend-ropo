import modalStyles from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children?: JSX.Element | JSX.Element[] | string;
};

export function Modal({
  isOpen,
  title,
  onClose,
  children,
}: ModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.panel}>
        <div className={modalStyles.header}>
          <h2>{title}</h2>
          <button type="button" className={modalStyles.close} onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

import "../styles/YesNoDialog.css";
const YesNoDialog = ({ titre, message, image, onConfirmDialog,confirmWord }) => {
  return (
    <div className={`dialog ${onConfirmDialog ? "show" : "hide"}`}>
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">{titre}</h2>
          <button
            className="btn-dialog-close2"
            onClick={() => onConfirmDialog(false)}
          >
            <img src="./../../src/assets/Vector.svg" alt="cancel" />
          </button>
        </div>
        <div className="dialog-body">
          <div className="dialog-img-body">
            <img src={image} alt="illustration" />
          </div>
          <p className="dialog-message">{message}</p>
        </div>
        <div className="dialog-footer">
          <button
            className="btn-dialog btn-dialog-cancel"
            onClick={() => onConfirmDialog(false)}
          >
            Annuler
          </button>
          <button
            className="btn-dialog btn-dialog-confirm"
            onClick={() => onConfirmDialog(true)}
          >
            {confirmWord}
          </button>
        </div>
      </div>
    </div>
  );
};
export default YesNoDialog;

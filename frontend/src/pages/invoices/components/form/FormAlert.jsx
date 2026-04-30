const FormAlert = ({ variant = "success", iconClass, message }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${variant} rounded-4`}>
      {iconClass && <i className={`bi ${iconClass} me-2`}></i>}
      {message}
    </div>
  );
};

export default FormAlert;

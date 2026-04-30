const PageHeader = ({ title, description, backButton, action }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div className="d-flex align-items-center gap-3 mb-4">
        {backButton}

        <div>
          <h2 className="fw-bold mb-1">{title}</h2>
          {description && <p className="text-muted mb-0">{description}</p>}
        </div>
      </div>

      {action}
    </div>
  );
};

export default PageHeader;

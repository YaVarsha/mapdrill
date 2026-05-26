// DrillNode.jsx

const DrillNode = ({
  icon,
  title,
  subtitle,
  active,
  children,
  showLine = false,
}) => {

  return (
    <div
      className={`tree-node ${
        active ? "active-node" : ""
      }`}
    >

      {showLine && (
        <div className="tree-line"></div>
      )}

      <div className="tree-label">

        <span className="tree-icon">
          {icon}
        </span>

        <div className="tree-content">

          <span className="tree-title">
            {title}
          </span>

          <span className="tree-subtitle">
            {subtitle}
          </span>

        </div>

      </div>

      <div className="tree-dropdown">
        {children}
      </div>

    </div>
  );
};

export default DrillNode;
import "./FormField.css";

/**
 * Shared text/email/password field used by Login, Register, and Profile.
 *
 * Props:
 *  - label: string
 *  - icon: JSX (react-icons element)
 *  - type: input type, default "text"
 *  - value / onChange: controlled input
 *  - placeholder: string
 *  - error: string | undefined
 *  - rightSlot: JSX rendered inside the box (e.g. show/hide password button)
 *  - readOnly: bool
 */
function FormField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  rightSlot,
  readOnly = false,
}) {
  return (
    <label className="field-wrap">
      <span className="field-label">{label}</span>
      <div className={`field-box ${error ? "field-box-error" : ""}`}>
        {icon && <span className="field-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="field-input"
        />
        {rightSlot}
      </div>
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export default FormField;

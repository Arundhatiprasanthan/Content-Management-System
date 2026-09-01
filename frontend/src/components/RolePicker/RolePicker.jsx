import { FiCheck } from "react-icons/fi";
import "./RolePicker.css";

const ROLE_OPTIONS = [
  { key: "reader", label: "Reader", sub: "Browse & take quizzes" },
  { key: "author", label: "Author", sub: "Write & publish content" },
];

/**
 * Reader / Author toggle used at registration.
 * Props: role (string), setRole (fn)
 */
function RolePicker({ role, setRole }) {
  return (
    <div className="field-wrap">
      <span className="field-label">I am joining as</span>
      <div className="role-options">
        {ROLE_OPTIONS.map((r) => {
          const selected = role === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setRole(r.key)}
              className={`role-pill ${selected ? "role-pill-selected" : ""}`}
            >
              <div className="role-pill-top">
                <span className={`role-dot ${selected ? "role-dot-selected" : ""}`}>
                  {selected && <FiCheck size={10} color="#f8f4ee" strokeWidth={3} />}
                </span>
                <span className="role-pill-title">{r.label}</span>
              </div>
              <span className="role-pill-sub">{r.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RolePicker;

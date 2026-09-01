import { FiCheckCircle } from "react-icons/fi";
import "./SuccessBanner.css";

/**
 * Small inline success confirmation, used after login, registration,
 * and profile saves (PRD Section 19 — every feature needs success feedback).
 *
 * Props:
 *  - message: string | null — renders nothing when falsy
 */
function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="success-banner" role="status">
      <FiCheckCircle size={16} />
      <span>{message}</span>
    </div>
  );
}

export default SuccessBanner;

import { useEffect, useState } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import "./SubscribeButton.css";

const SubscribeButton = ({ authorId }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkStatus = async () => {
      if (!token || !authorId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/subscriptions/status/${authorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check subscription");
        }

        setSubscribed(data.subscribed);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [authorId, token]);

  const handleClick = async () => {
    if (!token) {
      alert("Please login to subscribe.");
      return;
    }

    const confirmed = window.confirm(
      subscribed
        ? "Are you sure you want to unsubscribe from this author?"
        : "Do you want to subscribe to this author?"
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/subscriptions/${authorId}`,
        {
          method: subscribed ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      setSubscribed(data.subscribed);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <button className="subscribe-btn loading" disabled>
        Checking...
      </button>
    );
  }

  return (
    <div className="subscribe-wrapper">
      <button
        className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
        onClick={handleClick}
        disabled={actionLoading}
      >
        {actionLoading ? (
          "Please wait..."
        ) : subscribed ? (
          <>
            <FiCheck />
            Subscribed
          </>
        ) : (
          <>
            <FiBell />
            Subscribe
          </>
        )}
      </button>

      {error && <p className="subscribe-error">{error}</p>}
    </div>
  );
};

export default SubscribeButton;
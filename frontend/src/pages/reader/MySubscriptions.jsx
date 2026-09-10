import { useEffect, useState } from "react";
import { FiBell, FiUser, FiX } from "react-icons/fi";
import "./MySubscriptions.css";

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscriptions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your subscriptions.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/subscriptions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("My subscriptions response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load subscriptions"
        );
      }

      setSubscriptions(data.data || []);
    } catch (err) {
      console.error("Subscriptions error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleUnsubscribe = async (authorId) => {
    const confirmed = window.confirm(
      "Are you sure you want to unsubscribe from this author?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/subscriptions/${authorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to unsubscribe"
        );
      }

      setSubscriptions((previous) =>
        previous.filter(
          (subscription) =>
            subscription.author?._id !== authorId
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="subscriptions-page">
        <div className="subscriptions-loading">
          <FiBell />
          <p>Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscriptions-page">
        <div className="subscriptions-error">
          <h2>Unable to load subscriptions</h2>
          <p>{error}</p>
          <button onClick={fetchSubscriptions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-header">
        <div>
          <h1>My Subscriptions</h1>
          <p>
            Authors you are currently following
          </p>
        </div>

        <div className="subscription-count">
          <FiBell />
          <span>{subscriptions.length}</span>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="subscriptions-empty">
          <div className="empty-icon">
            <FiBell />
          </div>

          <h2>No subscriptions yet</h2>

          <p>
            Subscribe to your favorite authors to see them here.
          </p>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {subscriptions.map((subscription) => {
            const author = subscription.author;

            if (!author) return null;

            return (
              <div
                className="subscription-card"
                key={subscription._id}
              >
                <div className="author-avatar">
                  {author.profileImage ? (
                    <img
                      src={author.profileImage}
                      alt={author.name}
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>

                <div className="author-details">
                  <h2>{author.name}</h2>

                  {author.bio ? (
                    <p>{author.bio}</p>
                  ) : (
                    <p>Author</p>
                  )}

                  <span className="subscribed-label">
                    <FiBell />
                    Subscribed
                  </span>
                </div>

                <button
                  className="unsubscribe-btn"
                  onClick={() =>
                    handleUnsubscribe(author._id)
                  }
                >
                  <FiX />
                  Unsubscribe
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;
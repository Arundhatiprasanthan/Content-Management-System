import { useEffect, useState } from "react";

function AdminProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
  }, []);

  return (
    <div className="admin-page">

      <section className="page-heading">
        <div>
          <h1>Admin Profile</h1>

          <p>
            Manage your administrator account.
          </p>
        </div>
      </section>

      <section className="dashboard-section">

        <div className="profile-card">

          <div className="profile-avatar">
            {user?.name
              ? user.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : "A"}
          </div>

          <div className="profile-details">

            <h2>
              {user?.name || "Admin"}
            </h2>

            <p>
              {user?.email || "admin@lumen.test"}
            </p>

            <span className="profile-role">
              {user?.role || "Admin"}
            </span>

          </div>

        </div>

      </section>
    </div>
  );
}

export default AdminProfile;


const API_URL = "http://localhost:5000/api/subscriptions";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

export const getSubscriptionStatus = async (authorId) => {
  const response = await fetch(
    `${API_URL}/status/${authorId}`,
    {
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get subscription status"
    );
  }

  return data;
};

export const subscribeToAuthor = async (authorId) => {
  const response = await fetch(
    `${API_URL}/${authorId}`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to subscribe"
    );
  }

  return data;
};

export const unsubscribeFromAuthor = async (authorId) => {
  const response = await fetch(
    `${API_URL}/${authorId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to unsubscribe"
    );
  }

  return data;
};

export const getMySubscriptions = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load subscriptions"
    );
  }

  return data;
};
const API_URL = "http://localhost:5000/api/chat";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Common headers
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
};

// =========================
// Search users
// =========================
export const searchUsers = async (search = "") => {
  const response = await fetch(
    `${API_URL}/users/search?search=${encodeURIComponent(search)}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search users");
  }

  return data.data;
};

// =========================
// Get conversations
// =========================
export const getConversations = async () => {
  const response = await fetch(`${API_URL}/conversations`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get conversations"
    );
  }

  return data.data;
};

// =========================
// Create / Get conversation
// =========================
export const createConversation = async (userId) => {
  const response = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      userId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create conversation"
    );
  }

  return data.data;
};

// =========================
// Get messages
// =========================
export const getMessages = async (conversationId) => {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get messages"
    );
  }

  return data.data;
};

// =========================
// Send message
// =========================
export const sendMessage = async (
  conversationId,
  content
) => {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        content,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to send message"
    );
  }

  return data.data;
};

// =========================
// Mark messages as read
// =========================
export const markAsRead = async (conversationId) => {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/read`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to mark messages as read"
    );
  }

  return data;
};

// =========================
// Get unread count
// =========================
export const getUnreadCount = async () => {
  const response = await fetch(
    `${API_URL}/unread-count`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to get unread count"
    );
  }

  return data.unreadCount;
};
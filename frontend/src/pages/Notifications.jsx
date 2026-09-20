import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5050/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        response.data.notifications
      );

      setUnreadCount(
        response.data.unreadCount
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5050/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5050/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (
    notificationId
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5050/api/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Booking":
        return "📅";

      case "Payment":
        return "💳";

      case "Check-in":
        return "🏨";

      case "Check-out":
        return "🚪";

      case "Registration":
        return "👤";

      default:
        return "🔔";
    }
  };

  return (
    <div className="customer-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with your hotel activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="small-btn"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="notification-summary">
        <strong>
          {unreadCount}
        </strong>

        <span>
          unread notification
          {unreadCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="notifications-list">
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <h3>No notifications</h3>

            <p>
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <div
                key={notification._id}
                className={`notification-card ${
                  !notification.isRead
                    ? "unread"
                    : ""
                }`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="unread-badge">
                        New
                      </span>
                    )}
                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <small>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </small>

                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="small-btn"
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                      >
                        Mark as Read
                      </button>
                    )}

                    <button
                      className="small-btn"
                      onClick={() =>
                        deleteNotification(
                          notification._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default Notifications;
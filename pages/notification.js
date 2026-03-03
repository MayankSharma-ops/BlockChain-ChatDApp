import React, { useContext, useEffect } from "react";

import { ChatAppContext } from "../Context/ChatAppContext";
import Style from "../styles/notification.module.css";

const Notification = () => {
  const { notifications, markNotificationsAsRead, clearNotifications } =
    useContext(ChatAppContext);

  useEffect(() => {
    markNotificationsAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={Style.notification}>
      <div className={Style.notification_header}>
        <h1>Notifications</h1>
        {notifications.length > 0 && (
          <button type="button" onClick={clearNotifications}>
            Clear all
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className={Style.notification_empty}>No notifications yet.</p>
      ) : (
        <div className={Style.notification_list}>
          {notifications.map((item) => (
            <div key={item.id} className={Style.notification_item}>
              <p>{item.message}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification

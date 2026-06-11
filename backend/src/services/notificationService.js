import Notification from "../models/Notification.js";

export function createNotification(data) {
  return Notification.create(data);
}

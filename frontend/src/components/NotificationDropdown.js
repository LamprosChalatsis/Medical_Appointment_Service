import { markNotificationRead } from "../api/notifications";

export default function NotificationDropdown({
  open,
  notifications,
  setNotifications,
}) {

  const handleClick = async (id) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = async () => {
    await Promise.all(
      notifications.map(n => markNotificationRead(n.id))
    );
    setNotifications([]); 
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div className="flex justify-between items-center p-3 border-b font-semibold">
        Notifications
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-4 text-gray-500 text-sm">
          No new notifications
        </div>
      ) : (
        notifications.map(n => (
          <div
            key={n.id}
            onClick={() => handleClick(n.id)}
            className="p-3 border-b hover:bg-gray-100 cursor-pointer text-sm"
          >
            {n.message}
          </div>
        ))
      )}
    </div>
  );
}
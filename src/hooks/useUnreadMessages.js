import { useEffect, useState } from 'react';
import { getPatientUnreadMessageCount } from '../services/patientService';

const useUnreadMessages = (patientId) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const count = await getPatientUnreadMessageCount(patientId);
        setUnreadCount(count || 0);
      } catch (error) {
        console.error("❌ Error fetching unread messages:", error);
      }
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [patientId]);

  return unreadCount;
};

export default useUnreadMessages;

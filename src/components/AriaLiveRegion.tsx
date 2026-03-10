import React, { useEffect, useState } from 'react';

// Singleton to manage announcements from anywhere
let announceCallback: ((message: string, politeness?: 'polite' | 'assertive') => void) | null = null;

export const announceToScreenReader = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  if (announceCallback) {
    announceCallback(message, politeness);
  }
};

export const AriaLiveRegion: React.FC = () => {
  const [announcement, setAnnouncement] = useState<{ message: string; politeness: 'polite' | 'assertive'; id: number } | null>(null);

  useEffect(() => {
    announceCallback = (message, politeness = 'polite') => {
      setAnnouncement({ message, politeness, id: Date.now() });
    };

    return () => {
      announceCallback = null;
    };
  }, []);

  return (
    <div
      className="sr-only"
      aria-live={announcement ? announcement.politeness : 'polite'}
      aria-atomic="true"
    >
      {announcement ? announcement.message : ''}
    </div>
  );
};

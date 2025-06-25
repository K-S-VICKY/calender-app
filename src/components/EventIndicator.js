import React from 'react';
import dayjs from 'dayjs';
import './EventIndicator.css';

function formatTime(time, timeFormat) {
  if (!time) return '';
  return dayjs(`2024-01-01 ${time}`).format(timeFormat === '12hr' ? 'h:mm A' : 'HH:mm');
}

const EventIndicator = ({ event, index, totalEvents, timeFormat = '12hr' }) => {
  const startTime = dayjs(`2024-01-01 ${event.time}`);
  const endTime = startTime.add(event.duration, 'minute');
  
  // Check for time conflicts with other events
  const hasConflict = totalEvents > 1 && index > 0;

  return (
    <div 
      className={`event-indicator ${hasConflict ? 'conflict' : ''}`}
      style={{ 
        backgroundColor: event.color,
        borderLeft: `3px solid ${event.color}`
      }}
      title={`${event.title} - ${formatTime(event.time, timeFormat)} (${event.duration}min)`}
    >
      <div className="event-title">{event.title}</div>
      <div className="event-time">{formatTime(event.time, timeFormat)}</div>
      {hasConflict && (
        <div className="conflict-indicator" title="Time conflict detected">
          ⚠️
        </div>
      )}
    </div>
  );
};

export default EventIndicator; 
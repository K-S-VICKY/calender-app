import React from 'react';
import dayjs from 'dayjs';
import './Sidebar.css';

const categories = [
  { name: 'Work', color: '#3B82F6' },
  { name: 'Personal', color: '#10B981' },
  { name: 'Urgent', color: '#EF4444' },
];

function getEventsForDay(events, day) {
  return events.filter(e => dayjs(e.date).isSame(day, 'day'));
}

function formatEventTime(time, timeFormat) {
  if (!time) return '';
  return dayjs(`2024-01-01T${time}`).format(timeFormat === '12hr' ? 'h:mm A' : 'HH:mm');
}

function detectConflicts(events) {
  const conflicts = [];
  
  // Group events by date
  const eventsByDate = {};
  events.forEach(event => {
    if (event.date && event.time) {
      const dateKey = event.date;
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    }
  });

  // Check for conflicts on each date
  Object.keys(eventsByDate).forEach(dateKey => {
    const dayEvents = eventsByDate[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    
    for (let i = 0; i < dayEvents.length - 1; i++) {
      const currentEvent = dayEvents[i];
      const nextEvent = dayEvents[i + 1];
      
      // Convert times to minutes for comparison
      const currentTime = dayjs(`2024-01-01T${currentEvent.time}`);
      const nextTime = dayjs(`2024-01-01T${nextEvent.time}`);
      
      // Check if events overlap (assuming 1-hour duration if not specified)
      const currentEnd = currentTime.add(1, 'hour');
      if (nextTime.isBefore(currentEnd)) {
        conflicts.push({
          date: dateKey,
          events: [currentEvent, nextEvent],
          conflictTime: currentEvent.time
        });
      }
    }
  });

  return conflicts;
}

const Sidebar = ({ events, onEditEvent, onToggleTimeFormat, timeFormat, onDeleteEvent }) => {
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');
  const todayEvents = getEventsForDay(events, today);
  const yesterdayEvents = getEventsForDay(events, yesterday);
  const conflicts = detectConflicts(events);

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="toggle-time-btn" onClick={onToggleTimeFormat}>
          {timeFormat === '12hr' ? '24hr' : '12hr'}
        </button>
      </div>
      
      {conflicts.length > 0 && (
        <div className="sidebar-section">
          <h4 className="sidebar-section-title sidebar-conflicts-title">
            ⚠️ Time Conflicts
          </h4>
          <ul className="sidebar-event-list">
            {conflicts.map((conflict, index) => (
              <li key={index} className="sidebar-conflict-item">
                <div className="conflict-date">
                  {dayjs(conflict.date).format('MMM D, YYYY')}
                </div>
                <div className="conflict-events">
                  {conflict.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="conflict-event" onClick={() => onEditEvent && onEditEvent(event)}>
                      <span className="sidebar-event-dot" style={{ background: event.color }}></span>
                      <span className="sidebar-event-title">{event.title}</span>
                      <span className="sidebar-event-time">{formatEventTime(event.time, timeFormat)}</span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Today's Events</h4>
        <ul className="sidebar-event-list">
          {todayEvents.length === 0 && <li className="sidebar-event-empty">No events</li>}
          {todayEvents.map(ev => (
            <li key={ev.id} className="sidebar-event-item" style={{cursor:'pointer'}} onClick={() => onEditEvent && onEditEvent(ev)}>
              <span className="sidebar-event-dot" style={{ background: ev.color }}></span>
              <span className="sidebar-event-title">{ev.title}</span>
              <span className="sidebar-event-time">{formatEventTime(ev.time, timeFormat)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Yesterday's Events</h4>
        <ul className="sidebar-event-list">
          {yesterdayEvents.length === 0 && <li className="sidebar-event-empty">No events</li>}
          {yesterdayEvents.map(ev => (
            <li key={ev.id} className="sidebar-event-item" style={{cursor:'default'}}>
              <span className="sidebar-event-dot" style={{ background: ev.color }}></span>
              <span className="sidebar-event-title">{ev.title}</span>
              <span className="sidebar-event-time">{formatEventTime(ev.time, timeFormat)}</span>
              <button className="sidebar-delete-btn" title="Delete event" onClick={e => { e.stopPropagation(); onDeleteEvent && onDeleteEvent(ev.id); }}>
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar; 
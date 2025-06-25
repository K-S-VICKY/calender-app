import React from 'react';
import dayjs from 'dayjs';
import EventIndicator from './EventIndicator';
import './CalendarCell.css';

const CalendarCell = ({ dayData, onClick, timeFormat, onDeleteEvent }) => {
  const { date, isCurrentMonth, isToday, events } = dayData;

  const handleClick = () => {
    onClick();
  };

  return (
    <div 
      className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
      onClick={handleClick}
    >
      <div className="date-number">{date.date()}</div>
      <div className="events-container">
        {events.slice(0, 3).map((event, index) => (
          <EventIndicator 
            key={event.id}
            event={event} 
            index={index}
            totalEvents={events.length}
            timeFormat={timeFormat}
          />
        ))}
        {events.length > 3 && (
          <div className="more-events">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarCell; 
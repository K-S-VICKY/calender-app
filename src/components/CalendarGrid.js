import React from 'react';
import CalendarCell from './CalendarCell';
import './CalendarGrid.css';

const CalendarGrid = ({ calendarData, onDateClick, timeFormat, calendarView, onDeleteEvent }) => {
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const isWeek = calendarView === 'week';
  // Calculate number of rows for month view
  const numRows = isWeek ? 1 : Math.ceil(calendarData.length / 7);

  return (
    <div className="calendar-grid">
      <div className="day-headers">
        {dayHeaders.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>
      <div
        className="calendar-cells"
        style={{
          gridTemplateRows: `repeat(${numRows}, 1fr)`,
          gridTemplateColumns: 'repeat(7, 1fr)'
        }}
      >
        {calendarData.map((dayData, index) => (
          <CalendarCell
            key={index}
            dayData={dayData}
            onClick={() => onDateClick(dayData.date)}
            timeFormat={timeFormat}
            onDeleteEvent={onDeleteEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid; 
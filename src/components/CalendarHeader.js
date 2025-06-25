import React from 'react';
import dayjs from 'dayjs';
import './CalendarHeader.css';

const CalendarHeader = ({ currentDate, onPreviousMonth, onNextMonth }) => {
  return (
    <div className="calendar-header">
      <div className="header-content">
        <div className="month-year">
          <h1>{currentDate.format('MMMM YYYY')}</h1>
          <p className="current-date">{dayjs().format('dddd, MMMM D, YYYY')}</p>
        </div>
        <div className="navigation-buttons">
          <button 
            className="nav-button prev"
            onClick={onPreviousMonth}
            aria-label="Previous month"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="nav-button next"
            onClick={onNextMonth}
            aria-label="Next month"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader; 
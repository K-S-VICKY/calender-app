import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';
import './Calendar.css';

const Calendar = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  timeFormat,
  calendarView,
  currentDate,
  setCurrentDate,
  showAddEvent,
  setShowAddEvent,
  eventDate,
  eventToEdit,
  setEventToEdit
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Month view data
  const monthCalendarData = useMemo(() => {
    const baseDate = dayjs(currentDate);
    const startOfMonth = baseDate.startOf('month');
    const endOfMonth = baseDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');
    const days = [];
    let day = startOfWeek;
    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
      days.push({
        date: day,
        isCurrentMonth: day.month() === baseDate.month(),
        isToday: day.isSame(dayjs(), 'day'),
        events: events.filter(event => dayjs(event.date).isSame(day, 'day'))
      });
      day = day.add(1, 'day');
    }
    // Remove all trailing weeks that are fully outside the current month
    while (days.length >= 7) {
      const lastWeek = days.slice(-7);
      if (lastWeek.every(d => !d.isCurrentMonth)) {
        days.splice(-7, 7);
      } else {
        break;
      }
    }
    return days;
  }, [currentDate, events]);

  // Week view data
  const weekCalendarData = useMemo(() => {
    const baseDate = dayjs(currentDate);
    const startOfWeek = baseDate.startOf('week');
    const days = [];
    let day = startOfWeek;
    for (let i = 0; i < 7; i++) {
      days.push({
        date: day,
        isCurrentMonth: true, // Always true for week view
        isToday: day.isSame(dayjs(), 'day'),
        events: events.filter(event => dayjs(event.date).isSame(day, 'day'))
      });
      day = day.add(1, 'day');
    }
    return days;
  }, [currentDate, events]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedDate(null);
    if (typeof setShowAddEvent === 'function') setShowAddEvent(false);
    if (typeof setEventToEdit === 'function') setEventToEdit(null);
  };

  // Show add event modal if requested from header
  React.useEffect(() => {
    if (showAddEvent) {
      setSelectedDate(eventDate ? eventDate : dayjs(currentDate));
      setShowEventModal(true);
      setShowAddEvent(false);
    }
  }, [showAddEvent, setShowAddEvent, currentDate, eventDate]);

  return (
    <div className="calendar-container">
      {/* CalendarHeader is now handled in App.js */}
      <CalendarGrid
        calendarData={calendarView === 'week' ? weekCalendarData : monthCalendarData}
        onDateClick={handleDateClick}
        timeFormat={timeFormat}
        calendarView={calendarView}
      />
      {(showEventModal || eventToEdit) && (
        <EventModal
          date={eventToEdit ? dayjs(eventToEdit.date) : selectedDate}
          events={eventToEdit ? [eventToEdit] : (selectedDate ? events.filter(event =>
            dayjs(event.date).isSame(selectedDate, 'day')
          ) : [])}
          onClose={handleCloseModal}
          onAddEvent={onAddEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          eventToEdit={eventToEdit}
          timeFormat={timeFormat}
        />
      )}
    </div>
  );
};

export default Calendar; 
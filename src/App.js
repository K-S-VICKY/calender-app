import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import './App.css';
import dayjs from 'dayjs';

const LOCAL_STORAGE_KEY = 'calendar_events';
const TIME_FORMAT_KEY = 'calendar_time_format';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFormat, setTimeFormat] = useState(() => {
    return localStorage.getItem(TIME_FORMAT_KEY) || '12hr';
  });
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [calendarView, setCalendarView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [eventDate, setEventDate] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);

  useEffect(() => {
    // Try to load events from localStorage first
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setEvents(JSON.parse(stored));
      setLoading(false);
    } else {
      // Load events from the JSON file
      fetch('/src/data/events.json')
        .then(response => response.json())
        .then(data => {
          setEvents(data);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading events:', error);
          setLoading(false);
        });
    }
  }, []);

  const handleAddEvent = (newEvent) => {
    setEvents((prev) => {
      const updated = [...prev, newEvent];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleEditEvent = (updatedEvent) => {
    setEvents((prev) => {
      const updated = prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setEventToEdit(null);
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => {
      const updated = prev.filter(ev => ev.id !== eventId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setEventToEdit(null);
    setShowAddEvent(false);
  };

  const handleSidebarEdit = (event) => {
    setEventToEdit(event);
    setShowAddEvent(true);
  };

  const handleToggleTimeFormat = () => {
    setTimeFormat((prev) => {
      const next = prev === '12hr' ? '24hr' : '12hr';
      localStorage.setItem(TIME_FORMAT_KEY, next);
      return next;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };
  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleYearChange = (e) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setFullYear(Number(e.target.value));
      return d;
    });
  };

  const handleMonthChange = (e) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(Number(e.target.value));
      return d;
    });
  };

  const handleNewEventClick = () => {
    setShowAddEvent(true);
  };

  const handleDatePickerChange = (e) => {
    setEventDate(dayjs(e.target.value));
    setShowDatePicker(false);
    setShowAddEvent(true);
    setCurrentDate(new Date(e.target.value));
  };

  useEffect(() => {
    if (!showAddEvent && eventDate) {
      setEventDate(null);
    }
  }, [showAddEvent, eventDate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        events={events}
        onEditEvent={handleSidebarEdit}
        onDeleteEvent={handleDeleteEvent}
        onToggleTimeFormat={handleToggleTimeFormat}
        timeFormat={timeFormat}
      />
      <main className="main-content">
        <div className="calendar-header-bar">
          <div className="calendar-header-left">
            <button className="calendar-nav-btn" onClick={handlePrevMonth}>&lt;</button>
            <span className="calendar-header-month">
              <select 
                value={currentDate.getMonth()} 
                onChange={handleMonthChange}
              >
                {Array.from({ length: 12 }, (_, i) => i).map(monthIndex => (
                  <option key={monthIndex} value={monthIndex}>
                    {new Date(2024, monthIndex).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select value={currentDate.getFullYear()} onChange={handleYearChange}>
                {Array.from({ length: 21 }, (_, i) => 2015 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </span>
            <button className="calendar-nav-btn" onClick={handleNextMonth}>&gt;</button>
            <button className="calendar-today-btn" onClick={handleToday}>Today</button>
          </div>
          <div className="calendar-header-right">
            <button
              className={`calendar-view-toggle${calendarView === 'month' ? ' active' : ''}`}
              onClick={() => setCalendarView('month')}
            >Month</button>
            <button
              className={`calendar-view-toggle${calendarView === 'week' ? ' active' : ''}`}
              onClick={() => setCalendarView('week')}
            >Week</button>
            <button className="calendar-new-event-btn" onClick={handleNewEventClick}>+ New Event</button>
          </div>
        </div>
        <Calendar
          events={events}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          timeFormat={timeFormat}
          calendarView={calendarView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          showAddEvent={showAddEvent}
          setShowAddEvent={setShowAddEvent}
          eventDate={eventDate}
          eventToEdit={eventToEdit}
          setEventToEdit={setEventToEdit}
        />
      </main>
    </div>
  );
}

export default App; 
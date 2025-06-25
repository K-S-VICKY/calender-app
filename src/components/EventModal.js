import React, { useState } from 'react';
import dayjs from 'dayjs';
import './EventModal.css';

const colorOptions = [
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Vibrant Orange', value: '#ff7f11' },
  { name: 'Mint Green', value: '#10b981' }
];

function formatTime(time, timeFormat) {
  if (!time) return '';
  return dayjs(`2024-01-01 ${time}`).format(timeFormat === '12hr' ? 'h:mm A' : 'HH:mm');
}

const EventModal = ({ date, events, onClose, onAddEvent, onEditEvent, eventToEdit, timeFormat = '12hr', onDeleteEvent }) => {
  const isEditMode = !!eventToEdit;
  const [form, setForm] = useState({
    title: eventToEdit ? eventToEdit.title : '',
    time: eventToEdit ? eventToEdit.time : '',
    duration: eventToEdit ? eventToEdit.duration : '',
    description: eventToEdit ? eventToEdit.description : '',
    color: eventToEdit ? eventToEdit.color : colorOptions[0].value,
    eventDate: eventToEdit ? eventToEdit.date : date.format('YYYY-MM-DD'),
    id: eventToEdit ? eventToEdit.id : undefined,
  });
  const [showForm, setShowForm] = useState(isEditMode);
  const [error, setError] = useState('');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setError('');
    onClose && onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowForm = () => {
    setShowForm(true);
    setError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.time || !form.duration) {
      setError('Title, time, and duration are required.');
      return;
    }
    // Conflict check
    const newStart = dayjs(`${form.eventDate}T${form.time}`);
    const newEnd = newStart.add(parseInt(form.duration, 10), 'minute');
    const hasConflict = events.some(ev => {
      if (isEditMode && ev.id === form.id) return false; // skip self when editing
      const evStart = dayjs(`${ev.date}T${ev.time}`);
      const evEnd = evStart.add(parseInt(ev.duration, 10), 'minute');
      // Overlap if start < other end && end > other start
      return newStart.isBefore(evEnd) && newEnd.isAfter(evStart);
    });
    if (hasConflict) {
      setError('Event time conflicts with another event.');
      return;
    }
    const eventData = {
      id: isEditMode ? form.id : Date.now(),
      title: form.title,
      date: form.eventDate,
      time: form.time,
      duration: parseInt(form.duration, 10),
      description: form.description,
      color: form.color,
    };
    if (isEditMode && onEditEvent) {
      onEditEvent(eventData);
    } else if (onAddEvent) {
      onAddEvent(eventData);
    }
    setForm({ title: '', time: '', duration: '', description: '', color: colorOptions[0].value, eventDate: date.format('YYYY-MM-DD') });
    setShowForm(false);
    setError('');
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{date.format('dddd, MMMM D, YYYY')}</h2>
          <button className="close-button" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {!isEditMode && (
            <button className="add-event-btn" onClick={handleShowForm}>
              + Add Event
            </button>
          )}
          {showForm && (
            <form className="add-event-form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleInputChange}
                  required
                  style={{ minWidth: 0 }}
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleInputChange}
                  required
                  step="60"
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (min)"
                  min="1"
                  value={form.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              <div className="form-row">
                <label htmlFor="color">Color:</label>
                <select name="color" value={form.color} onChange={handleInputChange}>
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value} style={{ color: color.value }}>{color.name}</option>
                  ))}
                </select>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="form-row">
                <button type="submit" className="submit-btn">{isEditMode ? 'Save' : 'Add'}</button>
                <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
              </div>
            </form>
          )}
          {events.length === 0 ? (
            <div className="no-events">
              <div className="no-events-icon">📅</div>
              <p>No events scheduled for this date</p>
            </div>
          ) : (
            <div className="events-list">
              {events.map((event, index) => (
                <div 
                  key={event.id} 
                  className="event-card"
                  style={{ borderLeftColor: event.color }}
                >
                  <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-time-badge">
                      {formatTime(event.time, timeFormat)} ({event.duration}min)
                    </div>
                    {onDeleteEvent && (
                      <button
                        className="modal-delete-btn"
                        title="Delete event"
                        style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.1rem' }}
                        onClick={e => { e.stopPropagation(); onDeleteEvent(event.id); onClose && onClose(); }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-color-indicator" style={{ backgroundColor: event.color }}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal; 
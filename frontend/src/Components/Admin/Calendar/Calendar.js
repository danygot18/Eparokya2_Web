import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MetaData from '../../Layout/MetaData';
import SideBar from '../SideBar';

const localizer = momentLocalizer(moment);

const Calendars = () => {
  const [events, setEvents] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState(null); // State to store selected wedding details
  const config = {
    withCredentials: true,
    // headers: {
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${getToken()}`,
    // },
  };

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllWeddings`, config);
        const weddingEvents = response.data.map(wedding => ({
          id: wedding._id, // Store the wedding ID
          title: `${wedding.name1} & ${wedding.name2} Wedding`,
          start: new Date(wedding.weddingDate),
          end: new Date(wedding.weddingDate),
        }));
        setEvents(weddingEvents);
      } catch (error) {
        console.error('Error fetching wedding events:', error);
      }
    };

    fetchWeddings();
  }, []);

  // Fetch wedding details by ID when an event is clicked
  const fetchWeddingDetails = async (weddingId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getWedding/${weddingId}`, config);
      setSelectedWedding(response.data);
    } catch (error) {
      console.error('Error fetching wedding details:', error);
    }
  };

  // Handle event click to show wedding details
  const handleEventClick = (event) => {
    fetchWeddingDetails(event.id);
  };

  // Customize event colors or styles dynamically
  const eventPropGetter = (event) => {
    const backgroundColor = 'blue';
    return { style: { backgroundColor, color: 'white' } };
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <SideBar />

      {/* Calendar Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <MetaData title={'Calendar'} />
        <h1>Calendar</h1>
        <div style={{ height: '700px', marginTop: '20px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleEventClick} // Event click handler
            style={{ height: '100%' }}
          />
        </div>

        {/* Display selected wedding details */}
        {selectedWedding && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h2>Wedding Details</h2>
            <p><strong>Name 1:</strong> {selectedWedding.name1}</p>
            <p><strong>Name 2:</strong> {selectedWedding.name2}</p>
            <p><strong>Date:</strong> {new Date(selectedWedding.weddingDate).toLocaleDateString()}</p>
            {/* Add any other details you'd like to display */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendars;

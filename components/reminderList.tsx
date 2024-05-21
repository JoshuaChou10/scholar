import React, { useState } from 'react';

// Assuming your reminder object might look something like this
// reminder = { text: 'Doctor Appointment', date: '2024-01-01', desc: 'Annual check-up at 3 PM' }

export default function ReminderList({ reminders, deleteReminder }) {
    // State to track the visible description; null initially means all are collapsed
    const [visibleDescriptionIndex, setVisibleDescriptionIndex] = useState(null);

    // Toggle function to show/hide descriptions
    const toggleDescription = (index) => {
        // If the clicked index is already open, close it, otherwise open the clicked index
        setVisibleDescriptionIndex(visibleDescriptionIndex === index ? null : index);
    };
    const getDaysUntil = (dateStr: string) => {
        const today = new Date();
        const dueDate = new Date(dateStr);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysUntil;
    };
    return (
        <ul className="list-none p-0">
            {reminders.map((reminder, index) => (
                <li
                    key={index}
                    className="p-2 mb-2 border-b border-blue-500/50 text-white bg-transparent shadow-lg shadow-blue-500/50"
                >
                    {/* Container for title and delete button */}
                    <div className="flex justify-between items-center">
                        {/* Clickable title */}
                        <div className="flex-grow cursor-pointer" onClick={() => toggleDescription(index)}>
                            {reminder.text} - In {getDaysUntil(reminder.date)} Days
                        </div>
                        {/* Delete button */}
                        <button
                            className="bg-red-500 text-white py-1 px-2"
                            onClick={() => deleteReminder(index)}
                        >
                            Delete
                        </button>
                    </div>
                    
                    {/* Conditionally displayed description below the title and button */}
                    {visibleDescriptionIndex === index && (
                        <div className="text-blue-500 p-2 mt-2">
                            {reminder.desc}
                            <br />
                            Date: {reminder.date}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
    
}

import React, { useState, useEffect } from 'react';


// Assuming your reminder object might look something like this
// reminder = { text: 'Doctor Appointment', date: '2024-01-01', desc: 'Annual check-up at 3 PM' }

export default function ReminderList() {
    const [reminders, setReminders] = useState<{ text: string; date: string, desc:string}[]>([])
const [reminderText, setReminderText] = useState<string>('')
const [reminderDate, setReminderDate] = useState<string>('')
const [reminderDesc, setReminderDesc] = useState<string>('')
    // State to track the visible description; null initially means all are collapsed
    const [visibleDescriptionIndex, setVisibleDescriptionIndex] = useState<number | null>(null);
useEffect(()=>{
    const savedReminders = JSON.parse(localStorage.getItem('reminders') || "[]")
    if (savedReminders.length==0){
        setReminders([{
            text: 'Reminders will show up here',
            date: new Date().toISOString().split('T')[0], // Set today's date as default
            desc: 'Example reminder description'
        }]);
    }
    else{
        setReminders(savedReminders)
    }
},[])
    // Toggle function to show/hide descriptions
    
  const addReminder = () => {
    const newReminders = [...reminders, { text: reminderText, date: reminderDate, desc:reminderDesc }]
    setReminders(newReminders)
    localStorage.setItem('reminders', JSON.stringify(newReminders))
    setReminderText('')
    setReminderDesc('')
    setReminderDate('')
  }

  const deleteReminder = (index: number) => {
    const newReminders = reminders.filter((_, i) => i !== index)
    setReminders(newReminders)
    localStorage.setItem('reminders', JSON.stringify(newReminders))
  }

    const toggleDescription = (index: number) => {
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
        <div>
        <h2 className="text-xl text-white mb-2 mt-5">Set a Reminder</h2>
            <input
                type="text"
                className="w-full p-2 border border-gray-300 mb-2 text-black"
                placeholder="Reminder title"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
            />
            <input
                type="text"
                className="w-full p-2 border border-gray-300 mb-2 text-black"
                placeholder="Reminder Description"
                value={reminderDesc}
                onChange={(e) => setReminderDesc(e.target.value)}
            />
            <input
                type="date"
                className="w-full p-2 border border-gray-300 mb-2 text-black"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white py-2 px-4 mb-4"
                onClick={addReminder}
            >
                
                Add Reminder
            </button>
        <ul className="list-none p-0">
    
            {reminders.map((reminder, index:number) => (
                <li
                    key={index}
                    className="p-2 mb-2 border border-blue-500/50 rounded-2xl text-white bg-transparent shadow-lg shadow-blue-500/50 transition-all duration-300"
                >
                    {/* Container for title and delete button */}
                    <div className="flex justify-between items-center">
                        {/* Clickable title */}
                        <div className={`flex-grow cursor-pointer flex items-center ${(getDaysUntil(reminder.date)<2? 'text-red': 'text-white')}`} onClick={() => toggleDescription(index)}>
                            {reminder.text} {reminder.date && `-  ${(getDaysUntil(reminder.date))<=0? 'Due Today':`Due in ${getDaysUntil(reminder.date)} Days`}`}
                            <svg className="fill-current text-white w-4 h-4 ml-2 transform transition-transform duration-300" style={{ transform: visibleDescriptionIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }} viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                        {/* Delete button */}
                        <button
                            className="bg-red-500 rounded-full text-white py-1 px-2"
                            onClick={() => deleteReminder(index)}
                        >
                            Delete
                        </button>
                    </div>
                    
                    {/* Conditionally displayed description below the title and button */}
                    {visibleDescriptionIndex === index && (
                        <div className="text-blue-500 p-2 mt-2 transition-all duration-300" style={{ maxHeight: visibleDescriptionIndex === index ? '100px' : '0', overflow: 'hidden' }}>
                            {reminder.desc}
                            <br />
                            To be completed by: {(reminder.date)? reminder.date:"Whenever you want"}
                        </div>
                    )}
                </li>
            ))}
        </ul>
        </div>
    );
     
    
}

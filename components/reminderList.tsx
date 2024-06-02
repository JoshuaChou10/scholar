import React, { useState } from 'react';

import {Reminder} from '../app/page'

interface ReminderListProps {
    reminders: Reminder[];
    editReminder: (id:string) => void;
    deleteReminder: (id:string) => void;
}


export default function ReminderList ({ reminders, editReminder, deleteReminder }:ReminderListProps) {
    
    
    // State to track the visible description; null initially means all are collapsed
    const [visibleDescriptionIndexes, setVisibleDescriptionIndexes] = useState<number[]>([]);

    // Toggle function to show/hide descriptions
    

    const toggleDescription = (index: number) => {

        setVisibleDescriptionIndexes(prevIndexes=>{
            if(prevIndexes?.includes(index)){
                return prevIndexes.filter(i=>i!=index);
            }
            else{
                return [...prevIndexes,index]
            }
        });
    };
    const getDaysUntil = (dateStr: string) => {
        const today = new Date();
        const dueDate = new Date(dateStr);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysUntil;
    };
    const remindersWithDates = reminders.filter(reminder => reminder.date);
    const remindersWithoutDates = reminders.filter(reminder => !reminder.date);
    // sort takes comparision function as an argument
    //the comparison function returns positive or negative, or 0. If it is positive, then a is placed after b (a is more than b)
    const sortedRemindersWithDates = [...remindersWithDates].sort((a, b) => {
        const daysUntilA = getDaysUntil(a.date);
        const daysUntilB = getDaysUntil(b.date);
        return daysUntilA - daysUntilB;
    });
    const sortedReminders=[...sortedRemindersWithDates,...remindersWithoutDates]
    return (
        <div >
       
            <ul className="list-none p-0">
    
    {sortedReminders.map((reminder, index:number) => (
        <li
            key={index}
            className="p-2 mb-2 border border-blue-500/50 rounded-2xl text-white bg-transparent shadow-lg shadow-blue-500/50 transition-all duration-300"
        >
       
    
            <div className="flex justify-between items-center">
                {/* Clickable title */}
                <div className={`flex-grow cursor-pointer flex items-center ${(getDaysUntil(reminder.date)<2? 'text-red': 'text-white')}`} onClick={() => toggleDescription(index)}>
                    {reminder.text} {reminder.date && (
    <span>
        - {(getDaysUntil(reminder.date)) <= 0 ? (
            <b>Due Today</b>
        ) : (
            `Due in ${getDaysUntil(reminder.date)} Days`
        )}
    </span>
)}

                    <svg className="fill-current text-white w-4 h-4 ml-2 transform transition-transform duration-300" style={{ transform: (visibleDescriptionIndexes.includes(index))? 'rotate(180deg)' : 'rotate(0deg)' }} viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
                {/* Delete button */}
                <button
                    className="bg-red-500 rounded-full text-white py-1 px-2 mx-3"
                    onClick={() => deleteReminder(reminder.id)}
                >
                    Delete
                </button>
                <button
                    className="bg-blue-500 rounded-full text-white py-1 px-2"
                    onClick={() => editReminder(reminder.id)}
                >
                    Edit
                </button>
            </div>
            
            {/* Conditionally displayed description below the title and button */}
            {visibleDescriptionIndexes.includes(index) && (
      
                <div className="text-white p-2 mt-2 transition-all duration-300 mb-3" style={{ maxHeight: (visibleDescriptionIndexes.includes(index)) ? '100px' : '0', overflow: 'hidden' }}>
                    {reminder.desc}
                    <p className="text-blue-500">To be completed by: {reminder.date ? new Date(reminder.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Whenever you want"}</p>

              </div>
            )}
        </li>
    ))}
    </ul>
        </div>
    );
     
    
}

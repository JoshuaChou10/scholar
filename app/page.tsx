'use client'
import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Home() {
  const [currentDay, setCurrentDay] = useState<number>(0)
  const [reminders, setReminders] = useState<string[]>([])
  const [reminderText, setReminderText] = useState<string>('')

  useEffect(() => {
    const today = new Date()
    setCurrentDay((today.getDate() % 2 === 0) ? 2 : 1)

    const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]')
    setReminders(savedReminders)
  }, [])

  const addReminder = () => {
    const newReminders = [...reminders, reminderText]
    setReminders(newReminders)
    localStorage.setItem('reminders', JSON.stringify(newReminders))
    setReminderText('')
  }


  const deleteReminder = (index: number) => {
    const newReminders = reminders.filter((_, i) => i !== index)
    setReminders(newReminders)
    localStorage.setItem('reminders', JSON.stringify(newReminders))
  }

  return (
    <div>
      <Head>
        <title>School Tracker</title>
      </Head>
      <main className="p-4">
        <h1 className="text-3xl text-center mb-4">School Manager</h1>
        <div className="text-center">
          <h2 className="text-2xl mb-4">Today is day {currentDay}</h2>
          <h3 className="text-xl mb-4">Tomorrow is day {(currentDay === 1) ? 2 : 1}</h3>
        </div>
        <div>
          <h2 className="text-xl mb-2">Set a Reminder</h2>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 mb-2 text-black"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 mb-4"
            onClick={addReminder}
          >
            Add Reminder
          </button>
          <ul className="list-none p-0">
            {reminders.map((reminder, index) => (
              <li
                key={index}
                className="bg-gray-100 p-2 mb-2 flex justify-between items-center border border-gray-300 text-black"
              >
                {reminder}
                <button
                  className="bg-red-500 text-white py-1 px-2"
                  onClick={() => deleteReminder(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}

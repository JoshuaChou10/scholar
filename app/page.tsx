'use client'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import WeatherDisplay from '/components/weather'
import ReminderList from '/components/reminderList'
export default function Home() {
  const [currentDay, setCurrentDay] = useState<number>(0)
  const [reminders, setReminders] = useState<{ text: string; date: string, desc:string}[]>([])
  const [reminderText, setReminderText] = useState<string>('')
  const [reminderDate, setReminderDate] = useState<string>('')
  const [reminderDesc, setReminderDesc] = useState<string>('')
  const [courses, setCourses] = useState<string[]>([])
  const [courseInputs, setCourseInputs] = useState<string[]>(['', '', '', ''])
  // const [email,setEmail]=useState('')

  useEffect(() => {
    const today = new Date()
    setCurrentDay((today.getDate() % 2 === 0) ? 2 : 1)

    const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]')
    setReminders(savedReminders)

    const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    if (savedCourses.length > 0) {
      setCourses(savedCourses)
    }
    // const savedEmail=JSON.parse(localStorage.getItem('email') || '')
    // setEmail(savedEmail)
  }, [])
// //save email in loaclstorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('email', email);
//   }, [email]); 
  

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

  const handleCourseInputChange = (index: number, value: string) => {
    const newCourseInputs = [...courseInputs]
    newCourseInputs[index] = value
    setCourseInputs(newCourseInputs)
  }

  const setCoursesHandler = () => {
    setCourses(courseInputs)
    localStorage.setItem('courses', JSON.stringify(courseInputs))
  }

  const resetCourses = () => {
    setCourses([])
    localStorage.removeItem('courses')
  }

  const getOrderedCourses = () => {
    if (currentDay === 2 && courses.length === 4) {
      return [courses[1], courses[0], courses[3], courses[2]]
    }
    return courses
  }

  return (
    <div className="flex min-h-screen bg-black-100 text-gray-800">
      <Head>
        <title>School Tracker</title>
      </Head>

      <aside className="w-1/4 bg-white p-4">
        <WeatherDisplay />
      </aside>

      <main className="flex-1 p-4">
        <h1 className="text-3xl text-white text-center mb-4">School Manager</h1>

        <div className="flex justify-between items-start space-x-4">
          <div className="flex-1">
            {/* Courses and reminders setup */}
          </div>
          <div className="w-1/2">
            {/* Input for courses */}
            <h2 className="text-xl text-white mb-2">Set your courses (Order for Day 1)</h2>
            {courseInputs.map((course, index) => (
              <input
                key={index}
                type="text"
                className="w-1/2 p-2 border border-gray-300 mb-2"
                value={course}
                onChange={(e) => handleCourseInputChange(index, e.target.value)}
              />
            ))}
            <button
              className="bg-blue-500 text-white py-2 px-4"
              onClick={setCoursesHandler}
            >
              Set Courses
            </button>
            <h2 className="text-xl mb-2 text-white">Set a Reminder</h2>
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
          </div>
        </div>

        <ReminderList reminders={reminders} deleteReminder={deleteReminder} />
      </main>
    </div>
  );
}


'use client'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import WeatherDisplay from '/components/weather'
export default function Home() {
  const [currentDay, setCurrentDay] = useState<number>(0)
  const [reminders, setReminders] = useState<{ text: string; date: string }[]>([])
  const [reminderText, setReminderText] = useState<string>('')
  const [reminderDate, setReminderDate] = useState<string>('')
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
    const newReminders = [...reminders, { text: reminderText, date: reminderDate }]
    setReminders(newReminders)
    localStorage.setItem('reminders', JSON.stringify(newReminders))
    setReminderText('')
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
    <div>
      <Head>
        <title>School Tracker</title>
      </Head>
      <WeatherDisplay/>
      <main className="p-4">
        <h1 className="text-3xl text-center mb-4">School Manager</h1>
        <div className="text-center">
          <h2 className="text-2xl mb-4">Today is day {currentDay}, {new Date().getFullYear()} {new Date().toLocaleString('default',{month:'long'})} {new Date().getDate()}</h2>
          {courses.length ? (
            <div>
              <ul className="list-none p-0">
                {getOrderedCourses().map((course, index) => (
                  <li key={index} className="bg-gray-100 p-2 mb-2 border border-gray-300 text-black">
                    {course}
                  </li>
                ))}
              </ul>
              <button 
                className="bg-blue-500 text-white py-2 px-4 mb-4" 
                onClick={resetCourses}
              >
                Edit Courses
              </button>
              <h3 className="text-xl mb-4">Tomorrow is day {(currentDay === 1) ? 2 : 1}</h3>
            </div>
          ) : (
            <div>
              <h2 className="text-xl mb-2">Set your courses (Order for Day 1)</h2>
              {courseInputs.map((course, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-full p-2 border border-gray-300 mb-2 text-black"
                  value={course}
                  onChange={(e) => handleCourseInputChange(index, e.target.value)}
                />
              ))}
              <button
                className="bg-blue-500 text-white py-2 px-4 mb-4"
                onClick={setCoursesHandler}
              >
                Set Courses
              </button>
            </div>
          )}
        </div>
        <div>
        {/* <input
  type="email"
  className="w-full p-2 border border-gray-300 mb-2 text-black"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/> */}
        <h2 className="text-xl mb-2">Set a Reminder</h2>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 mb-2 text-black"
            placeholder="Reminder text"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
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
            {reminders.map((reminder, index) => (
              <li
                key={index}
                className="bg-gray-100 p-2 mb-2 flex justify-between items-center border border-gray-300 text-black"
              >
                {reminder.text} {reminder.date}
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

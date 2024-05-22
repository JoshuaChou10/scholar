'use client'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import WeatherDisplay from '../components/weather'
import ReminderList from '../components/reminderList'
import Image from 'next/image'
export default function Home() {
  const [currentDay, setCurrentDay] = useState<number>(0)
  
  const [courses, setCourses] = useState<string[]>([])
  const [courseInputs, setCourseInputs] = useState<string[]>(['', '', '', ''])
  // const [email,setEmail]=useState('')
  
  useEffect(() => {
    const today = new Date()
    setCurrentDay((today.getDate() % 2 === 0) ? 2 : 1)

    

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
    <div className="flex min-h-screen bg-black text-gray-800">
        <Head>
            <title>Home</title>
        </Head>

        <aside className="w-1/4 p-4">
            <WeatherDisplay />
        </aside>

        <main className="flex-1 p-4">
  <div className='flex items-center justify-center'>
        <Image
                src="/logo.png" 
                alt="Home Logo"
                width={100} // Set the desired width
                height={40} // Set the desired height
                layout="fixed" // This can be responsive or fill as needed
            />
      </div>
            <div className="flex justify-between items-start space-x-4">
                <div className="flex-1 ">
                    <h2 className="text-2xl text-white mb-2">Today is {new Date().toLocaleString('en-US',{weekday:'long'})}, Day {currentDay}</h2>
                    <h3 className="text-0.4xl text-white mb-4">{new Date().getFullYear()} {new Date().toLocaleString('default', { month: 'long' })} {new Date().getDate()}</h3>
                    <h2 className="text-2xl text-white mb-4">Schedule</h2>
                    {courses.length ? (
                       <div>
                       <ul className="list-none p-0  ">
                           {getOrderedCourses().map((course, index) => (
                               <li key={index} className="  bg-blue-300 rounded-2xl p-2 mb-2 border border-blue-500 text-black text-center text-extrabold">
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
                       {/* <h3 className="text-xl text-white mb-4">Tomorrow is day {(currentDay === 1) ? 2 : 1}</h3> */}
                   </div>
                   
                    ) : (
                        <div>
                            <h2 className="text-xl text-white mb-2">Set your courses (Order for Day 1)</h2>
                            {courseInputs.map((course, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="w-1/2 p-2 border border-gray-300 mb-2 rounded-4xl text-black"
                                    placeholder={`course ${index+1}`}
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
                        </div>
                    )}
                </div>
            </div>

            
            <h2 className="text-xl text-white mb-2">Current Reminders</h2>
            <ReminderList/>
        </main>
    </div>
);
                            }
                         
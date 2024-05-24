'use client'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Select, {SingleValue} from 'react-select'
import WeatherDisplay from '../components/weather'
import ReminderList from '../components/reminderList'
import Image from 'next/image'
export default function Home() {
  const [currentDay, setCurrentDay] = useState<number>(0)
  const [courses, setCourses] = useState<string[]>([])
  const [courseInputs, setCourseInputs] = useState<string[]>(['', '', '', ''])
  const [coursePage, setCoursePage] = useState<string>('')
  const [reminders, setReminders] = useState<{ text: string; date: string, desc:string, course:string}[]>([])
const [reminderText, setReminderText] = useState<string>('')
const [reminderDate, setReminderDate] = useState<string>('')
const [reminderDesc, setReminderDesc] = useState<string>('')
const [reminderCourse, setReminderCourse] = useState<string>('')
  interface optionType{
    value:string;
    label:string
  }
  useEffect(() => {
    const today = new Date()
    setCurrentDay((today.getDate() % 2 === 0) ? 2 : 1)

    const savedReminders = JSON.parse(localStorage.getItem('reminders') || "[]")
    if (savedReminders.length==0){
        setReminders([{
            text: 'Reminders will show up here',
            date: new Date().toISOString().split('T')[0], // Set today's date as default
            desc: 'Example reminder description',
            course:''
        }]);
    }
    else{
        setReminders(savedReminders)
    }

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
  const newReminders = [...reminders, { text: reminderText, date: reminderDate, desc:reminderDesc, course:reminderCourse }]
  setReminders(newReminders)
  localStorage.setItem('reminders', JSON.stringify(newReminders))
  setReminderText('')
  setReminderDesc('')
  setReminderDate('')
  setReminderCourse('')
}

const deleteReminder = (index: number) => {
  const newReminders = reminders.filter((_, i) => i !== index)
  setReminders(newReminders)
  localStorage.setItem('reminders', JSON.stringify(newReminders))
}
const editReminder = (index: number) => {
  setReminderText(reminders[index].text)
  setReminderDesc(reminders[index].desc)
  setReminderDate(reminders[index].date)
  deleteReminder(index)
  
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
  const getCourseReminders=(coursePage:string)=>{
    return reminders.filter(r=>r.course==coursePage)
  }
  const getOtherReminders=()=>{
    return reminders.filter(r=>r.course=='')
  }


  const getOrderedCourses = () => {
    if (currentDay === 2 && courses.length === 4) {
      return [courses[1], courses[0], courses[3], courses[2]]
    }
    return courses
  }
  const options:optionType[] = [
    { value: '', label: 'None' },
    ...getOrderedCourses().map(course => ({ value: course, label: course }))
];
const handleSelectChange=(selectedOption:SingleValue<optionType>)=>{
  setReminderCourse(selectedOption ? selectedOption.value : '')
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
                       <ul className=" w-1/2 list-none p-0  ">
                           {getOrderedCourses().map((course, index) => (
                               <li key={index} onClick={()=>setCoursePage(course)} className="  bg-blue-300 rounded-2xl p-2 mb-2 border border-blue-500 text-black text-center text-extrabold">
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
                       <section>
                        <h2>{coursePage}</h2>
    {getCourseReminders(coursePage).map((reminder,index)=>(
      <li key={index}>
        {reminder.text}
      </li>

    ))}
    

                       </section>

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
            <Select 
            options={options} 
            value={options.find(option => option.value === reminderCourse)} 
            onChange={handleSelectChange}                   
       />
            <button
                className="bg-blue-500 text-white py-2 px-4 mb-4"
                onClick={addReminder}
            >
                
                Add Reminder
            </button>
            <h2 className="text-xl text-white mb-2">Current Reminders</h2>
            <ReminderList reminders={getOtherReminders}/>
        </main>
    </div>
);

                            }


                         
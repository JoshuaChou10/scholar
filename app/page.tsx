'use client'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Select, { SingleValue, MultiValue } from 'react-select'
import {StylesConfig} from 'react-select'
import WeatherDisplay from '../components/weather'
import LinkSection from '../components/linkSection'
import ReminderList from '../components/reminderList'
import Image from 'next/image'


export default function Home() {
  
  const [currentDay, setCurrentDay] = useState<number>(0)
  const [courses, setCourses] = useState<string[]>([])
  const [courseInputs, setCourseInputs] = useState<string[]>(['', '', '', ''])
  const [coursePage, setCoursePage] = useState<string>('Course')
  const [reminders, setReminders] = useState<{ id:string, text: string; date: string, desc: string, course: string }[]>([])
  const [reminderText, setReminderText] = useState<string>('')
  const [reminderDate, setReminderDate] = useState<string>('')
  const [reminderDesc, setReminderDesc] = useState<string>('')
  const [reminderCourse, setReminderCourse] = useState<string>('')
  const [editId,setEditId]=useState<string|null>(null)
  

  useEffect(() => {
    const today = new Date()
    setCurrentDay((today.getDate() % 2 === 0) ? 2 : 1)

    const savedReminders = JSON.parse(localStorage.getItem('reminders') || "[]")
    if (savedReminders.length === 0) {
      setReminders([{
        id:'default',
        text: 'Reminders will show up here',
        date: new Date().toISOString().split('T')[0], // Set today's date as default
        desc: 'Example reminder details',
        course: ''
      }]);
    } else {
      setReminders(savedReminders)
    }

    const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    if (savedCourses.length > 0) {
      setCourses(savedCourses)
    }
  }, [])
const findReminder=(id:string)=>{
  return reminders.find(reminder=>reminder.id==id)
  

}
const addorUpdateReminder = () => {
  if (!reminderText) {
    alert("Please add a reminder title");
    return;
  }
  let newReminders: typeof reminders; 
  if (editId) {
    // Update the existing reminder
    newReminders = reminders.map(r =>
      r.id === editId
        ? { ...r, text: reminderText, date: reminderDate, desc: reminderDesc, course: reminderCourse }
        : r
    );
    setEditId(null);
  } else {
    // Add a new reminder
    newReminders = [...reminders, { id: crypto.randomUUID(), text: reminderText, date: reminderDate, desc: reminderDesc, course: reminderCourse }];
  }

  // Update the state and localStorage
  setReminders(newReminders);
  localStorage.setItem('reminders', JSON.stringify(newReminders));

  if (reminderCourse) {
    setCoursePage(reminderCourse);
  }

  // Clear the input fields
  setReminderText('');
  setReminderDesc('');
  setReminderDate('');
  setReminderCourse('');
};


  const deleteReminder = (id: string) => {
    const newReminders = reminders.filter(reminder=>reminder.id !=id)
    setReminders(newReminders)
    localStorage.setItem('reminders', JSON.stringify(newReminders))
  }

  const editReminder = (id: string) => {
    var r=findReminder(id)
    if (!r){
      alert("Error: No reminder exists with this Id")
      return null
    }
    setReminderText(r.text)
    setReminderDesc(r.desc)
    setReminderDate(r.date)
    setReminderCourse(r.course)
    setEditId(r.id)
   
  }

  const handleCourseInputChange = (index: number, value: string) => {
    const newCourseInputs = [...courseInputs]
    newCourseInputs[index] = value
    setCourseInputs(newCourseInputs)
  }

  const setCoursesHandler = () => {
    const seen: { [key: string]: number } = {}; 
    // eg. seen[Math] goes to the else, and seen[Math] is set to 1, then if it is seen again so seen[Math] exists, then will ++ so will show 2

  const updatedCourses = courseInputs.map(course => {
    if (seen[course]) {
      seen[course]++;
      return course + seen[course];
    } else {
      seen[course] = 1;
      return course;
    }
  });
    setCourses(updatedCourses)
    localStorage.setItem('courses', JSON.stringify(updatedCourses))
  }

  const resetCourses = () => {
    setCourses([])
    localStorage.removeItem('courses')
  }

  const getCourseReminders = (coursePage: string) => {
    return reminders.filter(r => r.course === coursePage)
  }

  const getOtherReminders = () => {
    return reminders.filter(r => r.course === '')
  }

  const getOrderedCourses = () => {
    if (currentDay === 2 && courses.length === 4) {
      return [courses[1], courses[0], courses[3], courses[2]]
    }
    return courses
  }
  interface optionType {
    value: string;
    label: string;
  }
  
  const customStyles:StylesConfig<optionType> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#1f2937', // Equivalent to bg-gray-800
      borderColor: '#4b5563', // Equivalent to border-gray-600
      color: '#fff', // Text color
      '&:hover': {
        borderColor: '#6b7280' // Lighter border on hover
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff', // Text color for selected option
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937', // Background color for dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#374151' : '#1f2937', // Background color on hover and default
      color: '#fff', // Text color
      '&:hover': {
        backgroundColor: '#374151', // Background color on hover
      },
    }),
  };

  const options: optionType[] = [
    { value: '', label: 'Course (optional)' },
    ...getOrderedCourses().map(course => ({ value: course, label: course }))
  ];

  const handleSelectChange = (selectedOption: SingleValue<optionType> | MultiValue<optionType>) => {
    if (selectedOption && !Array.isArray(selectedOption)) {
      setReminderCourse((selectedOption as optionType).value);
    } else {
      setReminderCourse('');
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-800">
      <Head>
        <title>Home</title>
      </Head>

      <aside className="w-1/4 p-4">
        <WeatherDisplay />
        <LinkSection/>
      </aside>

      <main className="flex-1 p-4 bg-black min-h-screen text-white">
      <div className='flex items-center justify-center mb-4'>
        <Image
          src="/logo.png"
          alt="Home Logo"
          width={200} // Set the desired width
          height={120} // Set the desired height
          layout="fixed" // This can be responsive or fill as needed
        />
      </div>
      <div className="flex justify-between items-start mb-4">
        <div></div> {/* Empty div to push the link to the right */}
        <Link className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300 flex items-center"
href='/notes'>
        
            <Image
              src="/note-icon.png"
              alt="Notes"
              width={100} // Set the desired width for the icon
              height={10} // Set the desired height for the icon
              layout="fixed" // This can be responsive or fill as needed
              className="mr-2" // Margin right for spacing between icon and text
            />
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
 
        </Link>
      </div>
        <div className="flex justify-between items-start space-x-4">
  <div className="flex-1 flex flex-row">
    <div className="w-1/2">
      <h2 className="text-2xl text-white mb-2">Today is {new Date().toLocaleString('en-US', { weekday: 'long' })}, Day {currentDay}</h2>
      <h3 className="text-0.4xl text-white mb-4">{new Date().getFullYear()} {new Date().toLocaleString('default', { month: 'long' })} {new Date().getDate()}</h3>
      <h2 className="text-2xl text-white mb-4">Schedule</h2>
      {courses.length ? (
        <div>
          <ul className="list-none p-0">
            {getOrderedCourses().map((course, index) => (
              <li key={index} onClick={() => setCoursePage(course)} className={`border ${(coursePage==course)? ' rounded-3xl bg-blue-500': 'border-blue-300' } hover:border-blue-500 hover:shadow-lg hover:bg-blue-400 active:bg-blue-500 bg-blue-300 rounded-2xl p-2 mb-2 text-black text-center text-extrabold`}>
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
        </div>
      ) : (
        <div>
          <h2 className="text-xl text-white mb-2">Set your courses (Order for Day 1)</h2>
          {courseInputs.map((course, index) => (
            <input
              key={index}
              type="text"
              className="w-full p-2 border border-gray-300 mb-2 rounded-full text-black"
              placeholder={`course ${index + 1}`}
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

    <div className="w-1/2 mt-10 mx-3 flex flex-col">
  <h2 className="text-2xl text-white mb-4">{coursePage} Reminders</h2>
  <div className="border border-blue-300 bg-gray-900 p-4 rounded-lg shadow-lg flex-grow flex flex-col">
      <ReminderList reminders={getCourseReminders(coursePage)} deleteReminder={deleteReminder} editReminder={editReminder} />
      </div>
    </div>
  </div>
</div>

<div className="flex items-center mb-2 mt-5">
  <h2 className="text-xl text-white mr-4">Set a Reminder</h2>
  <div className="relative w-22">
    <input
      required
      type="date"
      className="w-full p-2 border border-gray-300 text-black rounded-full "
      
      value={reminderDate}
      onChange={(e) => setReminderDate(e.target.value)}
    />
  </div>
</div>
<div className="flex flex-col space-y-2 mt-2 mb-4">
        <input
          required
          type="text"

          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"

          placeholder="Reminder title"
          value={reminderText}
          onChange={(e) => setReminderText(e.target.value)}
        />
        <input
        
          type="text"
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          placeholder="Reminder Details (Optional)"
          value={reminderDesc}
          onChange={(e) => setReminderDesc(e.target.value)}
        />
    
 

        <Select
          options={options}
          styles={customStyles}
          value={options.find(option => option.value === reminderCourse)}
          onChange={handleSelectChange}
        />
       </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 mb-4 mt-4"
          onClick={addorUpdateReminder}
        >
          {(editId)? "Edit Reminder":"Add Reminder"}
        </button>
      
        <h2 className="text-xl text-white mb-2">Other Reminders</h2>
        <ReminderList reminders={getOtherReminders()} deleteReminder={deleteReminder} editReminder={editReminder} />
      </main>
    </div>
  );
}
export interface Reminder{
  id:string, text: string; date: string, desc:string, course?:string
 }
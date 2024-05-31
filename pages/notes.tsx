import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import '../app/globals.css';

export default function Notes() {
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; course: string }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [goal, setGoal] = useState<number | null>(null);
  const [goalReached, setGoalReached] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [coursePage, setCoursePage] = useState<string | null>(null);
  const [courses, setCourses] = useState<string[]>([]); // Assuming you have a list of courses available

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    const savedTime = JSON.parse(localStorage.getItem('seconds') || '0');
    const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setNotes(savedNotes);
    setSeconds(savedTime);
    setCourses(savedCourses); // Load courses from local storage
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
      if (seconds % 60 === 0) {
        localStorage.setItem('seconds', JSON.stringify(seconds));
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
      localStorage.setItem('seconds', JSON.stringify(seconds));
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if (goal !== null && goal !== 0 && seconds >= goal * 60) {
      setGoalReached(true);
    } else {
      setGoalReached(false);
    }
  }, [seconds, goal]);

  function addorUpdateNote() {
    if (!coursePage) {
      alert('Please select a course to add the note to.');
      return;
    }

    let newNotes: typeof notes;
    if (editId) {
      newNotes = notes.map(note => note.id === editId ? { ...note, title, content, course: coursePage } : note);
      setEditId(null);
    } else {
      newNotes = [...notes, { id: crypto.randomUUID(), title, content, course: coursePage }];
    }
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    setTitle('');
    setContent('');
  }

  function deleteNote(id: string) {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }

  function editNote(id: string) {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setEditId(id);
      setCoursePage(noteToEdit.course); // Set the selected course when editing
    }
  }

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    if (window.confirm("Are you sure you want to reset your study timer?")) {
      setSeconds(0);
      localStorage.setItem('seconds', JSON.stringify(0));
      setIsActive(false);
    }
  }

  function getCourseNotes() {
    if (coursePage === null) {
      return notes;
    } else {
      return notes.filter(note => note.course === coursePage);
    }
  }

  const formatTime = (seconds: number) => {
    const getMinutes = `0${Math.floor(seconds / 60)}`.slice(-2);
    const getSeconds = `0${seconds % 60}`.slice(-2);
    return `${getMinutes}:${getSeconds}`;
  };

  return (
    <div className="p-4 bg-black min-h-screen">
      <Head>
        <title>{coursePage} Notes</title>
      </Head>
      <Link className='text-white text-xl flex items-center mb-4' href="/">
        <i className="fas fa-home"></i> 
      </Link>
      <div className='flex items-center justify-center'>
        <Image
          src="/logo.png"
          alt="Home Logo"
          width={200}
          height={120}
          layout="fixed"
        />
      </div>
      <h2 className="text-white text-2xl mb-4">{coursePage} Notes</h2>
      
      <div className="flex justify-center space-x-4 mb-4">
        <button
          key="all"
          onClick={() => setCoursePage(null)}
          className={`py-2 px-4 rounded-lg ${coursePage === null ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-blue-700`}
        >
          All Notes
        </button>
        {courses.map((course: string) => (
          <button
            key={course}
            onClick={() => setCoursePage(course)}
            className={`py-2 px-4 rounded-lg ${coursePage === course ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-blue-700`}
          >
            {course}
          </button>
        ))}
      </div>

      <b className="text-white">{coursePage ? `Add Note to ${coursePage}` : 'Add Note'}</b>
      <div className="flex flex-col space-y-2 mt-2 mb-4">
        <input
          required
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          required
          type="text"
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={addorUpdateNote}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editId ? "Edit Note" : "Add Note"}
        </button>
      </div>

      <ul className="space-y-2 list-none">
        {getCourseNotes().map(({ id, title, content }) => (
          <li key={id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-300">{content}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => editNote(id)} className="text-yellow-400 hover:text-yellow-600">
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this note?')) {
                      deleteNote(id);
                    }
                  }}
                  className="text-red-400 hover:text-red-600"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className={`mt-8 border border-blue-300 ${(goalReached) ? 'bg-green-900' : 'bg-gray-900'} p-4 rounded-lg shadow-lg flex-grow flex flex-col`}>
        <h2 className="text-white text-2xl mb-4">Study Timer</h2>
        <div className="flex flex-col items-center">
          <div className="text-4xl text-white mb-4">{formatTime(seconds)}</div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Set goal (minutes)"
              value={goal !== null ? goal : ''}
              onChange={(e) => setGoal(Number(e.target.value))}
              className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
            {goalReached && <div className="text-green-500 text-4xl mt-4">Goal reached!</div>}
          </div>
          <div className="flex space-x-4">
            <button onClick={toggle} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

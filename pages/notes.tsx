import { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import '../app/globals.css'
export default function Notes() {

  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    setNotes(savedNotes);
  }, []);

  function addNote() {
    const newNotes = [...notes, { id: crypto.randomUUID(), title: title, content: content }];
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
    }
    deleteNote(id);
  }

  return (
    <div className="p-4 bg-black min-h-screen">

      
      <Head>
        <title>Scholar - Notes</title>
      </Head>
      <Link className='text-white text-xl flex items-center mb-4' href="/">
        <i className="fas fa-home"></i> 
      </Link>
      <div className='flex items-center justify-center'>
          <Image
            src="/logo.png"
            alt="Home Logo"
            width={200} // Set the desired width
            height={120} // Set the desired height
            layout="fixed" // This can be responsive or fill as needed
          />
        </div>
      <h2 className="text-white text-2xl mb-4">Notes</h2>
      <b className="text-white">Add Note:</b>
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
          onClick={addNote}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Note
        </button>
      </div>

      <ul className="space-y-2 list-none">
        {notes.map(({ id, title, content }) => (
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
    </div>
  );
}

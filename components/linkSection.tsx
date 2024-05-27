import { useState, useEffect } from 'react';

export default function LinkSection() {
  const [links, setLinks] = useState<{ id: string, title: string, link: string }[]>([]);
  const [title, setTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');

  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem('links') || '[]');
    setLinks(savedLinks);
  }, []);

  function addLink() {
    if (title.trim() === '' || link.trim() === '') {
      alert('Please fill in both fields');
      return;
    }

    const newLinks = [...links, { id: crypto.randomUUID(), title: title, link: link }];
    setLinks(newLinks);
    localStorage.setItem('links', JSON.stringify(newLinks));
    setTitle('');
    setLink('');
  }
function deleteLink(id:string){
    const newLinks=links.filter(link=>link.id!=id)
    setLinks(newLinks)
    localStorage.setItem('links', JSON.stringify(newLinks))
}
function editLink(id:string){
    const linkToEdit=links.find(link=>link.id==id)
    if(linkToEdit){
        setTitle(linkToEdit.title)
        setLink(linkToEdit.link)
    }
    deleteLink(id)
}
  return (
    <div className="p-4">
      <h2 className="text-white text-2xl mb-4">Important Links</h2>
      <b className="text-white">Add link:</b>
      <div className="flex flex-col space-y-2 mt-2 mb-4">
        <input
          required
          type="text"
          placeholder="Link name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          required
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={addLink}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add link
        </button>
      </div>
      
      <ul className="space-y-2">
        {links.map(({ id, title, link }) => (
          <li className='flex item-center' key={id}>
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-white underline">
              {title}
            </a>
            <div className="flex space-x-2 ml-auto">
              <button onClick={() => editLink(id)} className="text-yellow-400 hover:text-blue-600">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={() => deleteLink(id)} className="text-red-400 hover:text-red-600">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

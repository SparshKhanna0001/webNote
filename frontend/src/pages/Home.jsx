import {useState, useEffect} from 'react';
import api from '../../api'
import "../styles/Home.css"
import Note from '../components/Notes'

function Home(){
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    
    useEffect( () => {
        getNotes();
    }, []);


    const getNotes = () => {
        api.get('/api/notes/')
           .then((res)=> {setNotes(res.data); console.log(res.data)})
           .catch((err)=>{alert(`getNotes ${err}`)})
    };

    const deleteNotes = (id) => {
        api
            .delete(`/api/notes/delete/${id}`)
            .then((res)=> {
            if(res.status === 204) alert("Note deleted");
            else alert("Failed to delete");
            getNotes();
            })
            .catch((err)=>{console.log(`deleteNotes ${err}`)})
            
        };

        const createNote = (e) => {
        e.preventDefault();
        api
           .post('/api/notes/', {content, title}).then((res)=>{
            if(res.status === 201) alert('Note Added');
            else alert("Failed to add");
            getNotes();
        })
           .catch((err)=> {console.log(err)})
           
    };

    return (<div className="notes-section">
    <div>
    <h2 className="notes-section-h2">Notes</h2>
    <div className="notes-row-grid">            {
                notes.map((note)=> <Note note={note} onDelete={deleteNotes} key={note.id} />)
            }
    </div>
    </div>
    
    <br />

    <h2 className="form-h2">Create a Note</h2>
    <form onSubmit={createNote} className="note">
        <label htmlFor="title" className="form-label">Title: </label>
        <br/>
        <input 
            type="text"
            id="title"
            name="title"
            value={title}
            onChange = {(e) => {setTitle(e.target.value)}}
            placeholder="title" 
            required 
        />
        <br />
        <label htmlFor="content" className="form-label">Content: </label>
        <br/>
        <textarea
            id="content"
            name="content"
            value={content}
            onChange = {(e) => {setContent(e.target.value)}}
            placeholder="write something"  
            required
            className="textarea"
        />
        <br />
        <input type="submit" value="Add"></input>
    </form>
    </div>
    );
}

export default Home
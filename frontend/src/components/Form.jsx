import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../../api';
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../../constants';
import "../styles/form.css"
import LoadingIndicator from './LoadingIndicator'

function Form ({route, method}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    
    const formType = method === 'login' ? 'Login' : 'Sign Up'
    
    const handleSubmit = async (v) => {
        setLoading(true);
        v.preventDefault();
        try{
            const res = await api.post(route, {username, password})
            if (method === 'login'){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate('/')
            }else{
                navigate('/login')
            }
        }catch(error){
            console.log(error);
            alert(error);
        }finally{
            setLoading(false);
        }

    }
    
    return <form onSubmit={handleSubmit} className="form-container">
    
            <h1 className="form-header">{formType}</h1>
            <input 
                type="text"
                placeholder="username"
                value={username}
                onChange = {(v) => setUsername(v.target.value)}
                className = "form-input"
            
            ></input>

            <input 
                type="password"
                placeholder="password"
                value={password}
                onChange = {(v) => setPassword(v.target.value)}
                className = "form-input"
            ></input>

            {loading && <LoadingIndicator></LoadingIndicator> }
            
            <button type="submit" className="form-button">Let's Go</button>
     </form> 
}

export default Form
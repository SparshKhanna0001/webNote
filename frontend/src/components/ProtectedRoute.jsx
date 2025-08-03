import {Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import api from '../../api'
import {jwtDecode} from 'jwt-decode'
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../../constants'

function ProtectedRoute({children}){
        const [isAuthenticated, setAuthenticated] = useState(null)

        useEffect(()=>{
            auth().catch(()=> setAuthenticated(false))
        },[])

        const refresh =  async() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            try{
                const res = await api.post('api/token/refresh/', {
                    refresh : refreshToken})
                if(res.status == 200){
                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                    setAuthenticated(true);
                }else{
                    setAuthenticated(false)
                    return
                }
            }
            catch(error){
                console.log(error);
                setAuthenticated(false);
            }
        };    


        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN)
            if(!token){
                setAuthenticated(false);
                return
            }
            const decodedToken = jwtDecode(token)
            const now = Date.now()/1000

            if(decodedToken.exp <= now){
                await refresh();
            }else{
                setAuthenticated(true);
            }
        };


        if(isAuthenticated === null){
            return <div>Loading.... </div>
        };

        return isAuthenticated ? children : <Navigate to="/login"/>
    
}


export default ProtectedRoute;
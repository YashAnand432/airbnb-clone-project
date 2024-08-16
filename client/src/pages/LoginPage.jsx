import { Link } from "react-router-dom";
import React, {useContext, useState} from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
function LoginPage(){
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev){
        ev.preventDefault();
        try{   
            const response = await axios.post('/login' , {email, password});  
            const userInfo = response.data;
            setUser(userInfo);
            alert(response.data.message || 'Login Successful');
            setRedirect(true);
        }
        catch(e) {  
            if (e.response) {
                alert(`Login failed: ${e.response.data.error}`);
            } else {
                alert(`Login failed: ${e.message}`);
            }
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 flex flex-col grow items-center justify-center">
                <div className="mb-32">
                <h1 className="text-4xl text-center mb-5">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                <input type="email" placeholder="your@email.com" value={email} onChange={ev => setEmail(ev.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} />
                <button className="w-full py-2 rounded-full bg-red-500">Login</button>
                <div className="text-center py-2 text-gray-500">Don't have an account yet? <Link to={'/register'} className="underline text-blue-600">Register</Link></div>
                </form>
                </div>
        </div>
    );
};

export default LoginPage;
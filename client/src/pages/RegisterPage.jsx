import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

 
function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function registerUser(ev){
        ev.preventDefault();
        try{
            await axios.post('/register' , {
                name,
                email,
                password,
            });
            alert('Registration successful');
            // Optionally clear form fields
            setName('');
            setEmail('');
            setPassword('');
        }
        catch(e){
            if (e.response) {
                setError(e.response.data.error || 'Registration failed');
            } else {
                setError('Registration failed: ' + e.message);
            }
        }
        }

    return (
        <div className="mt-4 flex flex-col grow items-center justify-center">
                <div className="mb-28">
                <h1 className="text-4xl text-center mb-5">Register</h1>
                <form className="max-w-md mx-auto" action="" onSubmit={registerUser}>

                <input type="text" placeholder="Enter your name"
                    value={name}
                    onChange={ev=>setName(ev.target.value)} />

                <input type="email" placeholder="your@email.com" 
                    value={email} 
                    onChange={ev=>setEmail(ev.target.value)} />

                <input type="password" placeholder="password" 
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
                
                <button className="w-full py-2 rounded-full bg-red-500">Register</button>
                
                <div className="text-center py-2 text-gray-500">Already a member? <Link to={'/login'} className="underline text-blue-600">Log in</Link></div>
                </form>
                </div>
        </div>
    );
};

export default RegisterPage;
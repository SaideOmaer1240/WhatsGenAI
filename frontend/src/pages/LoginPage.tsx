import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div>
       <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src="./src/assets/logo.png" alt="INORA Logo" className="h-10" />
          <nav>
            <ul className="flex space-x-6"> 
                
              <li><Link to="/" className="hover:text-yellow-300">Landing Page</Link></li>
              <li><Link to="/login" className="hover:text-yellow-300">Conecte-se</Link></li>
              <li><Link to="/register" className="hover:text-yellow-300">Inscrever-se</Link></li> 
            </ul>
          </nav>
        </div>
      </header>
      <div className="bg-white p-8 shadow-md rounded"> 
    
        <LoginForm />
      </div> 

    </div>
     
  );
}

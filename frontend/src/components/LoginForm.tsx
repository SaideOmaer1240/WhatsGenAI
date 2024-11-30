import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;

        localStorage.setItem("token", token); // Salva o token
        localStorage.setItem("userId", user.id); // Salva o id do usuário

        navigate("/create/session");  
    } catch (error) {
        alert("Erro ao fazer login!");
    }
};


  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <form 
        className="bg-white p-6 mt-4 mb-4 rounded-lg shadow-lg max-w-sm w-full space-y-4" 
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-center text-gray-700">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Login
        </button>

        <div className="text-center text-gray-500 text-sm">
          Esqueceu sua senha?{" "}
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Clique aqui
          </a>
        </div>
      </form>
    </div>
  );
}

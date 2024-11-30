import { useState } from "react";
import api from "../services/api"; 
import { useNavigate , Link } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (error) {
      alert("Erro ao cadastrar usuário!");
    }
  };

  return (
    <div className="min-h-[calc(100%-1rem)] flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <form
        className="bg-white p-6 mt-4 mb-4  rounded-lg shadow-lg max-w-sm w-full space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          Registro
        </h1>

        <input
          type="text"
          name="username"
          placeholder="Nome de Usuário"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Número de Telefone"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Registrar
        </button>

        <div className="text-center text-gray-500 text-sm">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Faça login
            </Link>
        </div>
      </form>
    </div>
  );
}

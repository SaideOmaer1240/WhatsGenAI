import { useState } from "react";
import api from "../../services/api";
import QRCodeDisplay from "./QRCodeDisplay";
 

export default function CreateSession() { 
  const [sessionName, setSessionName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

 

  const createSession = async () => {
    if (!sessionName) {
      alert("Por favor, insira um nome para a sessão.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/sessions/create",
        { sessionId: sessionName, userId: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
       
      if (response.data.message) {
        // Exibe a mensagem de sucesso
         setMessage(response.data.message); 
      }
    } catch (error) {
      console.error("Erro ao criar sessão:", error);
    }
  };

  return (
    <div className="p-6 max-w-screen-sm mx-auto">
       {message ? (
        <QRCodeDisplay sessionName={sessionName} />
      ) : (
        <div className="text-center">
          <div>
            <div className="mb-4">
        <label htmlFor="sessionName" className="block text-sm font-medium text-blue-700">
          Nome da Sessão
        </label>
        <input
          id="sessionName"
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Insira um nome único para a sessão"
        />
      </div>
      <button
        onClick={createSession}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Criar Nova Sessão
      </button>
      </div> 
        </div>
      )} 
    </div>
  );
}

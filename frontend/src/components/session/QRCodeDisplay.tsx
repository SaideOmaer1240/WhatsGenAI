import { useState, useEffect } from "react";
import api from "../../services/api"; 
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const QrCodeComponent = ({ sessionName }: { sessionName: string }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/sessions/get-qr/${sessionName}`);
        if (response.data.qrCode) {
          setQrCode(response.data.qrCode);
        }
      } catch (error) {
        console.error("Erro ao verificar QR Code:", error);
      }
    }, 2000); // Polling a cada 2 segundos

    return () => clearInterval(interval);
  }, [sessionName]);
  
  useEffect(() => {
    const event = `ready-${sessionName}`;
    
    // Escuta o evento 'ready' da sessão
    socket.on(event, () => {
      setIsReady(true);
      console.log(`Sessão ${sessionName} está pronta!`);
    });

    return () => {
      socket.off(event); // Limpa o evento ao desmontar o componente
    };
  }, [sessionName]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {qrCode ? (
        <div>
          {isReady ? (
        <p className="text-green-500 font-bold">Cliente está pronto!</p>
      ) : (
        <div><img src={qrCode} alt="QR Code" className="max-w-xs mx-auto" />
          <p>Digitalize o QR Code</p> </div> 
        
      )} </div>   
      ) : (
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full"></div>
          <p className="mt-4 text-xl text-gray-700">Carregando QR Code...</p>
        </div>
      )}
    </div>
  );
};

export default QrCodeComponent;

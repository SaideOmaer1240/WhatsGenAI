import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import SellerForm from '../seller/SellerForm'; // Importe o SellerForm

interface Session {
    id: number;
    sessionId: string;
    createdAt: string;
}

const SessionSelector: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            const userId = localStorage.getItem('userId'); // Recupera o ID do usuário
            if (!userId) {
                setError('Usuário não identificado. Por favor, faça login novamente.');
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                const response = await api.get(`/sessions/user-sessions/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setSessions(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao buscar sessões.');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleSessionSelect = (sessionId: string) => {
        console.log('Sessão selecionada:', sessionId);
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
             
     {sessions.length > 0 ? (
                <SellerForm sessions={sessions} onSuccess={handleSessionSelect} />
            ) : (
                <p className="text-center text-gray-500">Nenhuma sessão encontrada.</p>
            )}
        </div>
    );
    
};

export default SessionSelector;

import React, { useState, useEffect } from 'react';
import { Seller } from './SellerTypes';
import SellerCard from './SellerCard';
import api from '../../services/api';

interface SellerListProps {
    sessionId: string;
}

const SellerList: React.FC<SellerListProps> = ({ sessionId }) => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await api.get(`/sellers/${sessionId}`); // Usando apiClient para fazer a requisição
                setSellers(response.data); // Acessando os dados da resposta
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao buscar vendedores');
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, [sessionId]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Lista de Vendedores</h2>
            {sellers.length > 0 ? (
                sellers.map((seller) => <SellerCard key={seller.id} seller={seller} />)
            ) : (
                <p>Nenhum vendedor encontrado.</p>
            )}
        </div>
    );
};

export default SellerList;

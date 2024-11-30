import React, { useState } from 'react';
import { SellerFormInputs, Session } from './SellerTypes';
import api from '../../services/api';
interface SellerFormProps {
    sessions: Session[];
    onSuccess: (sessionId: string) => void; // Atualizado para aceitar sessionId como argumento
}

const SellerForm: React.FC<SellerFormProps> = ({ sessions, onSuccess }) => {
    const [formData, setFormData] = useState<SellerFormInputs>({
        sessionId: '',
        sellerName: '',
        product: '',
        description: '',
        benefits: '',
        image: undefined,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/sellers/create', formData); // Envia dados do vendedor
            onSuccess(formData.sessionId); // Passa o sessionId selecionado
            setFormData({
                sessionId: '',
                sellerName: '',
                product: '',
                description: '',
                benefits: '',
                image: undefined,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar vendedor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-center text-gray-700">Criar Vendedor</h2>
            
            {error && <p className="text-red-500 text-center">{error}</p>}
    
            <select
                name="sessionId"
                value={formData.sessionId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Selecione uma Sessão</option>
                {sessions.map((session) => (
                    <option key={session.id} value={session.sessionId}>
                        {session.sessionId} - Criada em {new Date(session.createdAt).toLocaleDateString()}
                    </option>
                ))}
            </select>
    
            <input
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                placeholder="Nome do Vendedor"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
    
            <input
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Produto"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
    
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
    
            <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="Benefícios"
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
    
            <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="URL da Imagem (opcional)"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
    
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
                {loading ? 'Carregando...' : 'Criar Vendedor'}
            </button>
        </form>
    );
    
};

export default SellerForm;


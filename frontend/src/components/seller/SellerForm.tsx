
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { SellerFormInputs, Session } from './SellerTypes';
import api from '../../services/api';

interface SellerFormProps {
  sessions: Session[];
  onSuccess: (sessionId: string) => void;
}

const SellerForm: React.FC<SellerFormProps> = ({ sessions, onSuccess }) => {
  const [formData, setFormData] = useState<Omit<SellerFormInputs, 'description' | 'benefits'>>({
    sessionId: '',
    sellerName: '',
    product: '',
    image: undefined,
  });

  const [description, setDescription] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'image') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        const file = files[0];
        setFormData((prev) => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (value: string) => setDescription(value);
  const handleBenefitsChange = (value: string) => setBenefits(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formDataToSend = new FormData();
    formDataToSend.append('sessionId', formData.sessionId);
    formDataToSend.append('sellerName', formData.sellerName);
    formDataToSend.append('product', formData.product);
    formDataToSend.append('description', description);
    formDataToSend.append('benefits', benefits);
  
    if (formData.image) {
      formDataToSend.append('image', formData.image); // Adicionar a imagem ao FormData
    }
  
    try {
      await api.post('/sellers/create', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Atualizar o cabeçalho
      });
  
      onSuccess(formData.sessionId);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar vendedor.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const resetForm = () => {
    setFormData({
      sessionId: '',
      sellerName: '',
      product: '',
      image: undefined,
    });
    setDescription('');
    setBenefits('');
    setPreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center text-gray-700">Criar Vendedor</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {step === 1 && (
        <>
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

          <button
            type="button"
            onClick={nextStep}
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Próximo
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            name="product"
            value={formData.product}
            onChange={handleChange}
            placeholder="Produto"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-gray-700">Descrição</label>
            <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
              className="bg-white border border-gray-300 rounded focus:outline-none h-80 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={prevStep}
            className="w-full py-2 text-white bg-gray-400 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Próximo
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <label className="block text-gray-700">Benefícios</label>
            <ReactQuill
              value={benefits}
              onChange={handleBenefitsChange}
              className="bg-white h-52 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            name="image"
            type="file"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {preview && <img src={preview} alt="Pré-visualização" className="w-full h-32 object-cover mt-4 rounded" />}

          <button
            type="button"
            onClick={prevStep}
            className="w-full py-2 text-white bg-gray-400 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
          >
            {loading ? 'Carregando...' : 'Criar Vendedor'}
          </button>
        </>
      )}
    </form>
  );
};

export default SellerForm;

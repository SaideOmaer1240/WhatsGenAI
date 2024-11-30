import React from 'react';
import { Seller } from './SellerTypes';

interface SellerCardProps {
    seller: Seller;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{seller.sellerName}</h3>
            <p><strong>Produto:</strong> {seller.product}</p>
            <p><strong>Descrição:</strong> {seller.description}</p>
            <p><strong>Benefícios:</strong> {seller.benefits}</p>
            {seller.image && <img src={seller.image} alt={seller.sellerName} style={{ maxWidth: '100%' }} />}
        </div>
    );
};

export default SellerCard;

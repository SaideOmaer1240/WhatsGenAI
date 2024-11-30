require('dotenv').config();
const express = require('express'); 
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const Seller = require('../seller/Seller'); 
const prisma = new PrismaClient();
const sellerController = new Seller();

 

// Criar vendedor
router.post('/create', async (req, res, next) => {
    const { sessionId, sellerName, product, description, benefits, image } = req.body;
    try {
        const result = await sellerController.create({
            sessionId,
            sellerName,
            product,
            description,
            benefits,
            image,
        });
        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

// Listar todos os vendedores de uma sessão
router.get('/:sessionId', async (req, res, next) => {
    const { sessionId } = req.params;
    try {
        const sellers = await sellerController.findSeller(sessionId);
        res.status(200).json(sellers);
    } catch (error) {
        next(error);
    }
});

// Buscar vendedor por nome em uma sessão
router.get('/:sessionId/:sellerName', async (req, res, next) => {
    const { sessionId, sellerName } = req.params;
    try {
        const seller = await sellerController.findSellerByName(sessionId, sellerName);
        res.status(200).json(seller);
    } catch (error) {
        next(error);
    }
});

// Atualizar vendedor
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { sellerName, product, description, benefits, image } = req.body;
    try {
        const updatedSeller = await sellerController.prisma.seller.update({
            where: { id: parseInt(id) },
            data: { sellerName, product, description, benefits, image },
        });
        res.status(200).json(updatedSeller);
    } catch (error) {
        next(error);
    }
});

// Deletar vendedor
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await sellerController.prisma.seller.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;

// Importação de módulos
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import path from 'path';
import Seller from '../seller/Seller.mjs';

dotenv.config();

const router = express.Router();
const sellerController = new Seller();

// Configuração do multer para armazenar arquivos no disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads')); // Define o diretório de destino
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Define o nome do arquivo
  },
});

const upload = multer({ storage });

// Funções de rota exportadas

/**
 * Criar um vendedor com upload de imagem
 */
export const createSeller = async (req, res, next) => {
  const { sessionId, sellerName, product, description, benefits } = req.body;
  const image = req.file ? req.file.path : null;

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
};

/**
 * Listar todos os vendedores de uma sessão
 */
export const listSellers = async (req, res, next) => {
  const { sessionId } = req.params;
  try {
    const sellers = await sellerController.findSeller(sessionId);
    res.status(200).json(sellers);
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar vendedor por nome em uma sessão
 */
export const findSellerByName = async (req, res, next) => {
  const { sessionId, sellerName } = req.params;
  try {
    const seller = await sellerController.findSellerByName(sessionId, sellerName);
    res.status(200).json(seller);
  } catch (error) {
    next(error);
  }
};

/**
 * Atualizar vendedor
 */
export const updateSeller = async (req, res, next) => {
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
};

/**
 * Deletar vendedor
 */
export const deleteSeller = async (req, res, next) => {
  const { id } = req.params;

  try {
    await sellerController.prisma.seller.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Configuração das rotas no router
router.post('/create', upload.single('image'), createSeller);
router.get('/:sessionId', listSellers);
router.get('/:sessionId/:sellerName', findSellerByName);
router.put('/:id', updateSeller);
router.delete('/:id', deleteSeller);

export default router;


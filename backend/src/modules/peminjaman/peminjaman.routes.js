import { Router } from 'express';
import * as peminjamanController from './peminjaman.controller.js';

const router = Router();

router.get('/', peminjamanController.getPeminjaman);
router.get('/:id', peminjamanController.getPeminjamanById);
router.post('/', peminjamanController.createPeminjaman);
router.put('/:id/kembali', peminjamanController.tandaiKembali);

export default router;

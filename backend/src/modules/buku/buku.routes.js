import { Router } from 'express';
import * as bukuController from './buku.controller.js';

const router = Router()

router.post('/', bukuController.createBuku);

router.put('/:id', bukuController.updateBuku);

router.get('/', bukuController.getBuku);

router.get('/:id', bukuController.getBukubyId);

router.delete('/:id', bukuController.deleteBuku);

export default router;
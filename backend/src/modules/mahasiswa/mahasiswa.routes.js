import { Router } from 'express';
import * as mahasiswaController from './mahasiswa.controller.js';

const router = Router();

router.get('/', mahasiswaController.getMahasiswa);
router.post('/', mahasiswaController.createMahasiswa);
router.get('/:id', mahasiswaController.getMahasiswaById);

export default router;
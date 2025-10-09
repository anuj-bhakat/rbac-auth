import express from 'express';
import { checkPermission } from '../middlewares/rbacMiddleware.js';
import { init, getAllRecord, createRecord, updateRecord, deleteRecord } from '../controllers/recordController.js';

const router = express.Router();

router.get('/init', init);
router.get('/records', checkPermission('read_record'), getAllRecord);
router.post('/records', checkPermission('create_record'), createRecord);
router.put('/records/:id', checkPermission('update_record'), updateRecord);
router.delete('/records/:id', checkPermission('delete_record'), deleteRecord);

export default router;
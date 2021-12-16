import express from 'express';
import controller from '../controllers/catalogs';
const router = express.Router();

router.get('/catalogs', controller.getCatalogs);

export = router;
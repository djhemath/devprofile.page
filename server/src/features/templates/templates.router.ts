import { Router } from 'express';
import { getTemplateInfo, previewTemplate } from './templates.controller';

const router = Router();

router.get('/preview/:templateId/:version', previewTemplate);
router.get('/info/:templateId/:version', getTemplateInfo);

export default router;
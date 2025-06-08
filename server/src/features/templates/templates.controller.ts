import fs from 'fs';
import path from 'path';

import * as ejs from 'ejs';
import { Request, Response } from 'express';

export async function previewTemplate(req: Request, res: Response) {
  const templateId = req.params.templateId;
  const version = req.params.version;

  const templateHome = path.join(__dirname, '..', '..', 'templates', templateId, version);
  const sampleDataPath = path.join(templateHome, 'sampledata.json');
  const sampleMetaDataPath = path.join(templateHome, 'samplemeta.json');
  const templateHomeFile = path.join(templateHome, 'home.ejs');

  const data = require(sampleDataPath);
  const meta = require(sampleMetaDataPath);

  const html = await ejs.renderFile(templateHomeFile, { data: { content: data, meta } });
  res.send(html);
}

export async function getTemplateInfo(req: Request, res: Response) {
    const templateId = req.params.templateId;
    const version = req.params.version;

    const templateHome = path.join(__dirname, '..', '..', 'templates', templateId, version);
    const info = require(path.join(templateHome, 'info.json'));
    
    const files: any = {};

    try {
        files['styles'] = [];
        for(let i=0; i<info.assets.styles.length; i++) {
            const cssFile = fs.readFileSync(path.join(templateHome, info.assets.styles[i]), 'utf-8');
            files['styles'].push(cssFile);
        }

        files['scripts'] = [];
        for(let i=0; i<info.assets.scripts.length; i++) {
            const javascriptFile = fs.readFileSync(path.join(templateHome, info.assets.scripts[i]), 'utf-8');
            files['scripts'].push(javascriptFile);
        }

        files['info'] = info;

        files['home.ejs'] = fs.readFileSync(path.join(templateHome, 'home.ejs'), 'utf-8');

        files['config'] = require(path.join(templateHome, 'config.json'));

        res.json({
            id: templateId,
            label: templateId.replace('-', ' '),
            files
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Template load failed');
    }
}

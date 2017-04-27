import path from 'path';
import fs from 'fs';

const configdir = process.env.LOCA_CONFIG_DIR || path.join(__dirname, '..', 'config');

const website = JSON.parse(fs.readFileSync(path.join(configdir, 'website.json'), 'utf8'));
const demomode = !(process.env.LOCA_DEMOMODE !== undefined && process.env.LOCA_DEMOMODE.toLowerCase() === 'false');

export default Object.assign(website, {
  demomode,
  showFooterElements: false,
  businesslogic: 'FR',
  productive: process.env.NODE_ENV === 'production',
  subscription: process.env.LOCA_PRODUCTIVE !== undefined && process.env.LOCA_PRODUCTIVE.toLowerCase() === 'true',
  database: demomode ? 'demodb' : process.env.MONGODB_URI || 'demodb'
});

import fs from 'fs';
import path from 'path';

export const createDirIfNotExists = (dirPath) => {
  const fullPath = path.resolve(dirPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${fullPath}`);
  }
};

#!/usr/bin/env node

import { getCachePath, loadConfig } from './dist/config/loader.js';

try {
  const config = await loadConfig();
  console.log('Config loaded:', {
    workingDir: config.workingDir,
    cachePath: config.cachePath
  });
  
  const fullCachePath = getCachePath(config);
  console.log('Full cache path:', fullCachePath);
  
} catch (error) {
  console.error('Error:', error);
}
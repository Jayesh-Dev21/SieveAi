#!/usr/bin/env node

import { loadConfig } from './dist/config/loader.js';
import { CacheManager } from './dist/cache/manager.js';
import { getCachePath } from './dist/config/loader.js';

try {
  console.log('Loading config...');
  const config = await loadConfig();
  console.log('Config loaded, cache enabled:', config.enableCache);
  
  console.log('Creating cache manager...');
  const cacheManager = new CacheManager({
    enabled: config.enableCache,
    dbPath: getCachePath(config),
  });
  console.log('Cache manager created successfully');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}
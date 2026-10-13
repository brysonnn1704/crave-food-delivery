/**
 * scripts/import-dataset.js
 * 
 * Master data ingestion orchestrator for Crave.
 * Runs source discovery, data extraction from permitted sources,
 * normalization, and strict dataset validation.
 */

import { checkSourceAvailability } from './discover-sources.js';
import { runScrapingPipeline } from './scrape-permitted-source.js';
import { normalizeData } from './normalize-data.js';
import { validateDatasets } from './validate-data.js';

async function runMasterImport() {
  console.log('====================================================');
  console.log('       CRAVE DATA INGESTION & REFRESH WORKFLOW      ');
  console.log('====================================================');
  const startTime = Date.now();

  try {
    // 1. Verify sources and license compliance
    console.log('\n[STAGE 1/4] Checking Data Sources & Terms of Service...');
    await checkSourceAvailability();

    // 2. Extract permitted raw data
    console.log('\n[STAGE 2/4] Extracting Permitted Data Records...');
    await runScrapingPipeline();

    // 3. Normalize schema
    console.log('\n[STAGE 3/4] Normalizing Restaurant & Menu Records...');
    const { normalizedRestaurants, normalizedMenus } = normalizeData();

    // 4. Validate output
    console.log('\n[STAGE 4/4] Validating Dataset Integrity...');
    const valResult = validateDatasets();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n====================================================');
    console.log('       DATA IMPORT WORKFLOW COMPLETED SUCCESSFULLY  ');
    console.log('====================================================');
    console.log(`Restaurants Imported: ${normalizedRestaurants.length}`);
    console.log(`Menu Items Imported:  ${normalizedMenus.length}`);
    console.log(`Execution Time:       ${elapsed}s`);
    console.log('Status:               VALIDATED & READY');
  } catch (err) {
    console.error('\nDATA IMPORT FAILED:', err.message);
    process.exit(1);
  }
}

runMasterImport();

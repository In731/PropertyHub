const fs = require('fs');
const path = require('path');

const fileToDelete = path.join(__dirname, '../src/app/data/properties.ts');

if (fs.existsSync(fileToDelete)) {
  try {
    fs.unlinkSync(fileToDelete);
    console.log(`Deleted properties.ts successfully: ${fileToDelete}`);
  } catch (e) {
    console.error('Failed to delete properties.ts:', e);
  }
} else {
  console.log('properties.ts already deleted.');
}

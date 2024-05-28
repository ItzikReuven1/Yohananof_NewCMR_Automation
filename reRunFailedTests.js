const { exec } = require('child_process');
const fs = require('fs');

// Read the failed test files from the JSON file
let failedTestFiles = [];
try {
  const data = fs.readFileSync('failedTestFiles.json', 'utf8');
  failedTestFiles = JSON.parse(data);
} catch (err) {
  console.error('Error reading failedTestFiles.json:', err);
  process.exit(1);
}

// Function to run a single test file
function runTestFile(file) {
  return new Promise((resolve, reject) => {
    exec(`npx playwright test ${file} --reporter=line,allure-playwright`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing test file ${file}: ${error}`);
        reject(error);
        return;
      }
      console.log(`Output for test file ${file}:\n${stdout}`);
      if (stderr) {
        console.error(`Errors for test file ${file}:\n${stderr}`);
      }
      resolve();
    });
  });
}

// Sequentially run all failed test files
(async () => {
  for (const file of failedTestFiles) {
    try {
      await runTestFile(file);
    } catch (err) {
      console.error(`Failed to run test file ${file}: ${err}`);
    }
  }
})();

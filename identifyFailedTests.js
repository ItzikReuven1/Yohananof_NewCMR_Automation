const fs = require('fs');
const path = require('path');

const allureResultsPath = './allure-results'; // Adjust the path if necessary
const failedTestFiles = new Set();

fs.readdirSync(allureResultsPath).forEach(file => {
  if (file.endsWith('-result.json')) {
    const result = JSON.parse(fs.readFileSync(path.join(allureResultsPath, file), 'utf8'));
    if (result.status === 'failed') {
      const testFile = result.labels.find(label => label.name === 'suite')?.value;
      if (testFile) {
        failedTestFiles.add(testFile);
      }
    }
  }
});

// Convert Set to Array and sort it
const failedTestFilesArray = [...failedTestFiles].sort((a, b) => {
  // Custom sort logic here
  // For alphabetical order:
  return a.localeCompare(b);

  // For specific custom order, you can manually define the order or use a different comparison function
  // For example:
  // const order = ["testFile06.spec.js", "testFile11.spec.js", "testFile14.spec.js", ...];
  // return order.indexOf(a) - order.indexOf(b);
});

fs.writeFileSync('failedTestFiles.json', JSON.stringify(failedTestFilesArray, null, 2));
console.log('Failed test files (sorted):', failedTestFilesArray);

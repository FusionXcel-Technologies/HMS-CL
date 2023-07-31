const { exec } = require('child_process');
const { createHash } = require('crypto');
const fs = require('fs').promises;

const currentTimestamp = `${Date.now()}_${getHashedValue(Date.now().toString()).slice(0, 3)}`.toLocaleUpperCase();

const buildFolderPath = `./dist/${currentTimestamp}`;
const filePath = '../app/node/bin/www';

function getHashedValue(data, algorithm = 'sha256', encoding = 'hex') {
    const hash = createHash(algorithm);
    hash.update(data);
    return hash.digest(encoding);
}

async function installPackages() {
    await executeCommand('npm i fs-extra');
    await executeCommand('npm i archiver');
    await executeCommand('npm i -g pkg');
}

const dataToAppend = `
if (cluster.isMaster) {
  const { exec } = require('child_process');

  function getWiFiIPv4Address() {
    const networkInterfaces = os.networkInterfaces();
    const adapterPriorities = ['wi-fi', 'ethernet', 'usb ethernet', 'bluetooth ethernet'];

    for (const adapterPriority of adapterPriorities) {
      for (const interfaceName in networkInterfaces) {
        const interfaceInfo = networkInterfaces[interfaceName];
        for (const info of interfaceInfo) {
          if (info.family === 'IPv4') {
            console.log(\`server on network "\${interfaceName}" http://\${info.address}:8000\`);

            if (info.internal === false && interfaceName.toLowerCase().includes(adapterPriority)) {
              return info.address;
            }
          }
        }
      }
    }

    return null; // Return null if no suitable adapter is found
  }

  async function executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(\`Error: \${error.message}\`);
          reject(error);
        } else if (stderr) {
          console.error(\`stderr: \${stderr}\`);
          reject(new Error(stderr));
        } else {
          console.log(\`stdout: \${stdout}\`);
          resolve(stdout);
        }
      });
    });
  }

  (async () => {
    const IPv4Address = getWiFiIPv4Address();

    if (IPv4Address) {
      try {
        await executeCommand(\`start "app" http://\${IPv4Address}:8000\`);
      } catch (error) {
        console.error('An error occurred:', error);
        await executeCommand('start "app" http://localhost:8000');
      }
    } else {
      console.log('No suitable network adapter found. Starting on localhost...');
      await executeCommand('start "app" http://localhost:8000');
    }
  })();
}
`;

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
            } else if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(new Error(stderr));
            } else {
                console.log(`stdout: ${stdout}`);
                resolve(stdout);
            }
        });
    });
}

async function readOriginalFileData(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading original file data: ${err.message}`);
        throw err;
    }
}

async function appendDataToFile(filePath, data) {
    try {
        await fs.writeFile(filePath, data, 'utf8');
        console.log('Data appended successfully!');
    } catch (err) {
        console.error(`Error appending data to file: ${err.message}`);
        throw err;
    }
}

async function deleteFiles(files) {
    try {
        for (const file of files) {
            try {
                await fs.unlink(file);
                console.log(`Deleted file: ${file}`);
            } catch (error) {
                console.log(`file not available: ${file}`);
            }
        }
    } catch (error) {
        console.error('Error deleting files:', error);
        throw error;
    }
}



async function copyFolders() {
    var fsExtra = require('fs-extra');
    const archiver = require('archiver');
    let fss = require('fs');

    try {
        await fsExtra.ensureDir(`./${buildFolderPath}/frontend/angular/dist/angular`);
        await fsExtra.copy('../app/node/frontend/angular/dist/angular', `./${buildFolderPath}/frontend/angular/dist/angular`);
        console.log('Frontend folder copied successfully.');


        // Read the content of the original package.json file
        const originalPackageJsonPath = '../app/node/package.json';
        const originalPackageJsonContent = await fsExtra.readFile(originalPackageJsonPath, 'utf8');

        // Parse the JSON content to extract the "dependencies" field
        const packageJsonData = JSON.parse(originalPackageJsonContent);
        const dependencies = packageJsonData.dependencies;

        // Create a new object with only the "dependencies" field
        const newPackageJsonData = { dependencies };

        // Write the new object as a JSON string to a new package.json file
        const newPackageJsonPath = `${buildFolderPath}/package.json`;
        await fsExtra.writeJson(newPackageJsonPath, newPackageJsonData, { spaces: 2 });


        let setupFileData = `const { exec } = require('child_process');async function executeCommand(command) {return new Promise((resolve, reject) => {exec(command, (error, stdout, stderr) => {if (error) {console.error(\`Error: \${error.message}\`);reject(error);} else if (stderr) {console.error(\`stderr: \${stderr}\`);reject(new Error(stderr));} else {console.log(\`stdout: \${stdout}\`);resolve(stdout);}});});}(async () => {await executeCommand(\`npm i\`);})();`;

        await appendDataToFile(`${buildFolderPath}/setup`, setupFileData)
        await executeCommand(`pkg ./${buildFolderPath}/setup -o ./${buildFolderPath}/setup`)
        await fs.unlink(`./${buildFolderPath}/setup`);

        // Create a zip file from the copied build data
        const outputZipPath = `./dist/${currentTimestamp}.zip`;
        const archive = archiver('zip', { zlib: { level: 9 } });
        const outputStream = fss.createWriteStream(outputZipPath);

        outputStream.on('close', () => {
            console.log('Zip file created successfully:', outputZipPath);
        });

        archive.pipe(outputStream);
        archive.directory(buildFolderPath, false);
        archive.finalize();


        await new Promise((resolve) => {
            outputStream.on('close', () => {
                console.log('Zip file created successfully:', outputZipPath);
                resolve();
            });
            archive.on('error', (err) => {
                console.error('Error creating zip file:', err);
                reject(err);
            });
        });

    } catch (error) {
        console.error('Error copying folders:', error);
        throw error;
    }
}

async function main() {
    try {
        await installPackages();
        const originalFileData = await readOriginalFileData(filePath);
        await appendDataToFile(filePath, originalFileData + dataToAppend);
        await executeCommand(`pkg ../app/node/bin/www -o ./${buildFolderPath}/run`);
        await appendDataToFile(filePath, originalFileData);

        await copyFolders();

        console.log('Process completed successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();

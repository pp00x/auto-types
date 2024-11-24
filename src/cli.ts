#!/usr/bin/env node
import { installTypes } from './index';
import { readPackageJson, getProjectRoot, execAsync } from './utils';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // If no args, check package.json
    const projectRoot = getProjectRoot();
    const packageJson = readPackageJson(projectRoot);
    const dependencies = Object.keys(packageJson.dependencies || {});

    if (dependencies.length > 0) {
      await installTypes(dependencies);
    } else {
      console.log('No packages found to check for types.');
    }
  } else {
    const command = args[0];
    const packages = args.slice(1);
    if (command === 'install' && packages.length > 0) {
      // Run npm install packages
      const installCommand = `npm install ${packages.join(' ')}`;
      console.log(`Running: ${installCommand}`);
      await execAsync(installCommand);

      // Now install types
      await installTypes(packages);
    } else {
      // Assume args are package names to install types for
      await installTypes(args);
    }
  }
}

main().catch(console.error);
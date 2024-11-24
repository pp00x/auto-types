import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { execAsync, getProjectRoot } from './utils';

export async function checkTypeAvailability(packageName: string): Promise<boolean> {
  try {
    const response = await axios.get(`https://registry.npmjs.org/@types/${packageName}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export async function installTypes(packageNames: string[]): Promise<void> {
  const projectRoot = getProjectRoot();
  const spinner = ora('Checking for available type definitions...').start();

  try {
    const typesAvailable = await Promise.all(
      packageNames.map(async (pkg) => ({
        package: pkg,
        hasTypes: await checkTypeAvailability(pkg),
      }))
    );

    const packagesToInstall = typesAvailable
      .filter((pkg) => pkg.hasTypes)
      .map((pkg) => `@types/${pkg.package}`);

    if (packagesToInstall.length === 0) {
      spinner.info('No type definitions found to install.');
      return;
    }

    spinner.text = 'Installing type definitions...';

    const installCommand = `npm install ${packagesToInstall.join(
      ' '
    )} --save-dev --prefix "${projectRoot}"`;
    await execAsync(installCommand);

    spinner.succeed(
      chalk.green(`Successfully installed types for: ${packagesToInstall.join(', ')}`)
    );
  } catch (error) {
    spinner.fail(chalk.red('Error installing type definitions'));
    console.error(error);
  }
}
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import {
  execAsync,
  getProjectRoot,
  hasBuiltInTypes,
  getPackageInfo,
} from './utils';

export async function checkTypeAvailability(
  packageName: string,
): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://registry.npmjs.org/@types/${packageName}`,
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export async function installTypes(packageNames: string[]): Promise<void> {
  const projectRoot = getProjectRoot();
  const spinner = ora('Checking for available type definitions...').start();

  try {
    for (const packageName of packageNames) {
      spinner.text = `Checking ${packageName}...`;

      const hasTypes = await hasBuiltInTypes(packageName);

      if (hasTypes) {
        spinner.info(
          chalk.yellow(
            `Package ${packageName} provides its own type definitions. Skipping @types installation.`,
          ),
        );
        continue;
      }

      const typesAvailable = await checkTypeAvailability(packageName);

      if (typesAvailable) {
        spinner.text = `Installing @types/${packageName}...`;
        const installCommand = `npm install @types/${packageName} --save-dev --prefix "${projectRoot}"`;
        await execAsync(installCommand);
        spinner.succeed(
          chalk.green(`Successfully installed types for: @types/${packageName}`),
        );
      } else {
        const packageInfo = await getPackageInfo(packageName);
        if (packageInfo) {
           spinner.warn(chalk.yellow(`No type definitions found for ${packageName}, neither built-in nor @types. Latest version is ${packageInfo['dist-tags']?.latest}.`));
        } else {
          spinner.warn(chalk.yellow(`Package ${packageName} not found in npm registry.`))
        }
      }
    }

    spinner.stop();
  } catch (error) {
    spinner.fail(chalk.red('Error installing type definitions'));
    console.error(error);
  }
}
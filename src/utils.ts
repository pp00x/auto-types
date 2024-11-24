import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { PackageJson } from './types';

export const execAsync = promisify(exec);

export function getProjectRoot(): string {
  return process.env.INIT_CWD || process.cwd();
}

export function readPackageJson(projectPath: string): PackageJson {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const content = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(content);
}
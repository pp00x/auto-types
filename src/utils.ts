import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { PackageJson } from './types';
import axios from 'axios';

export const execAsync = promisify(exec);

export function getProjectRoot(): string {
  return process.env.INIT_CWD || process.cwd();
}

export function readPackageJson(projectPath: string): PackageJson {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(content);
  } else {
    return {};
  }
}

export async function getPackageInfo(packageName: string): Promise<any> {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
export async function hasBuiltInTypes(packageName: string): Promise<boolean> {
  try {
    const packageInfo = await getPackageInfo(packageName);
    if (!packageInfo) return false;

    const versions = Object.keys(packageInfo.versions);
    const latestVersion = versions.pop();
    if (!latestVersion) return false;

    const latestPackageData = packageInfo.versions[latestVersion];

    
    if (latestPackageData.types || latestPackageData.typings) {
      return true;
    }
    
    if (latestPackageData.exports) {
      for (const key of Object.keys(latestPackageData.exports)) {
        const exportVal = latestPackageData.exports[key];
        if (typeof exportVal === 'object' && (exportVal.types || exportVal.typings)) {
          return true;
        }
      }
    }

    
    const projectRoot = getProjectRoot();
    const packagePath = path.join(
      projectRoot,
      'node_modules',
      packageName,
    );
    if(fs.existsSync(packagePath)){
    const typesPath = path.join(packagePath, 'index.d.ts');
    const packageJsonPath = path.join(packagePath, 'package.json');
    if (fs.existsSync(typesPath)) return true;
    
        if (fs.existsSync(packageJsonPath)) {
          const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
          const packageJson = JSON.parse(packageJsonContent);
          if (packageJson.types || packageJson.typings) return true;
            
            if(packageJson.exports){
              for (const key of Object.keys(packageJson.exports)) {
                const exportVal = packageJson.exports[key];
                if (typeof exportVal === 'object' && (exportVal.types || exportVal.typings)) {
                  return true;
                }
              }
            }
      }
    }

    return false;
  } catch (error) {
    console.error(`Error checking for built-in types for ${packageName}:`, error);
    return false;
  }
}
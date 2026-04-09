import { existsSync, globSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const WORKSPACE_FILE = path.join(ROOT_DIR, 'pnpm-workspace.yaml');

function readWorkspacePatterns() {
  const workspace = readFileSync(WORKSPACE_FILE, 'utf8');
  const lines = workspace.split('\n');
  const patterns = [];
  let inPackagesBlock = false;

  for (const line of lines) {
    if (/^\s*packages\s*:\s*$/.test(line)) {
      inPackagesBlock = true;
      continue;
    }

    if (!inPackagesBlock) {
      continue;
    }

    const match = line.match(/^\s*-\s*["']?([^"']+)["']?\s*$/);

    if (match) {
      patterns.push(match[1]);
      continue;
    }

    if (/^\S/.test(line)) {
      break;
    }
  }

  return patterns;
}

function readWorkspacePackageNames() {
  const packageNames = new Set();

  for (const pattern of readWorkspacePatterns()) {
    const modulePaths = globSync(pattern, {
      cwd: ROOT_DIR,
      onlyDirectories: true,
      posix: false,
    });

    for (const modulePath of modulePaths) {
      const packageJsonPath = path.join(ROOT_DIR, modulePath, 'package.json');

      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      if (
        typeof packageJson.name === 'string' &&
        packageJson.name.trim() !== ''
      ) {
        packageNames.add(packageJson.name.trim());
      }
    }
  }

  return [...packageNames].toSorted((left, right) => left.localeCompare(right));
}

const scopeEnum = readWorkspacePackageNames();

export default {
  extends: ['@commitlint/config-conventional'],
  rules:
    scopeEnum.length > 0
      ? {
          'scope-enum': [2, 'always', scopeEnum],
        }
      : {},
};

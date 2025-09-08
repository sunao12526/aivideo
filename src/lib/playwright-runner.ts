import { spawn } from 'child_process';
import path from 'path';

interface TestResult {
  success: boolean;
  output: string;
}

export function runPlaywrightTest(testFile: string, params: Record<string, string>): Promise<TestResult> {
  return new Promise((resolve) => {
    const testPath = path.resolve(process.cwd(), testFile);
    const args = ['test:e2e', testPath];

    const env = {
      ...process.env,
      ...params,
    };

    const child = spawn('pnpm', args, { env });

    let output = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        output,
      });
    });

    child.on('error', (err) => {
      resolve({
        success: false,
        output: err.message,
      });
    });
  });
}
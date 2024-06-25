import * as core from '@actions/core';
import fs from 'fs';
import util from 'util';

async function run(): Promise<void> {
  try {
    const filePath = core.getInput('path');
    const encoding = core.getInput('encoding');
    const readFile = util.promisify(fs.readFile);
    const contents = await readFile(filePath, encoding);
    core.info(`File contents:\n${contents}`);

    // Write to environment file
    const outputFilePath = process.env.GITHUB_ENV || '';
    if (outputFilePath) {
      const output = `contents<<EOF\n${contents}\nEOF`;
      await fs.promises.appendFile(outputFilePath, output + '\n');
    } else {
      core.warning('GITHUB_ENV not defined. Cannot write to environment file.');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

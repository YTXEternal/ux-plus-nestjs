import { generateKeyPairSync } from 'node:crypto';
import inquirer from 'inquirer';
import { resolve } from 'node:path';
import {writeFileSync,mkdirSync,existsSync } from 'node:fs';


const generateKeyPair = ({ passphrase, modulusLength, cipher }) => {
  return generateKeyPairSync('rsa', {
    modulusLength: +modulusLength, // 密钥长度
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher,
      passphrase, // 如果需要加密私钥，可提供密码
    },
  });
};

async function main() {
  // 第一步：询问用户关于密钥长度
  const keyLengthAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'modulusLength',
      message: '请选择RSA密钥长度:',
      choices: ['1024', '2048', '3072', '4096'],
      default: '3072',
    },
  ]);

  // 第二步：询问用户关于私钥加密算法
  const cipherAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'cipher',
      message: '请输入私钥加密算法 (默认 aes-256-cbc):',
      default: 'aes-256-cbc',
    },
  ]);

  // 第三步：询问用户关于加密私钥的密码
  const passphraseAnswers = await inquirer.prompt([
    {
      type: 'password',
      name: 'passphrase',
      message: '请输入用于加密私钥的密码:',
      mask: '*',
    },
  ]);

  const defaultPath = resolve(process.cwd(), './keys');

  // 第四步：询问用户关于输出位置
  const outputPathAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputPath',
      message: `请输入输出位置 (${defaultPath}):`,
      default: defaultPath,
    },
  ]);

  const options = {
    ...keyLengthAnswers,
    ...cipherAnswers,
    ...passphraseAnswers,
    ...outputPathAnswers,
  };
  const keys = generateKeyPair(options);

  const targetDir = outputPathAnswers.outputPath;
  const pubFilePath = resolve(outputPathAnswers.outputPath,'PUB.pem');
  const privateFilePath = resolve(outputPathAnswers.outputPath,'PRIVATE.pem');
  const passphraseFilePath = resolve(outputPathAnswers.outputPath,'passphrase.txt');

  const writeFileKey = () =>{
    writeFileSync(pubFilePath,keys.publicKey,'utf-8');
    writeFileSync(privateFilePath,keys.privateKey,'utf-8');
    writeFileSync(passphraseFilePath,options.passphrase,'utf-8');
  }

  const createdDir = () =>{
    mkdirSync(targetDir,{
      recursive:true,
    })
  }

  try {
    const isexist = existsSync(targetDir);
    isexist && createdDir()
  } catch(err) {
    throw err;
  }
  writeFileKey();
}
main().catch(console.error);

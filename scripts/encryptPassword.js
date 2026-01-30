const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '.env.development' });

const PUBKEY_PATH = process.env.PUBKEYPATH || 'keys/PUB.pem';

function md5(plaintext) {
  return crypto.createHash('md5').update(plaintext).digest('hex');
}

function encrypt(data, pubKeyPath) {
  try {
    const absolutePath = path.resolve(process.cwd(), pubKeyPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Public key file not found at: ${absolutePath}`);
    }
    const pubKey = fs.readFileSync(absolutePath, 'utf-8');

    return crypto.publicEncrypt(
      {
        key: pubKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(data)
    ).toString('base64');
  } catch (error) {
    console.error('Encryption failed:', error.message);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/encryptPassword.js <password>');
  process.exit(1);
}

const password = args[0];
// Logic from UxPasswordService.encryptedPassword: md5 -> encrypt
const hashedPassword = md5(password);
const encrypted = encrypt(hashedPassword, PUBKEY_PATH);

console.log('Encrypted Password (RSA(MD5(password))):');
console.log(encrypted);

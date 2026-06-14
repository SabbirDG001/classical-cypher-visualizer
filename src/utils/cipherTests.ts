import { TestCase, TestResult } from '../types';
import {
  caesarEncrypt,
  caesarDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  rot13Encrypt,
  rot13Decrypt,
  atbashEncrypt,
  atbashDecrypt,
  railFenceEncrypt,
  railFenceDecrypt,
  playfairEncrypt,
  playfairDecrypt,
  monoalphabeticEncrypt,
  monoalphabeticDecrypt,
  hillEncrypt,
  hillDecrypt,
  peripheralEncrypt,
  peripheralDecrypt
} from './ciphers';

export const CIPHER_TEST_SUITE: TestCase[] = [
  {
    id: 't-caesar-1',
    name: 'Caesar Cipher: Standard Shift 3 (ROT3)',
    cipherId: 'caesar',
    input: 'HELLO WORLD',
    key: '3',
    expectedEncrypt: 'KHOOR ZRUOG',
    expectedDecrypt: 'HELLO WORLD'
  },
  {
    id: 't-caesar-2',
    name: 'Caesar Cipher: Circular Wrapping with Shift 25',
    cipherId: 'caesar',
    input: 'XYZ abc',
    key: '25',
    expectedEncrypt: 'WXY zab',
    expectedDecrypt: 'XYZ abc'
  },
  {
    id: 't-vigenere-1',
    name: 'Vigenere Cipher: Polyalphabetic key LEMON',
    cipherId: 'vigenere',
    input: 'ATTACKATDAWN',
    key: 'LEMON',
    expectedEncrypt: 'LXFOPVMEFRNH',
    expectedDecrypt: 'ATTACKATDAWN'
  },
  {
    id: 't-vigenere-2',
    name: 'Vigenere Cipher: Keyword with Mixed Case symbols',
    cipherId: 'vigenere',
    input: 'Hello! World?',
    key: 'KEY',
    expectedEncrypt: 'Rijvs! Uyvhn?',
    expectedDecrypt: 'Hello! World?'
  },
  {
    id: 't-rot13-1',
    name: 'ROT13 Cipher: Fixed 13 Shift Rotation',
    cipherId: 'rot13',
    input: 'HELLO WORLD',
    key: '',
    expectedEncrypt: 'URYYB BEIYQ',
    expectedDecrypt: 'HELLO WORLD'
  },
  {
    id: 't-atbash-1',
    name: 'Atbash Cipher: Mirror Reverse Alphabet alphabet',
    cipherId: 'atbash',
    input: 'abcdefghijklmnopqrstuvwxyz',
    key: '',
    expectedEncrypt: 'zyxwvutsrqponmlkjihgfedcba',
    expectedDecrypt: 'abcdefghijklmnopqrstuvwxyz'
  },
  {
    id: 't-atbash-2',
    name: 'Atbash Cipher: String Preserve Capitalization',
    cipherId: 'atbash',
    input: 'HELLO Atbash',
    key: '',
    expectedEncrypt: 'SVOOL Zgyzhs',
    expectedDecrypt: 'HELLO Atbash'
  },
  {
    id: 't-railfence-1',
    name: 'Rail Fence Cipher: 3 Rails Transposition zigzag',
    cipherId: 'railfence',
    input: 'WEAREDISCOVEREDFLEEATONCE',
    key: '3',
    expectedEncrypt: 'WECRLTEERDSOEEFEAOCAIVDEN',
    expectedDecrypt: 'WEAREDISCOVEREDFLEEATONCE'
  },
  {
    id: 't-playfair-1',
    name: 'Playfair Cipher: Grid 5x5 Key alignment',
    cipherId: 'playfair',
    input: 'INSTRUMENTS',
    key: 'MONARCHY',
    expectedEncrypt: 'GATLMZCLRQAX', // Digraph pairs: IN ST RU ME NT SX -> GA TL MZ CL RQ AX
    expectedDecrypt: 'INSTRUMENTSX'  // Decrypts padded to even characters
  },
  {
    id: 't-mono-1',
    name: 'Monoalphabetic Cipher: Standard Scrambled Key',
    cipherId: 'monoalphabetic',
    input: 'HELLO WORLD',
    key: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    expectedEncrypt: 'ITSSG VGKSR',
    expectedDecrypt: 'HELLO WORLD'
  },
  {
    id: 't-hill-1',
    name: 'Hill Cipher: 2x2 Invertible Matrix HELP',
    cipherId: 'hill',
    input: 'HELP',
    key: 'HELP',
    expectedEncrypt: 'NHHI',
    expectedDecrypt: 'HELP'
  },
  {
    id: 't-peripheral-1',
    name: 'Peripheral Cipher: 3x3 Spiral Path Translation',
    cipherId: 'peripheral',
    input: 'HELLO',
    key: '3',
    expectedEncrypt: 'HELXXXLXO',
    expectedDecrypt: 'HELLOXXXX'
  }
];

export function runCipherTests(): TestResult[] {
  return CIPHER_TEST_SUITE.map(tc => {
    let t0 = 0;
    let actualEncrypt = '';
    let encryptDurationMs = 0;

    let t1 = 0;
    let actualDecrypt = '';
    let decryptDurationMs = 0;

    let passed = false;
    let errorMessage = '';

    try {
      if (tc.cipherId === 'caesar') {
        const shiftInt = parseInt(tc.key, 10) || 0;
        t0 = performance.now();
        const resEnc = caesarEncrypt(tc.input, shiftInt);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = caesarDecrypt(actualEncrypt, shiftInt);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'vigenere') {
        t0 = performance.now();
        const resEnc = vigenereEncrypt(tc.input, tc.key);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = vigenereDecrypt(actualEncrypt, tc.key);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'rot13') {
        t0 = performance.now();
        const resEnc = rot13Encrypt(tc.input);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = rot13Decrypt(actualEncrypt);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'atbash') {
        t0 = performance.now();
        const resEnc = atbashEncrypt(tc.input);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = atbashDecrypt(actualEncrypt);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'railfence') {
        const rails = parseInt(tc.key, 10) || 3;
        t0 = performance.now();
        const resEnc = railFenceEncrypt(tc.input, rails);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = railFenceDecrypt(actualEncrypt, rails);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'playfair') {
        t0 = performance.now();
        const resEnc = playfairEncrypt(tc.input, tc.key);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = playfairDecrypt(actualEncrypt, tc.key);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'monoalphabetic') {
        t0 = performance.now();
        const resEnc = monoalphabeticEncrypt(tc.input, tc.key);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = monoalphabeticDecrypt(actualEncrypt, tc.key);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'hill') {
        t0 = performance.now();
        const resEnc = hillEncrypt(tc.input, tc.key);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = hillDecrypt(actualEncrypt, tc.key);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;

      } else if (tc.cipherId === 'peripheral') {
        t0 = performance.now();
        const resEnc = peripheralEncrypt(tc.input, tc.key);
        encryptDurationMs = performance.now() - t0;
        actualEncrypt = resEnc.outputText;

        t1 = performance.now();
        const resDec = peripheralDecrypt(actualEncrypt, tc.key);
        decryptDurationMs = performance.now() - t1;
        actualDecrypt = resDec.outputText;
      }

      // Assert correctness
      const encryptMatch = actualEncrypt === tc.expectedEncrypt;
      const decryptMatch = actualDecrypt === tc.expectedDecrypt;

      if (encryptMatch && decryptMatch) {
        passed = true;
      } else {
        const issues = [];
        if (!encryptMatch) issues.push(`Encrypt mismatch. Expected "${tc.expectedEncrypt}", got "${actualEncrypt}"`);
        if (!decryptMatch) issues.push(`Decrypt mismatch. Expected "${tc.expectedDecrypt}", got "${actualDecrypt}"`);
        errorMessage = issues.join('; ');
      }
    } catch (err: any) {
      passed = false;
      errorMessage = err?.message || 'Error occurred during cryptographic execution';
    }

    return {
      testCase: tc,
      passed,
      encryptDurationMs: parseFloat(encryptDurationMs.toFixed(3)),
      decryptDurationMs: parseFloat(decryptDurationMs.toFixed(3)),
      actualEncrypt,
      actualDecrypt,
      errorMessage: errorMessage || undefined
    };
  });
}

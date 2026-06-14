export type CipherType = 'substitution' | 'transposition' | 'polyalphabetic';

export interface CipherAlgorithm {
  id: string;
  name: string;
  category: CipherType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  howItWorks: string;
  history: string;
  complexity: {
    time: string;
    space: string;
    keySpace: string;
  };
  keyLabel: string;
  keyPlaceholder: string;
  defaultKey: string;
  keyType: 'number' | 'text' | 'none';
  keyValidation?: (val: string) => string | null;
}

export interface EncryptionStep {
  index: number;
  original: string;
  keyUsed?: string | number;
  calculation?: string;
  result: string;
  highlightedIndices?: number[]; // indices in grid/alphabets to highlight
}

export interface RailFenceGridCell {
  char: string;
  isLetter: boolean;
  row: number;
  col: number;
}

export interface PlayfairDetails {
  grid: string[][]; // 5x5 grid
  pairs: [string, string][];
  cipherPairs: [string, string][];
  rulesApplied: string[];
}

export interface CipherResult {
  outputText: string;
  steps: EncryptionStep[];
  meta?: any; // Alg specific visual states like PlayfairDetails or RailFence wave matrices
}

export interface TestCase {
  id: string;
  name: string;
  cipherId: string;
  input: string;
  key: string;
  expectedEncrypt: string;
  expectedDecrypt: string;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  encryptDurationMs: number;
  decryptDurationMs: number;
  actualEncrypt: string;
  actualDecrypt: string;
  errorMessage?: string;
}

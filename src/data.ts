import { CipherAlgorithm } from './types';

export const CIPHERS_DATA: CipherAlgorithm[] = [
  {
    id: 'caesar',
    name: 'Caesar Cipher',
    category: 'substitution',
    difficulty: 'Easy',
    description: 'One of the earliest and simplest known ciphers, shifting letters forward or backward by a fixed key distance.',
    howItWorks: 'To encrypt, shift each letter right by the Shift Value modulo 26. For example, a shift of 3 maps "A" to "D", "B" to "E", etc. Spaces, digits, and symbols are passed through unaltered.',
    history: 'Named after Julius Caesar, who utilized it with a shift of 3 to safeguard Roman military orders. Today, it offers zero modern security but remains the classic introduction to rotational substitution.',
    complexity: {
      time: 'O(N) - Single pass scan',
      space: 'O(N) - Output text array',
      keySpace: '25 usable keys (very trivial brute force)'
    },
    keyLabel: 'Shift Offset (0 to 25)',
    keyPlaceholder: 'Enter shift amount (e.g. 3)',
    defaultKey: '3',
    keyType: 'number',
    keyValidation: (val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0 || num > 25) return 'Shift must be an integer between 0 and 25';
      return null;
    }
  },
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'polyalphabetic',
    difficulty: 'Medium',
    description: 'A polyalphabetic substitution cipher that maps letters using a series of repeating, interleaved Caesar shifts based on a keyword.',
    howItWorks: 'Each letter of the plaintext is dynamically shifted by the index of the corresponding letter in a repeating keyword. If the key is "KEY", the first letter shifts by K (10), second by E (4), and third by Y (24). Symbols do not advance the key rotation.',
    history: 'Originally crafted in 1553 by Giovan Battista Bellaso, but misattributed to diplomat Blaise de Vigenère in the 19th century. Nicknamed "le chiffre indéchiffrable" (the indecipherable cipher), it withstood cryptanalysis for over three hundred years.',
    complexity: {
      time: 'O(N) - Linear text scan with key index rotation',
      space: 'O(N) - Dynamic buffer',
      keySpace: '26^L keys (where L is length of keyword)'
    },
    keyLabel: 'Keyword (A-Z letters)',
    keyPlaceholder: 'Enter keyword (e.g. LEMON)',
    defaultKey: 'LEMON',
    keyType: 'text',
    keyValidation: (val) => {
      if (!val || !/^[a-zA-Z]+$/.test(val)) return 'Keyword must consist only of English letters';
      return null;
    }
  },
  {
    id: 'rot13',
    name: 'ROT13 Cipher',
    category: 'substitution',
    difficulty: 'Easy',
    description: 'A symmetric implementation of Caesar cipher with a static shift of 13, making it its own inverse.',
    howItWorks: 'Applying ROT13 to a piece of text twice returns it to its original form. Characters A-M shift +13 to N-Z, while N-Z shift -13 back to A-M.',
    history: 'Widely used in early Usenet newsgroups and modern forums (like Reddit) as a minimal convention for hiding puzzle solutions, jokes, spoilers, or spoilers from inadvertent sight.',
    complexity: {
      time: 'O(N)',
      space: 'O(N)',
      keySpace: '1 fixed offset'
    },
    keyLabel: 'Fixed Shift (13)',
    keyPlaceholder: 'No key input required',
    defaultKey: '',
    keyType: 'none'
  },
  {
    id: 'atbash',
    name: 'Atbash Cipher',
    category: 'substitution',
    difficulty: 'Easy',
    description: 'A traditional monoalphabetic substitution cipher that mirrors the alphabet letters directly.',
    howItWorks: 'The first letter "A" maps to the last "Z", "B" maps to "Y", "C" to "X", and so forth. Since it works as a reflection, running the algorithm against a ciphertext immediately decrypts it back to plaintext.',
    history: 'Dating back to approximately 500 BC, it was originally used in Hebrew scripts (and appears famously in the biblical Book of Jeremiah) to obscure names and military identities.',
    complexity: {
      time: 'O(N)',
      space: 'O(N)',
      keySpace: '1 fixed reciprocal map'
    },
    keyLabel: 'Symmetric Reverse',
    keyPlaceholder: 'No key input required',
    defaultKey: '',
    keyType: 'none'
  },
  {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    category: 'transposition',
    difficulty: 'Medium',
    description: 'A transposition cipher that alters the physical arrangement of text characters in a zigzag wave path.',
    howItWorks: 'Plaintext is written diagonally downwards and upwards across multiple "rails" (rows). Once the length is mapped, the letters are read off row-by-row to construct the cipher layout.',
    history: 'A foundational cipher that does not replace letters, but shuffles their positions. Famously used during the American Civil War by scouts to deliver fast manual intelligence without full codebooks.',
    complexity: {
      time: 'O(N) - Linear mapping',
      space: 'O(N * R) - Matrix grid footprint for R rails',
      keySpace: 'R relative rails (strictly bounded in practice)'
    },
    keyLabel: 'Number of Rails (2 to 10)',
    keyPlaceholder: 'Enter rail quantity (e.g. 3)',
    defaultKey: '3',
    keyType: 'number',
    keyValidation: (val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 2 || num > 10) return 'Rails must be an integer between 2 and 10';
      return null;
    }
  },
  {
    id: 'playfair',
    name: 'Playfair Cipher',
    category: 'polyalphabetic',
    difficulty: 'Hard',
    description: 'The first historical cipher to process pairs of letters (digraphs) simultaneously using a dynamic 5x5 grid.',
    howItWorks: 'A 5x5 cipher grid is generated starting with the unique letters of a keyword, filling the rest with standard alphabet letters (combining J into I). Plaintext is parsed into letter pairs; identical adjacent characters are split with an "X". Alignment rules (same row, same column, or bounding rectangle) dictate the output coordinate swaps.',
    history: 'Invented by Charles Wheatstone in 1854, but promoted by Baron Playfair who advocated its strategic benefits. It was officially adopted by the British War Office for quick tactical encoding in the Boer War and World War I.',
    complexity: {
      time: 'O(N) - Evaluates letter pairs',
      space: 'O(1) auxiliary - Static 5x5 lookup grid',
      keySpace: '25! (Over 1.5 × 10^25 possible grid iterations)'
    },
    keyLabel: 'Keyphrase (A-Z characters)',
    keyPlaceholder: 'Enter keyphrase (e.g. MONARCHY)',
    defaultKey: 'MONARCHY',
    keyType: 'text',
    keyValidation: (val) => {
      if (!val || !/^[a-zA-Z\s]+$/.test(val)) return 'Keyphrase must contain only letters and optional spaces';
      return null;
    }
  },
  {
    id: 'monoalphabetic',
    name: 'Monoalphabetic Cipher',
    category: 'substitution',
    difficulty: 'Medium',
    description: 'A classical substitution cipher where each letter in the alphabet maps to a unique letter of a fully randomized/shuffled key alphabet.',
    howItWorks: 'Input text letters are substituted using a static 1:1 map. Providing a 26-letter custom scrambled alphabet replaces A with key[0], B with key[1], C with key[2], etc. Non-alphabetic symbols and casing are preserved.',
    history: 'Directly succeeding Simple Caesar Shifts, monoalphabetic substitution offered vastly larger key spaces (26!). Historically, it reigned secure until Arab mathematician Al-Kindi pioneered frequency analysis in the 9th century, rendering it easily cracked.',
    complexity: {
      time: 'O(N) - Linear text mapping lookup',
      space: 'O(N) - Output dynamic buffer',
      keySpace: '26! (Approximately 4.03 × 10^26 unique substitution variations)'
    },
    keyLabel: 'Scrambled Alphabet (26 unique letters)',
    keyPlaceholder: 'Enter 26 alphabet characters (e.g. QWERTYUIOPASDFGHJKLZXCVBNM)',
    defaultKey: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    keyType: 'text',
    keyValidation: (val) => {
      const clean = val.replace(/[^a-zA-Z]/g, '').toUpperCase();
      if (clean.length !== 26) return 'Alphabet key must be exactly 26 letters long';
      const uniq = new Set(clean);
      if (uniq.size !== 26) return 'Alphabet key must contain 26 UNIQUE letters (no duplicates)';
      return null;
    }
  },
  {
    id: 'hill',
    name: 'Hill Cipher',
    category: 'polyalphabetic',
    difficulty: 'Hard',
    description: 'A linear algebra-based polyalphabetic substitution cipher, encrypting adjacent letters simultaneously in block vectors.',
    howItWorks: 'Plaintext letters are analyzed in pairs (digraphs) as 2D numeric vectors and multiplied modulo 26 by a 2x2 key matrix (defined by a 4-letter keyword e.g. "HELP"). The key must form an invertible matrix modulo 26 (meaning its determinant is coprime to 26). Non-alphabetic spacing is bypassed.',
    history: 'Invented in 1929 by Leicester S. Hill. It was the first classical cipher that could encrypt clusters of letters concurrently (polygraphic), enabling complex linear transformations that effectively flattened frequency peaks.',
    complexity: {
      time: 'O(N) - Linear block matrix multiplication',
      space: 'O(N) - Block outputs',
      keySpace: 'Invertible 2x2 matrices modulo 26 (exactly 157,248 distinct matrices)'
    },
    keyLabel: 'Keyphrase Matrix (4 letters of an invertible 2x2 matrix)',
    keyPlaceholder: 'Enter a 4-letter matrix word (e.g. HELP, DFCB, etc.)',
    defaultKey: 'HELP',
    keyType: 'text',
    keyValidation: (val) => {
      const clean = val.replace(/[^a-zA-Z]/g, '').toUpperCase();
      if (clean.length !== 4) return 'Hill key must be exactly 4 letters representing a 2x2 matrix';
      const a = clean[0].charCodeAt(0) - 65;
      const b = clean[1].charCodeAt(0) - 65;
      const c = clean[2].charCodeAt(0) - 65;
      const d = clean[3].charCodeAt(0) - 65;
      let det = (a * d - b * c) % 26;
      det = (det + 26) % 26;
      const isCoprime = det % 2 !== 0 && det % 13 !== 0;
      if (!isCoprime) return `Key matrix is singular/not invertible modulo 26 (Determinant ${det} lacks GCD=1 with 26). Try another word! ("HELP" is guaranteed invertible)`;
      return null;
    }
  },
  {
    id: 'peripheral',
    name: 'Peripheral Cipher',
    category: 'transposition',
    difficulty: 'Medium',
    description: 'A geometrical transposition cipher that routes plaintext into block matrix grids and reads them along the outer peripheral spiral path.',
    howItWorks: 'Message characters are arranged row-major into a square grid of size N x N (padding end with "X"). The cipher outputs these letters by tracing the outer boundary (periphery) spiraling clockwise inward of each block. Decryption feeds the spiral and reads row-by-row.',
    history: 'Rooted in historical Route Transposition methods used in the American Civil War, routing characters geometrically (such as spiral or peripheral matrices) disrupts letter order while leaving spelling and letter frequencies totally intact.',
    complexity: {
      time: 'O(N) - Geometrical coordinate projection',
      space: 'O(N) - Auxiliary N x N transposing matrix',
      keySpace: 'Grid dimension size N (typically 3 to 6)'
    },
    keyLabel: 'Grid Size (3 to 6)',
    keyPlaceholder: 'Enter dimension size (e.g. 4)',
    defaultKey: '4',
    keyType: 'number',
    keyValidation: (val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 3 || num > 6) return 'Grid dimension size must be between 3 and 6';
      return null;
    }
  }
];

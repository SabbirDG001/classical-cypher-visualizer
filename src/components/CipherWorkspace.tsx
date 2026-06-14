import React from 'react';
import { motion } from 'motion/react';
import { CipherAlgorithm, CipherResult } from '../types';
import { Eye, HelpCircle } from 'lucide-react';

interface WorkspaceProps {
  algorithm: CipherAlgorithm;
  result: CipherResult;
  isEncrypt: boolean;
}

export const PlayfairGridVisual: React.FC<{
  grid: string[][];
  activeIndices: number[];
}> = ({ grid, activeIndices }) => {
  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
      <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200 font-bold mb-3 self-start">5x5 Playfair Key Matrix (J ➔ I)</span>
      <div className="grid grid-cols-5 gap-1.5 bg-gray-200 dark:bg-zinc-950 p-2 rounded-lg max-w-[280px] w-full">
        {grid.flat().map((char, idx) => {
          const isActive = activeIndices.includes(idx);
          return (
            <motion.div
              key={`${char}-${idx}`}
              animate={isActive ? { scale: [1, 1.1, 1], backgroundColor: '#10b981', color: '#ffffff' } : {}}
              transition={{ duration: 0.4 }}
              className={`h-11 w-11 flex items-center justify-center font-mono rounded text-sm font-semibold select-none transition-colors duration-200 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-150 dark:border-zinc-800'
              }`}
            >
              {char}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const RailFenceVisual: React.FC<{
  rails: number;
  text: string;
  gridCells: Array<{ char: string; row: number; col: number }>;
}> = ({ rails, text, gridCells }) => {
  // Build 2D matrix structure
  const cols = text.length;
  const matrix: string[][] = Array.from({ length: rails }, () => Array(cols).fill(''));

  gridCells.forEach(cell => {
    if (cell.col < cols) {
      matrix[cell.row][cell.col] = cell.char;
    }
  });

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-x-auto">
      <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200 font-bold mb-3 block">Rail Fence Zig-Zag Diagonal Wave Path ({rails} Rails)</span>
      
      <div className="min-w-max flex flex-col gap-1.5 py-2">
        {matrix.map((row, rIdx) => (
          <div key={`rail-${rIdx}`} className="flex items-center gap-1">
            <span className="w-12 text-xs font-mono font-medium text-emerald-500 dark:text-emerald-400 shrink-0">
              Rail {rIdx + 1} ➔
            </span>
            <div className="flex gap-1">
              {row.map((char, cIdx) => {
                const isOccupied = char !== '';
                return (
                  <div
                    key={`cell-${rIdx}-${cIdx}`}
                    className={`h-9 w-9 flex items-center justify-center font-mono text-xs rounded transition-all duration-300 ${
                      isOccupied
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30'
                        : 'border border-dashed border-gray-100 dark:border-zinc-800 text-gray-300 dark:text-zinc-700'
                    }`}
                  >
                    {char || '·'}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MonoalphabeticVisual: React.FC<{
  standardAlphabet: string;
  alphabetMap: string;
  isKeyValid: boolean;
  highlightedIdx: number[];
}> = ({ standardAlphabet, alphabetMap, isKeyValid, highlightedIdx }) => {
  const stdArr = standardAlphabet.split('');
  const mapArr = alphabetMap.split('');
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200 font-bold">Monoalphabetic Substitution Alphabet Alignment</span>
        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded leading-none font-bold ${isKeyValid ? 'bg-emerald-500/15 text-[#10b981]' : 'bg-rose-500/15 text-rose-500'}`}>
          {isKeyValid ? 'Valid 1:1 Substitution Key' : 'Identity Key Fallback'}
        </span>
      </div>
      <div className="overflow-x-auto py-2">
        <div className="flex gap-1 min-w-max">
          {stdArr.map((char, idx) => {
            const targetChar = mapArr[idx] || char;
            const isActive = highlightedIdx.includes(idx);
            return (
              <div
                key={`mono-cell-${idx}`}
                className={`flex flex-col items-center justify-center border rounded p-1.5 w-9 font-mono transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-zinc-950 border-gray-150 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <span className={`text-[10px] font-black ${isActive ? 'text-emerald-100' : 'text-zinc-500 dark:text-zinc-350'}`}>
                  {char}
                </span>
                <div className="w-full h-[1px] bg-gray-200 dark:bg-zinc-800 my-1"></div>
                <span className="text-xs font-black">
                  {targetChar}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const HillVisual: React.FC<{
  matrix: number[][];
  matKey: string;
  det: number;
  isKeyInvertible: boolean;
}> = ({ matrix, matKey, det, isKeyInvertible }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="flex flex-col bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-800 dark:text-zinc-200 font-bold">2x2 Key Matrix representation: "{matKey}"</span>
            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded leading-none font-bold ${isKeyInvertible ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
              {isKeyInvertible ? 'Invertible matrix' : 'Fallback (HELP)'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="flex items-center">
              <span className="text-sm font-black font-mono text-zinc-600 dark:text-zinc-300 mr-2">K =</span>
              <div className="relative border-l-2 border-r-2 border-zinc-700 dark:border-zinc-300 px-3 py-1 font-mono text-base font-bold flex flex-col items-center gap-1">
                <div>{matrix[0][0]} &nbsp; {matrix[0][1]}</div>
                <div>{matrix[1][0]} &nbsp; {matrix[1][1]}</div>
              </div>
            </div>
            <div className="text-[11px] font-mono space-y-1 text-zinc-800 dark:text-zinc-200 font-bold">
              <div>det(K) = {det}</div>
              <div>det modulo 26 = {det % 26}</div>
              <div>GCD(det, 26) = {isKeyInvertible ? 1 : 'Not Coprime'}</div>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-zinc-750 dark:text-zinc-200 mt-2 font-mono font-semibold">
          Algebraic block transformation: multiplied by block pairs vector.
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 font-mono text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
        <span className="text-xs font-bold text-gray-100">Hill block equations</span>
        <div className="bg-white dark:bg-zinc-950 p-2.5 rounded-lg border border-gray-150 dark:border-zinc-800 text-[11px] text-zinc-650 dark:text-zinc-300 flex flex-col gap-1.5 leading-relaxed">
          <div><strong>Linear Vector Algebra:</strong></div>
          <div className="bg-gray-50 dark:bg-zinc-900 p-1 rounded italic text-center text-emerald-600 dark:text-emerald-400">
            C₁ = (K₁₁·P₁ + K₁₂·P₂) mod 26 <br />
            C₂ = (K₂₁·P₁ + K₂₂·P₂) mod 26
          </div>
          <div className="mt-1">
            Standard character layout is extracted block-wise, substituted modulo 26, and restored to original casing index positions.
          </div>
        </div>
      </div>
    </div>
  );
};

export const PeripheralVisual: React.FC<{
  n: number;
  grids: string[][][];
  coords: [number, number][];
  highlightedIdx: number;
}> = ({ n, grids, coords, highlightedIdx }) => {
  const grid = grids[0] || Array.from({ length: n }, () => Array(n).fill(''));
  const spiralOrder = Array.from({ length: n }, () => Array(n).fill(0));
  coords.forEach(([r, c], sIdx) => {
    spiralOrder[r][c] = sIdx + 1;
  });

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 mt-4 animate-fade-in">
      <span className="text-xs font-mono text-zinc-805 dark:text-zinc-200 font-bold mb-2">Peripheral Spiral Transposition (Core Matrix detail)</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="bg-white dark:bg-zinc-950 p-3 rounded-lg border border-gray-150 dark:border-zinc-800 flex flex-col items-center justify-center">
          <span className="text-[11px] font-mono text-zinc-805 dark:text-zinc-205 font-black mb-2.5">Grid character placement & Spiral Steps (1 to {n*n})</span>
          <div 
            className="grid gap-2 p-1.5 bg-gray-50 dark:bg-zinc-900 rounded-lg max-w-[280px] w-full"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
          >
            {grid.map((row, rIdx) => 
              row.map((char, cIdx) => {
                const spiralNum = spiralOrder[rIdx][cIdx];
                const isHighlighted = coords.findIndex(([cr, cc]) => cr === rIdx && cc === cIdx) === (highlightedIdx % (n*n));
                return (
                  <motion.div
                    key={`spiral-cell-${rIdx}-${cIdx}`}
                    animate={isHighlighted ? { scale: [1, 1.1, 1], backgroundColor: '#10b981', color: '#ffffff' } : {}}
                    transition={{ duration: 0.4 }}
                    className={`aspect-square flex flex-col items-center justify-center rounded font-mono border relative select-none ${
                      isHighlighted
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow'
                        : 'bg-white dark:bg-zinc-900 text-zinc-850 dark:text-zinc-150 border-gray-200 dark:border-zinc-800 font-bold'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-1 text-[9px] font-black leading-none ${isHighlighted ? 'text-[#ffffff]' : 'text-zinc-600 dark:text-zinc-350'}`}>
                      #{spiralNum}
                    </span>
                    <span className="text-sm font-black mt-2 leading-none">
                      {char === ' ' || char === '' ? '␣' : char}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="font-mono text-xs text-zinc-805 dark:text-zinc-200 flex flex-col justify-between">
          <div className="bg-white dark:bg-zinc-950 p-3 rounded-lg border border-gray-150 dark:border-zinc-800 space-y-2">
            <span className="font-extrabold text-zinc-950 dark:text-zinc-50 text-xs block">Spiral Router Coordinates Sequence</span>
            <p className="text-[11px] leading-relaxed text-zinc-900 dark:text-zinc-150 font-medium">
              Message character layouts are packed row-major into square blocks of size <strong>{n}x{n}</strong>. To encrypt/decrypt, the path reads out starting from coordinate <strong>(0,0)</strong>, spiraling clockwise towards the inner center:
            </p>
            <div className="text-xs bg-gray-50 dark:bg-zinc-900 p-1.5 rounded text-zinc-900 dark:text-zinc-100 font-bold leading-relaxed max-h-[85px] overflow-y-auto whitespace-normal">
              {coords.map(([r, c], sIdx) => `${sIdx + 1}:(${r},${c})`).join(' ➔ ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CipherWorkspace: React.FC<WorkspaceProps> = ({ algorithm, result, isEncrypt }) => {
  const steps = result.steps || [];

  // Limit visual step trace length to protect performance
  const displaySteps = steps.slice(0, 48);
  const truncatedCount = steps.length - 48;

  const renderTraceMatrix = () => {
    if (algorithm.id === 'playfair' && result.meta?.grid) {
      const activeIndices = result.steps[0]?.highlightedIndices || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <PlayfairGridVisual grid={result.meta.grid} activeIndices={activeIndices} />
          
          <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 h-full overflow-y-auto max-h-[300px]">
            <span className="text-xs font-mono text-gray-400 mb-3 block">Digraph Pairs Partition Trace</span>
            <div className="space-y-2">
              {result.meta.pairs?.map((pair: [string, string], pIdx: number) => {
                const resPair = result.meta.cipherPairs?.[pIdx];
                const rule = result.meta.rulesApplied?.[pIdx];
                return (
                  <div key={`pair-${pIdx}`} className="flex items-center justify-between text-xs font-mono p-2 bg-white dark:bg-zinc-900 rounded border border-gray-150 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 font-bold text-gray-700 dark:text-gray-300">
                        {pair[0]}{pair[1]}
                      </span>
                      <span className="text-gray-450 dark:text-zinc-500">➔</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        {resPair ? resPair[0] + resPair[1] : '??'}
                      </span>
                    </div>
                    <span className="text-zinc-500 dark:text-zinc-400 text-right text-[10px] italic">{rule}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (algorithm.id === 'railfence' && result.meta?.gridCells) {
      return (
        <div className="mt-4">
          <RailFenceVisual
            rails={result.meta.rails || 3}
            text={steps.map(s => s.original).join('')}
            gridCells={result.meta.gridCells}
          />
        </div>
      );
    }

    if (algorithm.id === 'monoalphabetic' && result.meta?.standardAlphabet) {
      const activeIdxs = steps[0]?.highlightedIndices || [];
      return (
        <MonoalphabeticVisual
          standardAlphabet={result.meta.standardAlphabet}
          alphabetMap={result.meta.alphabetMap}
          isKeyValid={result.meta.isKeyValid}
          highlightedIdx={activeIdxs}
        />
      );
    }

    if (algorithm.id === 'hill' && result.meta?.matrix) {
      return (
        <HillVisual
          matrix={result.meta.matrix}
          matKey={result.meta.matKey}
          det={result.meta.det}
          isKeyInvertible={result.meta.isKeyInvertible}
        />
      );
    }

    if (algorithm.id === 'peripheral' && result.meta?.grids) {
      return (
        <PeripheralVisual
          n={result.meta.n}
          grids={result.meta.grids}
          coords={result.meta.coords}
          highlightedIdx={0}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Title & Badge */}
      <div className="flex items-center gap-1.5">
        <Eye className="w-4 h-4 text-emerald-500" />
        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Trace Guide & Cryptographic Trace
        </h4>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-zinc-500">
          Live Tracking
        </span>
      </div>

      {renderTraceMatrix()}

      {/* Main trace steps list */}
      <div className="border border-gray-150 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        <div className="grid grid-cols-12 bg-gray-50 dark:bg-zinc-900/70 py-2.5 px-4 border-b border-gray-150 dark:border-zinc-800 text-xs font-mono text-zinc-805 dark:text-zinc-200 font-black">
          <div className="col-span-2">Pos</div>
          <div className="col-span-3">Input Char</div>
          <div className="col-span-4">Execution Step</div>
          <div className="col-span-3 text-right">Result</div>
        </div>

        <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-900 text-xs font-mono">
          {displaySteps.length === 0 ? (
            <div className="py-8 text-center text-zinc-600 dark:text-zinc-350 italic font-bold">
              Input text above to trace step trace details.
            </div>
          ) : (
            displaySteps.map((step, sIdx) => (
              <div 
                key={`step-${step.index}-${sIdx}`}
                className="grid grid-cols-12 py-2 px-4 hover:bg-gray-50/55 dark:hover:bg-zinc-900/30 text-zinc-905 dark:text-zinc-150 font-bold"
              >
                <div className="col-span-2 text-zinc-600 dark:text-zinc-450">{step.index + 1}</div>
                <div className="col-span-3 flex items-center gap-1 font-semibold text-zinc-950 dark:text-zinc-50">
                  <span className="inline-block px-1 bg-gray-100 dark:bg-zinc-800 text-zinc-950 dark:text-white rounded">
                    {step.original === ' ' ? '␣' : step.original}
                  </span>
                </div>
                <div className="col-span-4 text-xs text-zinc-750 dark:text-zinc-250 flex items-center font-semibold">
                  {step.calculation}
                </div>
                <div className="col-span-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                  {step.result === ' ' ? '␣' : step.result}
                </div>
              </div>
            ))
          )}

          {truncatedCount > 0 && (
            <div className="py-2.5 px-4 text-center bg-gray-50/50 dark:bg-zinc-900/20 text-xs text-zinc-600 dark:text-zinc-350 italic font-bold">
              And {truncatedCount} more characters processed. Show limited to prevent lag.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/40 p-3 flex gap-2 border border-dotted border-zinc-200 dark:border-zinc-800">
        <HelpCircle className="w-4 h-4 text-zinc-550 dark:text-zinc-300 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-805 dark:text-zinc-200 leading-relaxed font-semibold">
          <strong className="text-zinc-950 dark:text-zinc-50">How to analyze:</strong> The trace trace guide displays characters raw input, their indexed representation ($0$ to $25$), and custom algebraic functions modulo $26$. This models classical cryptographic workflows.
        </div>
      </div>
    </div>
  );
};

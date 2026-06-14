import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Sun, 
  Moon, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Activity, 
  Terminal, 
  BookOpen, 
  HelpCircle, 
  Compass, 
  Menu, 
  X, 
  ChevronRight,
  Info,
  RefreshCw,
  Cpu,
  ArrowRightLeft
} from 'lucide-react';
import { CIPHERS_DATA } from './data';
import { CipherAlgorithm, CipherResult, TestResult } from './types';
import { 
  caesarEncrypt, caesarDecrypt,
  vigenereEncrypt, vigenereDecrypt,
  rot13Encrypt, rot13Decrypt,
  atbashEncrypt, atbashDecrypt,
  railFenceEncrypt, railFenceDecrypt,
  playfairEncrypt, playfairDecrypt,
  monoalphabeticEncrypt, monoalphabeticDecrypt,
  hillEncrypt, hillDecrypt,
  peripheralEncrypt, peripheralDecrypt
} from './utils/ciphers';
import { CipherWorkspace } from './components/CipherWorkspace';
import { runCipherTests } from './utils/cipherTests';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const cached = localStorage.getItem('classical-cipher-theme');
    if (cached) return cached === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active navigation section
  const [activeTab, setActiveTab] = useState<string>('hero');

  // Sidebar / Mobile Navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selected Cipher in Playground
  const [selectedCipherId, setSelectedCipherId] = useState<string>('caesar');

  // Input state
  const [inputText, setInputText] = useState<string>('HELLO WORLD WORLD');
  const [isEncrypt, setIsEncrypt] = useState<boolean>(true);
  const [cipherKey, setCipherKey] = useState<string>('3');

  // Visual success feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Live Unit Test results state
  const [testSuiteResults, setTestSuiteResults] = useState<TestResult[]>([]);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [testsProgress, setTestsProgress] = useState<number>(0);

  // Dark mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('classical-cipher-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('classical-cipher-theme', 'light');
    }
  }, [darkMode]);

  // Current cipher config
  const selectedCipher = useMemo(() => {
    return CIPHERS_DATA.find(c => c.id === selectedCipherId) || CIPHERS_DATA[0];
  }, [selectedCipherId]);

  // Reset parameters when cipher switches
  useEffect(() => {
    if (selectedCipher) {
      setCipherKey(selectedCipher.defaultKey);
    }
  }, [selectedCipher]);

  // Calculate encryption / decryption outputs
  const cipherResult = useMemo<CipherResult>(() => {
    if (!selectedCipher || !inputText) {
      return { outputText: '', steps: [] };
    }

    try {
      if (selectedCipher.id === 'caesar') {
        const shiftNum = parseInt(cipherKey, 10);
        if (isNaN(shiftNum)) return { outputText: '', steps: [] };
        return isEncrypt ? caesarEncrypt(inputText, shiftNum) : caesarDecrypt(inputText, shiftNum);
      }
      
      if (selectedCipher.id === 'vigenere') {
        if (!cipherKey) return { outputText: '', steps: [] };
        return isEncrypt ? vigenereEncrypt(inputText, cipherKey) : vigenereDecrypt(inputText, cipherKey);
      }

      if (selectedCipher.id === 'rot13') {
        return isEncrypt ? rot13Encrypt(inputText) : rot13Decrypt(inputText);
      }

      if (selectedCipher.id === 'atbash') {
        return isEncrypt ? atbashEncrypt(inputText) : atbashDecrypt(inputText);
      }

      if (selectedCipher.id === 'railfence') {
        const rails = parseInt(cipherKey, 10);
        if (isNaN(rails)) return { outputText: '', steps: [] };
        return isEncrypt ? railFenceEncrypt(inputText, rails) : railFenceDecrypt(inputText, rails);
      }

      if (selectedCipher.id === 'playfair') {
        if (!cipherKey) return { outputText: '', steps: [] };
        return isEncrypt ? playfairEncrypt(inputText, cipherKey) : playfairDecrypt(inputText, cipherKey);
      }

      if (selectedCipher.id === 'monoalphabetic') {
        if (!cipherKey) return { outputText: '', steps: [] };
        return isEncrypt ? monoalphabeticEncrypt(inputText, cipherKey) : monoalphabeticDecrypt(inputText, cipherKey);
      }

      if (selectedCipher.id === 'hill') {
        if (!cipherKey) return { outputText: '', steps: [] };
        return isEncrypt ? hillEncrypt(inputText, cipherKey) : hillDecrypt(inputText, cipherKey);
      }

      if (selectedCipher.id === 'peripheral') {
        if (!cipherKey) return { outputText: '', steps: [] };
        return isEncrypt ? peripheralEncrypt(inputText, cipherKey) : peripheralDecrypt(inputText, cipherKey);
      }
    } catch (e) {
      console.error(e);
    }

    return { outputText: 'Config error, please verify inputs', steps: [] };
  }, [selectedCipher, inputText, isEncrypt, cipherKey]);

  // Handle Search filtering
  const filteredCiphers = useMemo(() => {
    return CIPHERS_DATA.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Trigger text copying
  const handleCopy = () => {
    if (!cipherResult.outputText) return;
    navigator.clipboard.writeText(cipherResult.outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger download file export
  const handleExportFile = () => {
    if (!cipherResult.outputText) return;
    const element = document.createElement('a');
    const file = new Blob([cipherResult.outputText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    const actionName = isEncrypt ? 'encrypted' : 'decrypted';
    element.download = `${selectedCipher.id}-${actionName}-text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Trigger live programmatic unit test execution
  const handleRunTests = () => {
    setTestingStatus('running');
    setTestSuiteResults([]);
    setTestsProgress(0);

    // Simulate real-time progress tracing sequentially
    const results = runCipherTests();
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setTestsProgress(Math.floor((currentStep / results.length) * 100));
      
      if (currentStep >= results.length) {
        clearInterval(interval);
        setTestSuiteResults(results);
        setTestingStatus('completed');
      }
    }, 120);
  };

  // Pre-load tests once on mount
  useEffect(() => {
    setTestSuiteResults(runCipherTests());
  }, []);

  const totalPassingTests = testSuiteResults.filter(r => r.passed).length;
  const testSuitePassedClass = totalPassingTests === testSuiteResults.length 
    ? 'text-emerald-500' 
    : 'text-amber-500';

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0c0e] font-sans transition-colors duration-300 selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100">
      
      {/* Background grids decoration */}
      <div className="absolute inset-0 dot-grid text-zinc-300 dark:text-zinc-850 pointer-events-none opacity-40 dark:opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* HEADER SECTION FOR RESPONSIVE BEHAVIOR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c0c0ea0] backdrop-blur-md border-b-3 border-zinc-950 dark:border-zinc-800 px-4 py-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-2 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]">
            <Shield className="w-5 h-5" id="header-shield" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#10b981] font-mono font-black block leading-none mb-1">Security Portal</span>
            <h1 className="text-base md:text-lg font-black font-display tracking-tight text-zinc-950 dark:text-white uppercase leading-none">
              Classical Cipher Lab
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick theme toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 border-2 border-zinc-950 dark:border-zinc-800 text-zinc-950 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] transition-all active:translate-x-0.5 active:translate-y-0.5"
            title="Toggle theme mode"
            id="theme-toggler"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Hamburger Menu on Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border-2 border-zinc-950 dark:border-zinc-800 text-zinc-950 dark:text-zinc-200 bg-white dark:bg-zinc-950"
            id="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 z-30 bg-white dark:bg-[#0c0c0e] border-b-3 border-zinc-950 dark:border-zinc-800 py-5 px-6 flex flex-col gap-3 shadow-2xl"
          >
            <div className="text-xs font-black text-zinc-600 dark:text-zinc-350 uppercase tracking-widest mb-1 font-mono">
              Navigation Portal
            </div>
            <button
              onClick={() => { setActiveTab('hero'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 py-2.5 px-4 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                activeTab === 'hero' 
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]' 
                  : 'text-zinc-800 dark:text-zinc-300 border-transparent bg-stone-100 dark:bg-zinc-900'
              }`}
            >
              <Compass className="w-4 h-4" /> <span>Home Overview</span>
            </button>
            <button
              onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 py-2.5 px-4 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                activeTab === 'about' 
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]' 
                  : 'text-zinc-800 dark:text-zinc-300 border-transparent bg-stone-100 dark:bg-zinc-900'
              }`}
            >
              <BookOpen className="w-4 h-4" /> <span>What is a Cipher?</span>
            </button>
            <button
              onClick={() => { setActiveTab('playground'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 py-2.5 px-4 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                activeTab === 'playground' 
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]' 
                  : 'text-zinc-800 dark:text-zinc-300 border-transparent bg-stone-100 dark:bg-zinc-900'
              }`}
            >
              <Terminal className="w-4 h-4" /> <span>Interactive Playground</span>
            </button>
            <button
              onClick={() => { setActiveTab('tests'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 py-2.5 px-4 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                activeTab === 'tests' 
                  ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]' 
                  : 'text-zinc-800 dark:text-zinc-300 border-transparent bg-stone-100 dark:bg-zinc-900'
              }`}
            >
              <Activity className="w-4 h-4" /> <span>Test Suite Runner</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1360px] mx-auto px-4 py-8 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:block md:col-span-3 sticky top-28 space-y-6">
          <div className="bg-white dark:bg-zinc-950 p-5 rounded-none border-2 border-zinc-950 dark:border-zinc-850 shadow-[5px_5px_0px_0px_rgba(9,9,11,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.06)] space-y-4">
            <h3 className="text-xs font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest pl-1">
              Main Sections
            </h3>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('hero')}
                className={`w-full flex items-center justify-between py-2.5 px-3 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                  activeTab === 'hero'
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white translate-x-0.5'
                    : 'text-zinc-800 dark:text-zinc-200 font-bold border-transparent hover:bg-stone-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Introduction Hub</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-80 ${activeTab === 'hero' ? 'translate-x-0.5' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center justify-between py-2.5 px-3 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                  activeTab === 'about'
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white translate-x-0.5'
                    : 'text-zinc-800 dark:text-zinc-200 font-bold border-transparent hover:bg-stone-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>What is a Cipher?</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-80 ${activeTab === 'about' ? 'translate-x-0.5' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => setActiveTab('playground')}
                className={`w-full flex items-center justify-between py-2.5 px-3 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                  activeTab === 'playground'
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white translate-x-0.5'
                    : 'text-zinc-800 dark:text-zinc-200 font-bold border-transparent hover:bg-stone-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 shrink-0" />
                  <span>Playground Sandbox</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-80 ${activeTab === 'playground' ? 'translate-x-0.5' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => setActiveTab('tests')}
                className={`w-full flex items-center justify-between py-2.5 px-3 border-2 transition-all text-xs font-black uppercase tracking-wider ${
                  activeTab === 'tests'
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white translate-x-0.5'
                    : 'text-zinc-800 dark:text-zinc-200 font-bold border-transparent hover:bg-stone-100 dark:hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Verifications</span>
                </div>
                <span className="text-[10px] font-mono font-black bg-[#10b981]/15 text-[#10b981] dark:text-[#10b981] px-1.5 py-0.5 rounded border border-[#10b981]/25">
                  {totalPassingTests}/9
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Stats sidebar widget */}
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-850 p-5 rounded-none shadow-[5px_5px_0px_0px_rgba(16,185,129,0.2)] dark:shadow-[5px_5px_0px_0px_rgba(16,185,129,0.06)] space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-300">
              <Cpu className="w-4 h-4 text-emerald-500 font-bold shrink-0" />
              <span className="font-display font-black text-xs uppercase tracking-wider">Cryptographic Matrix</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-stone-50 dark:bg-zinc-900/60 p-2 border-l-3 border-zinc-950 dark:border-zinc-700">
                <span className="block text-xs font-mono font-bold tracking-wider text-zinc-700 dark:text-zinc-250 uppercase">Integrated</span>
                <span className="font-display font-black text-zinc-900 dark:text-zinc-100">6 Engines</span>
              </div>
              <div className="bg-stone-50 dark:bg-zinc-900/60 p-2 border-l-3 border-emerald-500">
                <span className="block text-xs font-mono font-bold tracking-wider text-zinc-700 dark:text-zinc-250 uppercase">Unit Tests</span>
                <span className={`font-display font-black ${testSuitePassedClass}`}>{totalPassingTests} Passed</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY SECTION */}
        <main className="col-span-1 md:col-span-9 space-y-8">
          
          <AnimatePresence mode="wait">
            
            {/* HERO & HUB (HOME OVERVIEW) */}
            {activeTab === 'hero' && (
              <motion.section
                key="hero-section"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Visual hero card */}
                <div className="relative overflow-hidden bg-zinc-950 dark:bg-black text-white p-8 md:p-12 border-3 border-zinc-950 dark:border-zinc-800 shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(16,185,129,1)]">
                  {/* Neon light glows */}
                  <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 max-w-xl space-y-6">
                    <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-widest bg-emerald-500/20 text-[#10b981] uppercase font-black border-2 border-emerald-500">
                      Educational Sandbox
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-none uppercase">
                      Foundations of <br />
                      <span className="text-[#10b981]">Historical Cryptography</span>
                    </h2>
                    <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-medium">
                      Before computer chips or fiber internet, secrets were protected using manual, mathematical systems of transposition and substitution. Inspect, rotate, and trace how classical algorithms functioned letter-by-letter.
                    </p>

                    <div className="pt-4 flex flex-wrap gap-4">
                      <button
                        onClick={() => setActiveTab('playground')}
                        className="px-5 py-3 bg-[#10b981] text-zinc-950 font-black text-xs uppercase tracking-wider border-2 border-zinc-950 shadow-[3px_3px_0px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#ffffff] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
                      >
                        Enter Playground
                      </button>
                      <button
                        onClick={() => setActiveTab('about')}
                        className="px-5 py-3 bg-zinc-900 border-2 border-zinc-700 hover:border-white text-zinc-100 font-extrabold text-xs uppercase tracking-wider transition-all"
                      >
                        Read Documentation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Introductory guide cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-zinc-950 p-6 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.06)] space-y-3">
                    <div className="w-10 h-10 border-2 border-zinc-950 dark:border-[#10b981] bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] flex items-center justify-center font-bold">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100">Substitution Ciphers</h4>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-semibold">
                      Replaces characters with corresponding targets (e.g. Caesar, Vigenère, Atbash, ROT13).
                    </p>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 p-6 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.06)] space-y-3">
                    <div className="w-10 h-10 border-2 border-zinc-950 dark:border-[#10b981] bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] flex items-center justify-center font-bold">
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100">Transposition Ciphers</h4>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-semibold">
                      Rearranges the coordinates and spots of letter positions without swapping (e.g. Rail Fence).
                    </p>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 p-6 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.06)] space-y-3">
                    <div className="w-10 h-10 border-2 border-zinc-950 dark:border-[#10b981] bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] flex items-center justify-center font-bold">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100">Interactive Traces</h4>
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-semibold">
                      Visualize the Playfair 5x5 key square and zigzag rails with interactive trace diagrams.
                    </p>
                  </div>
                </div>
              </motion.section>
            )}

            {/* WHAT IS A CIPHER? (DETAILED DOCUMENTATION) */}
            {activeTab === 'about' && (
              <motion.section
                key="about-section"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-zinc-950 p-6 md:p-8 border-2 border-zinc-950 dark:border-zinc-800 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.06)] space-y-6">
                  <div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] border border-emerald-500/20 px-2 py-1 rounded font-mono font-black uppercase tracking-wider">
                      Documentation Section 1.0
                    </span>
                    <h3 className="text-2xl font-black font-display text-zinc-950 dark:text-white uppercase tracking-tight mt-3">
                      What is a Cipher / Cypher?
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                    A <strong>cipher</strong> (or <em>cypher</em>) is a mathematical algorithm used to compute encryption and decryption. Unlike simple codes that replace words with random symbols, ciphers operate at the component level of single letters, bits, or pairs. These systems define structured rules which are combined with helper keys, transforming plain text into unrecognizable <strong>ciphertext</strong>.
                  </p>

                  <div className="p-4 bg-stone-50 dark:bg-zinc-900 border-l-4 border-zinc-950 dark:border-white font-mono space-y-1">
                    <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 uppercase block tracking-wider">Basic Pipeline</span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-850 dark:text-zinc-200 font-bold">
                      <span className="text-zinc-950 dark:text-white font-extrabold">Plaintext Input</span>
                      <span className="font-black text-zinc-900 dark:text-zinc-200">➔</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/25">Cipher Tool & Key</span>
                      <span className="font-black text-zinc-900 dark:text-zinc-200">➔</span>
                      <span className="text-zinc-950 dark:text-white font-extrabold">Ciphertext Result</span>
                    </div>
                  </div>

                  <hr className="border-t-2 border-dashed border-zinc-200 dark:border-zinc-800" />

                  <div className="space-y-2">
                    <h4 className="text-sm md:text-base font-black text-zinc-950 dark:text-zinc-105 uppercase tracking-wider">
                      Why do I need Cyphers?
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                      Ciphers are the bedrock of human privacy. Historically, military leaders used ciphers to convey plans through enemy territories where couriers might be intercepted. Without ciphers, sensitive tactical positions and personal identities would lie vulnerable. Today, symmetric and asymmetric ciphers underpin commercial bank card processing, online bank logins, email servers, and secure cellular communication.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm md:text-base font-black text-zinc-950 dark:text-zinc-105 uppercase tracking-wider">
                      How do I use a Cipher?
                    </h4>
                    <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                      To utilize classic ciphers, you require two components: a <strong>Secret Key</strong>, and the <strong>Message Input</strong>. 
                      By tuning the key (e.g. shift counts, secret keywords), you determine the unique rotational offset of the output. The recipient must possess the identical algorithm and key to correctly decode the layout back to its human-readable origin.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('playground')}
                      className="px-5 py-3 bg-[#10b981] hover:bg-emerald-500 text-zinc-950 border-2 border-zinc-950 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-xs uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Launch Interactive Sandbox</span>
                      <ChevronRight className="w-4 h-4 shrink-0 font-black" />
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* INTERACTIVE PLAYGROUND (POPULAR CIPHERS) */}
            {activeTab === 'playground' && (
              <motion.section
                key="playground-section"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                            {/* Search & Category Filter Header */}
                <div className="bg-white dark:bg-zinc-950 p-5 border-2 border-zinc-950 dark:border-zinc-850 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.06)] flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search classical algorithms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-850 focus:bg-white dark:focus:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
                    {['all', 'substitution', 'transposition', 'polyalphabetic'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-2 border-2 text-xs font-mono uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]'
                            : 'text-zinc-600 dark:text-zinc-400 border-zinc-950 dark:border-zinc-850 hover:bg-stone-50 dark:hover:bg-zinc-900 font-bold bg-white dark:bg-zinc-950'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick select tiles deck */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filteredCiphers.map((c) => {
                    const isSelected = c.id === selectedCipherId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCipherId(c.id)}
                        className={`relative p-4 text-left border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/10 border-[#10b981] translate-y-[-1px] shadow-[3px_3px_0px_0px_rgba(16,185,129,1)]'
                            : 'bg-white dark:bg-zinc-950 border-zinc-950 dark:border-zinc-850 hover:border-[#10b981] shadow-[3px_3px_0px_0px_rgba(9,9,11,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.04)] hover:translate-y-[-1px]'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                        )}
                        <span className="text-[9px] uppercase font-mono tracking-widest font-black text-emerald-600 dark:text-emerald-450 block mb-1">
                          {c.category}
                        </span>
                        <span className="text-xs font-black font-display text-zinc-950 dark:text-zinc-100 uppercase tracking-tight limit-1-line">
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                  {filteredCiphers.length === 0 && (
                    <div className="col-span-full py-6 text-center text-xs text-gray-500 dark:text-zinc-500 italic">
                      No ciphers match search parameters.
                    </div>
                  )}
                </div>

                {/* Selected Cipher Detail Sheet */}
                {selectedCipher && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Educational & Params */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Technical Info Profile Card */}
                      <div className="bg-white dark:bg-zinc-950 p-6 border-2 border-zinc-950 dark:border-zinc-850 shadow-[5px_5px_0px_0px_rgba(9,9,11,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.06)] space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-mono font-black uppercase px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mr-2">
                              {selectedCipher.category}
                            </span>
                            <span className="text-[9px] font-mono font-black uppercase px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {selectedCipher.difficulty}
                            </span>
                            <h3 className="text-xl font-black font-display text-zinc-950 dark:text-white uppercase tracking-tight mt-3">
                              {selectedCipher.name}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                          {selectedCipher.description}
                        </p>

                        <div className="pt-3 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-250 font-semibold space-y-2">
                          <div className="flex justify-between">
                            <strong className="text-zinc-950 dark:text-zinc-50 uppercase font-black text-xs">Complexity:</strong> <span>{selectedCipher.complexity.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-zinc-950 dark:text-zinc-50 uppercase font-black text-xs">Space cost:</strong> <span>{selectedCipher.complexity.space}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="text-zinc-950 dark:text-zinc-50 uppercase font-black text-xs">Key Space:</strong> <span>{selectedCipher.complexity.keySpace}</span>
                          </div>
                        </div>
                      </div>

                      {/* Playground Workspace Inputs */}
                      <div className="bg-white dark:bg-zinc-950 p-6 border-2 border-zinc-950 dark:border-zinc-850 shadow-[5px_5px_0px_0px_rgba(9,9,11,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.06)] space-y-5">
                        
                        {/* Segment control: Encrypt / Decrypt */}
                        <div className="flex bg-stone-100 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-1">
                          <button
                            onClick={() => setIsEncrypt(true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                              isEncrypt 
                                ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm border border-zinc-950 dark:border-white' 
                                : 'text-zinc-550 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Encrypt</span>
                          </button>
                          <button
                            onClick={() => setIsEncrypt(false)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
                              !isEncrypt 
                                ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm border border-zinc-950 dark:border-white' 
                                : 'text-zinc-550 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Decrypt</span>
                          </button>
                        </div>

                        {/* Input Text Area */}
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-50 flex justify-between">
                            <span>Text to Process</span>
                            <span className="text-xs text-zinc-700 dark:text-zinc-200 font-bold font-mono">
                              {inputText.length} Chars • {inputText.split(/\s+/).filter(Boolean).length} Words
                            </span>
                          </label>
                          <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter plaintext message here..."
                            rows={3}
                            className="w-full px-4 py-2.5 text-sm font-semibold bg-stone-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#10b981] text-zinc-950 dark:text-zinc-50 placeholder-zinc-500 dark:placeholder-zinc-400"
                          />
                        </div>

                        {/* Dynamic Key Input Fields depending on Cipher type */}
                        {selectedCipher.keyType !== 'none' && (
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-300">
                              {selectedCipher.keyLabel}
                            </label>

                            {selectedCipher.id === 'caesar' && (
                              <div className="space-y-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="25"
                                  value={cipherKey}
                                  onChange={(e) => setCipherKey(e.target.value)}
                                  className="w-full accent-[#10b981] cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-850 rounded"
                                />
                                <div className="flex justify-between text-[11px] text-zinc-650 dark:text-zinc-450 font-mono">
                                  <span>Shift Index:</span>
                                  <span className="font-extrabold text-[#10b981]">{cipherKey}</span>
                                </div>
                              </div>
                            )}

                            {selectedCipher.id === 'railfence' && (
                              <div className="space-y-1">
                                <input
                                  type="range"
                                  min="2"
                                  max="10"
                                  value={cipherKey}
                                  onChange={(e) => setCipherKey(e.target.value)}
                                  className="w-full accent-[#10b981] cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-850 rounded"
                                />
                                <div className="flex justify-between text-[11px] text-zinc-650 dark:text-zinc-450 font-mono">
                                  <span>Rails Count:</span>
                                  <span className="font-extrabold text-[#10b981]">{cipherKey} Rails</span>
                                </div>
                              </div>
                            )}

                            {(selectedCipher.id === 'vigenere' || selectedCipher.id === 'playfair') && (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={cipherKey}
                                  onChange={(e) => setCipherKey(e.target.value.toUpperCase().replace(/[^a-zA-Z]/g, ''))}
                                  placeholder={selectedCipher.keyPlaceholder}
                                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-stone-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#10b981] text-zinc-800 dark:text-zinc-100 placeholder-zinc-500"
                                />
                                {selectedCipher.keyValidation && selectedCipher.keyValidation(cipherKey) && (
                                  <span className="text-[10px] text-rose-500 font-bold block mt-1">
                                    {selectedCipher.keyValidation(cipherKey)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Selected Cipher Historical Backstory */}
                        <div className="bg-stone-50 dark:bg-zinc-900 border-l-4 border-[#10b981] p-4 flex gap-3 border border-zinc-950 dark:border-zinc-800">
                          <Info className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                          <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">
                            <strong className="text-zinc-900 dark:text-zinc-200 uppercase tracking-wide">Historical Legacy: </strong>{selectedCipher.history}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* RIGHT COLUMN: Outputs and Interactive Visual Trace */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Ciphertext Output Area */}
                      <div className="bg-white dark:bg-zinc-950 p-6 border-2 border-zinc-950 dark:border-zinc-850 shadow-[5px_5px_0px_0px_rgba(9,9,11,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.06)] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-200">
                            Result Output
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={handleCopy}
                              disabled={!cipherResult.outputText}
                              className="px-3 py-1.5 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all active:translate-y-[1px]"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>

                            <button
                              onClick={handleExportFile}
                              disabled={!cipherResult.outputText}
                              className="px-3 py-1.5 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all active:translate-y-[1px]"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Export</span>
                            </button>
                          </div>
                        </div>

                        <div className="px-4 py-3.5 border-2 border-zinc-950 dark:border-zinc-800 bg-zinc-950 dark:bg-black font-mono text-sm font-bold text-[#10b981] break-all select-all h-28 overflow-y-auto tracking-wide">
                          {cipherResult.outputText || (
                            <span className="text-zinc-450 dark:text-zinc-300 italic font-semibold">
                              Input is currently blank or has invalid keys.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interactive Workspace with Tracing */}
                      <div className="bg-white dark:bg-zinc-950 p-6 border-2 border-zinc-950 dark:border-zinc-850 shadow-[5px_5px_0px_0px_rgba(9,9,11,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.06)]">
                        <CipherWorkspace 
                          algorithm={selectedCipher} 
                          result={cipherResult} 
                          isEncrypt={isEncrypt} 
                        />
                      </div>

                    </div>
                  </div>
                )}
              </motion.section>
            )}
                     {/* DYNAMIC TEST SUITE RUNNER (UNIT TESTS PREVIEW) */}
            {activeTab === 'tests' && (
              <motion.section
                key="tests-section"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-zinc-950 p-6 md:p-8 border-2 border-zinc-950 dark:border-zinc-850 shadow-[6px_6px_0px_0px_rgba(9,9,11,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.06)] space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-black font-display text-zinc-950 dark:text-white uppercase tracking-tight">
                        Cryptographic Verification Suite
                      </h3>
                      <p className="text-xs text-zinc-650 dark:text-zinc-400 mt-1.5 leading-relaxed font-semibold">
                        To fulfill exact rigorous validation, this suite runs comprehensive automated unit tests targeting historical test vectors. Green highlights denote perfect compliance.
                      </p>
                    </div>

                    <button
                      onClick={handleRunTests}
                      disabled={testingStatus === 'running'}
                      className="px-5 py-3 bg-[#10b981] hover:bg-emerald-500 text-zinc-950 border-2 border-zinc-950 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-xs uppercase tracking-widest cursor-pointer shrink-0 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 shrink-0 font-black ${testingStatus === 'running' ? 'animate-spin' : ''}`} />
                      <span>{testingStatus === 'running' ? 'Scanning Engines...' : 'Run Unit Tests'}</span>
                    </button>
                  </div>

                  {/* Progress bar */}
                  {testingStatus === 'running' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono font-black uppercase text-zinc-405 tracking-wider">
                        <span>Revalidating byte buffers...</span>
                        <span>{testsProgress}%</span>
                      </div>
                      <div className="h-2 bg-stone-100 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#10b981]" 
                          animate={{ width: `${testsProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Test Summary Dashboard */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                    <div className="p-4 bg-stone-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-850 shadow-sm text-center">
                      <span className="text-[9px] font-mono font-black text-zinc-400 uppercase block tracking-wider">Total Assertions</span>
                      <strong className="text-2xl font-display font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">
                        {testSuiteResults.length} Tests
                      </strong>
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-850 shadow-sm text-center">
                      <span className="text-[9px] font-mono font-black text-zinc-400 uppercase block tracking-wider">Success Rate</span>
                      <strong className="text-2xl font-display font-black text-[#10b981]">
                        {testSuiteResults.length > 0 
                          ? `${Math.round((totalPassingTests / testSuiteResults.length) * 100)}%` 
                          : '0%'}
                      </strong>
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-850 shadow-sm text-center">
                      <span className="text-[9px] font-mono font-black text-zinc-400 uppercase block tracking-wider">Environment State</span>
                      <strong className="text-base font-display font-black text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 uppercase tracking-tight pt-1">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                        Online & Verified
                      </strong>
                    </div>
                  </div>

                  {/* Test cases listed */}
                  <div className="space-y-4">
                    {testSuiteResults.map((result) => (
                      <div 
                        key={result.testCase.id}
                        className={`p-4 border-2 flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all ${
                          result.passed 
                            ? 'bg-emerald-500/[0.02] border-[#10b981] shadow-[3px_3px_0px_0px_rgba(16,185,129,0.15)]' 
                            : 'bg-rose-500/[0.02] border-rose-500 shadow-[3px_3px_0px_0px_rgba(244,63,94,0.15)]'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-none rotate-45 ${result.passed ? 'bg-[#10b981]' : 'bg-rose-500'}`} />
                            <h4 className="text-xs font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-wide">
                              {result.testCase.name}
                            </h4>
                          </div>
                          
                          <p className="text-xs text-zinc-800 dark:text-zinc-200 max-w-xl font-mono leading-relaxed font-semibold">
                            Input: <span className="bg-stone-100 dark:bg-zinc-850 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded font-bold text-zinc-900 dark:text-zinc-50">"{result.testCase.input}"</span> ➔ Expects: <span className="text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded font-black">"{result.testCase.expectedEncrypt}"</span>
                          </p>

                          {result.errorMessage && (
                            <p className="text-[10px] font-black text-rose-500 font-mono italic">
                              Error Detail: {result.errorMessage}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 shrink-0 self-end md:self-auto">
                          <div>
                            <span className="text-[9px] text-zinc-400 block text-right font-black uppercase">ENCRYPT</span>
                            <span className="text-zinc-805 dark:text-zinc-200 font-bold">{result.encryptDurationMs} ms</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 block text-right font-black uppercase">DECRYPT</span>
                            <span className="text-zinc-805 dark:text-zinc-200 font-bold">{result.decryptDurationMs} ms</span>
                          </div>
                          <div className={`px-2.5 py-1 border text-[10px] font-black tracking-wider uppercase ${
                            result.passed ? 'bg-emerald-500/10 border-[#10b981] text-emerald-600 dark:text-emerald-450' : 'bg-rose-500/10 border-rose-500 text-rose-600'
                          }`}>
                            {result.passed ? 'PASSED' : 'FAILED'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.section>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 py-12 px-6 border-t-3 border-zinc-950 dark:border-zinc-800 bg-zinc-950 dark:bg-black text-center text-xs text-zinc-400">
        <p className="font-mono tracking-wider font-extrabold uppercase text-white">
          Classical Cipher Visualizer Sandbox • Single-Page Educational Suite
        </p>
        <p className="text-[11px] text-zinc-550 mt-1.5 font-medium">
          Styled with High-Contrast Bold Typography, custom gothic displays, and JetBrains Mono fonts.
        </p>
      </footer>
    </div>
  );
}

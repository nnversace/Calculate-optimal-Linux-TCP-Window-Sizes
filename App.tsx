import React, { useState, useMemo } from 'react';
import { calculateTcpParams, formatBytes } from './utils/calculations';
import SysctlOutput from './components/SysctlOutput';
import InputSlider from './components/InputSlider';
import { NetworkInput } from './types';
import { Server, Info, Zap, Clock, Save, ChevronDown, ChevronUp } from 'lucide-react';

const App: React.FC = () => {
  const [bandwidth, setBandwidth] = useState<number>(1000); // 1Gbps default
  const [rtt, setRtt] = useState<number>(50); // 50ms default
  const [showPermanent, setShowPermanent] = useState(false);

  // Memoize parameters to avoid recalculating on non-input renders
  const params = useMemo(() => {
    const input: NetworkInput = { bandwidth, rtt };
    return calculateTcpParams(input);
  }, [bandwidth, rtt]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10 px-4 sm:px-6">
      
      {/* Header */}
      <header className="w-full max-w-4xl mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold tracking-wide uppercase">
          <Server size={14} /> Linux Kernel Tuning
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          TCP TuneAI
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Calculate optimal Linux TCP window sizes based on your network's Bandwidth-Delay Product (BDP).
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Inputs & Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="text-yellow-400" size={20} />
              Network Profile
            </h2>
            
            <InputSlider 
              label="Bandwidth" 
              value={bandwidth} 
              onChange={setBandwidth} 
              min={10} 
              max={10000} 
              step={10}
              unit="Mbps" 
            />
            
            <InputSlider 
              label="Latency" 
              value={rtt} 
              onChange={setRtt} 
              min={1} 
              max={500} 
              unit="ms" 
            />

            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 p-3 rounded-lg">
                 <div className="text-xs text-slate-400 mb-1">Calculated BDP</div>
                 <div className="text-lg font-mono font-bold text-emerald-400">
                   {formatBytes(params.bdpBytes)}
                 </div>
               </div>
               <div className="bg-slate-800/50 p-3 rounded-lg">
                 <div className="text-xs text-slate-400 mb-1">Target Throughput</div>
                 <div className="text-lg font-mono font-bold text-blue-400">
                   {bandwidth >= 1000 ? `${(bandwidth/1000).toFixed(1)} Gbps` : `${bandwidth} Mbps`}
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
             <Info className="text-blue-400 shrink-0 mt-1" size={18} />
             <div className="text-sm text-slate-300">
               <strong>Why this matters:</strong> TCP performance drops significantly if the window size (buffer) is smaller than the amount of data in flight (BDP).
             </div>
          </div>
        </div>

        {/* Right Column: Configuration Output */}
        <div className="flex flex-col items-start space-y-6">
          
          {/* Temporary Config */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl w-fit max-w-full">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-400">
              <Clock size={18} />
              Temporary Modification
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Apply immediately without rebooting.
            </p>
            <SysctlOutput params={params} variant="command" />
          </div>

          {/* Permanent Config Button/Section */}
          <div className="w-full">
            {!showPermanent ? (
              <button
                onClick={() => setShowPermanent(true)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all duration-300 group"
              >
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Show Permanent Configuration</span>
                <ChevronDown size={16} />
              </button>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-emerald-400">
                      <Save size={18} />
                      Permanent Modification
                    </h2>
                    <p className="text-slate-400 text-sm">
                      For Debian 13: Create <code>/etc/sysctl.d/99-tcp-tuning.conf</code>.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowPermanent(false)}
                    className="text-slate-500 hover:text-slate-300 p-1"
                  >
                    <ChevronUp size={18} />
                  </button>
                </div>
                <SysctlOutput params={params} variant="file" />
              </div>
            )}
          </div>

        </div>

      </main>
      
      <footer className="mt-20 text-slate-600 text-sm">
        <p>Use strictly for educational and optimization purposes. Always test before applying to production.</p>
      </footer>
    </div>
  );
};

export default App;
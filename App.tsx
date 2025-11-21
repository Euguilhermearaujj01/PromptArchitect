import React, { useState } from 'react';
import { Download, Copy, Trash2, Sparkles, Wand2, Camera, Type, Layers, Zap, UserCheck, FileText } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { generatePrompt } from './utils/generator';
import { FormState, GeneratedOutput, Preset } from './types';

const INITIAL_STATE: FormState = {
  mode: 'image',
  title: '',
  style: '',
  colors: '',
  lens: '50mm',
  composition: '',
  elements: '',
  extras: '',
  preserveFeatures: false,
};

const PRESETS: Preset[] = [
  {
    label: "Retrato Artístico",
    mode: "image",
    data: {
      title: "Capa de Álbum",
      style: "retrato cinematográfico, sombrio",
      colors: "vermelho escuro e dourado",
      lens: "50mm",
      composition: "close-up, centralizado",
      elements: "artista centralizado, fumaça",
      extras: "ultra detalhado, fotorrealista, 8k",
      preserveFeatures: true
    }
  },
  {
    label: "Selfie Realista (iPhone)",
    mode: "image",
    data: {
      title: "Selfie Natural",
      style: "foto de iphone, espontânea, luz natural",
      colors: "quente, dourado",
      lens: "24mm",
      composition: "ângulo levemente superior, segurando celular",
      elements: "fundo desfocado natural",
      extras: "textura de pele real, imperfeições naturais, sem filtros",
      preserveFeatures: true
    }
  }
];

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [copiedType, setCopiedType] = useState<'compact' | 'full' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleGenerate = () => {
    const result = generatePrompt(formState);
    setOutput(result);
  };

  const handleAutoExample = () => {
    const example: Partial<FormState> = {
      title: 'Retrato Cyberpunk',
      style: 'cinematográfico, neon, futurista',
      colors: 'ciano e magenta, sombras profundas',
      lens: '85mm',
      composition: 'close-up, profundidade de campo rasa',
      elements: 'luzes da cidade ao fundo, chuva',
      extras: 'fotorrealista, 8k, renderização octane, volumetria',
      preserveFeatures: false
    };

    setFormState(prev => ({ ...prev, ...example }));
  };

  const handleClear = () => {
    setFormState({ ...INITIAL_STATE });
    setOutput(null);
  };

  const handleCopy = (type: 'compact' | 'full') => {
    if (!output) return;
    
    const textToCopy = type === 'compact' 
      ? output.compact 
      : `${output.block}\n\n--- Compacto (Para Geradores de IA) ---\n\n${output.compact}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const textToSave = `${output.block}\n\nCompact (for AI generators):\n${output.compact}`;
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadPreset = (preset: Preset) => {
    setFormState(prev => ({ ...prev, ...preset.data }));
    setTimeout(() => {
        const result = generatePrompt({ ...formState, ...preset.data });
        setOutput(result);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 border-b border-slate-800/60 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-50 tracking-tight">PromptArchitect</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Gerador profissional de prompts visuais fotorrealistas. Otimizado para Midjourney, Stable Diffusion e Flux.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <div className="space-y-5">
                
                <Input 
                  label="Contexto / Título" 
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="Ex: 'Retrato Cyberpunk' ou 'Homem na praia'"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Estilo / Gênero" 
                    name="style"
                    value={formState.style}
                    onChange={handleInputChange}
                    placeholder="Ex: cinematográfico, natural"
                  />
                   <Input 
                    label="Paleta / Cores" 
                    name="colors"
                    value={formState.colors}
                    onChange={handleInputChange}
                    placeholder="Ex: quente, luz dourada"
                  />
                </div>

                <Select 
                  label="Lente / Câmera"
                  name="lens"
                  value={formState.lens}
                  onChange={handleInputChange}
                  options={[
                    { value: '35mm', label: '35mm (Ângulo Padrão)' },
                    { value: '50mm', label: '50mm (Retrato Natural)' },
                    { value: '85mm', label: '85mm (Bokeh/Retrato)' },
                    { value: '24mm', label: '24mm (Grande Angular)' },
                    { value: 'macro', label: 'Macro (Detalhe)' },
                  ]}
                />

                <Input 
                  label="Composição" 
                  name="composition"
                  value={formState.composition}
                  onChange={handleInputChange}
                  placeholder="Ex: regra dos terços, centralizado"
                />

                <Input 
                  label="Elementos (Opcional)"
                  name="elements"
                  value={formState.elements}
                  onChange={handleInputChange}
                  placeholder="Ex: fumaça, chuva, reflexos"
                />

                <Input 
                  label="Qualidade / Extras" 
                  name="extras"
                  value={formState.extras}
                  onChange={handleInputChange}
                  placeholder="Ex: 8k, textura de pele real"
                />

                {/* Feature Preservation Checkbox */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="preserveFeatures"
                        name="preserveFeatures"
                        type="checkbox"
                        checked={formState.preserveFeatures}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="preserveFeatures" className="ml-3 cursor-pointer">
                      <span className="block text-sm font-medium text-slate-200 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-400" /> Preservar Traços e Acessórios
                      </span>
                      <span className="block text-xs text-slate-500 mt-0.5">
                        Mantém fidelidade 100% ao rosto, barba, cabelo, óculos e acessórios da referência.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-3">
                  <Button onClick={handleGenerate} icon={<Zap className="w-4 h-4"/>} className="w-full">
                    Gerar Prompt
                  </Button>
                  <Button variant="secondary" onClick={handleAutoExample} icon={<Sparkles className="w-4 h-4"/>} className="w-full">
                    Exemplo Auto
                  </Button>
                </div>

              </div>
            </div>

            {/* Presets Section */}
            <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Presets Rápidos
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPreset(preset)}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/50 text-indigo-200 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="flex-grow bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <Type className="w-5 h-5 text-indigo-400" />
                  Prompt Gerado
                </h2>
                {output && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleClear}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Limpar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative flex-grow group">
                <textarea
                  readOnly
                  className="w-full h-full min-h-[300px] bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all selection:bg-indigo-500/30"
                  placeholder="Seu prompt gerado aparecerá aqui..."
                  value={output ? `${output.block}\n\n--- Compacto (Para Geradores de IA) ---\n\n${output.compact}` : ''}
                />
                {!output && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                    <Layers className="w-24 h-24 text-slate-600" />
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="primary"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleCopy('compact')} 
                  disabled={!output}
                  icon={copiedType === 'compact' ? <span className="font-bold text-white">✓</span> : <Copy className="w-4 h-4"/>}
                >
                  {copiedType === 'compact' ? 'Copiado!' : 'Copiar Prompt (IA)'}
                </Button>

                <Button 
                  variant="secondary" 
                  className="flex-1 sm:flex-none"
                  onClick={() => handleCopy('full')} 
                  disabled={!output}
                  icon={copiedType === 'full' ? <span className="font-bold text-green-400">✓</span> : <FileText className="w-4 h-4"/>}
                >
                  {copiedType === 'full' ? 'Copiado!' : 'Copiar Tudo'}
                </Button>

                <Button 
                  variant="ghost" 
                  className="sm:ml-auto"
                  onClick={handleDownload} 
                  disabled={!output}
                  icon={<Download className="w-4 h-4"/>}
                >
                  Baixar .txt
                </Button>
              </div>
            </div>

            {/* Tips / Helper */}
            <div className="bg-slate-800/20 border border-slate-700/30 rounded-xl p-5">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-bold uppercase">Dicas de Fotografia</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                <div>
                  <strong className="text-slate-300 block mb-1">Lentes:</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>35mm: Padrão, natural, bom para meio-corpo.</li>
                    <li>50mm: O "olho humano", ideal para retratos sem distorção.</li>
                    <li>85mm: Fundo desfocado (bokeh), foca no rosto.</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-slate-300 block mb-1">Iluminação:</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Golden Hour: Luz quente, final de tarde.</li>
                    <li>Cinematic: Luz dramática, sombras fortes.</li>
                    <li>Natural/Soft: Luz difusa, suave, bom para pele.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
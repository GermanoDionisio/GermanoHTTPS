import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowDown, ArrowUpRight, BrainCircuit, Braces, Building2, Check, ChevronRight, CircleDot,
  Code2, Cpu, Database, ExternalLink, Github, GitBranch, Globe2, Headphones, Layers3,
  Linkedin, Menu, MessageCircle, Network, Orbit, Search, Send, Server, Sparkles, Terminal,
  X, Instagram, Wrench, Zap
} from 'lucide-react';
import {
  Route,
  Switch,
  Router as WouterRouter,
  useLocation,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sent, setSent] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.2 });

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY });
    window.addEventListener('mousemove', move);
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true); }
      if (event.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('keydown', key); };
  }, []);

  const knowledge = [
    { title: 'Desenvolvimento', description: 'Interfaces, APIs e sistemas que transformam ideias em produtos úteis.', category: 'Construir', icon: Code2, color: 'cyan', tags: ['React', 'TypeScript', 'APIs'] },
    { title: 'Git & GitHub', description: 'Fluxos de trabalho claros para colaborar, versionar e lançar com confiança.', category: 'Construir', icon: GitBranch, color: 'violet', tags: ['Git', 'GitHub', 'CI/CD'] },
    { title: 'Hardware & arquitetura', description: 'O que acontece por trás da tela: peças, redes, servidores e decisões técnicas.', category: 'Entender', icon: Cpu, color: 'magenta', tags: ['Infra', 'Redes', 'Linux'] },
    { title: 'Inteligência artificial', description: 'Experimentação prática com modelos, automações e novas formas de pensar.', category: 'Experimentar', icon: BrainCircuit, color: 'blue', tags: ['IA', 'Prompts', 'Automação'] },
    { title: 'Ferramentas digitais', description: 'Descobertas que tornam o trabalho mais rápido, organizado e criativo.', category: 'Explorar', icon: Wrench, color: 'yellow', tags: ['Produtividade', 'No-code', 'Cloud'] },
    { title: 'Aprendizado contínuo', description: 'Notas, testes e explicações para não deixar o conhecimento parado.', category: 'Compartilhar', icon: Sparkles, color: 'green', tags: ['Estudo', 'Notas', 'Tutoriais'] },
  ];
  const filteredKnowledge = useMemo(() => knowledge.filter((item) => {
    const matchesCategory = category === 'Todos' || item.category === category;
    const haystack = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
    return matchesCategory && haystack.includes(searchTerm.toLowerCase());
  }), [category, searchTerm]);
  const categories = ['Todos', 'Construir', 'Entender', 'Experimentar', 'Explorar', 'Compartilhar'];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <main className="site-shell">
      <motion.div className="fixed left-0 top-0 z-50 h-[2px] origin-left bg-primary" style={{ scaleX: progress, width: '100%' }} />
      <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursor-ring" style={{ left: cursor.x, top: cursor.y }} />
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" />

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-foreground/[.08] bg-[#090b18]/75 backdrop-blur-xl">
        <div className="section-wrap flex h-[74px] items-center justify-between">
          <button onClick={() => scrollTo('inicio')} className="group flex items-center gap-3" data-testid="button-brand">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-primary/50 bg-primary/[.08] font-display text-xs font-bold text-primary shadow-[0_0_22px_hsl(var(--primary)/.15)]">G</span>
            <span className="text-left"><span className="block font-display text-sm font-bold tracking-tight">Germano<span className="text-primary">.HTTPS</span></span><span className="block font-mono text-[8px] tracking-[.2em] text-muted-foreground">DIONISIO TECH</span></span>
          </button>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {['Conhecimento', 'Projetos', 'Serviços', 'Contato'].map((item) => <button key={item} onClick={() => scrollTo(item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))} className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground transition-colors hover:text-primary" data-testid={`link-nav-${item}`}>{item}</button>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="hidden items-center gap-2 rounded-full border border-foreground/10 px-3 py-2 text-muted-foreground transition hover:border-primary/50 hover:text-primary sm:flex" data-testid="button-open-search" aria-label="Abrir busca"><Search size={14} /><kbd className="font-mono text-[9px]">⌘ K</kbd></button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-9 w-9 place-items-center rounded-full border border-foreground/10 text-foreground md:hidden" data-testid="button-mobile-menu" aria-label="Menu">{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
            <button onClick={() => scrollTo('contato')} className="button-primary hidden px-4 py-2.5 text-[10px] sm:inline-flex" data-testid="button-header-contact">Vamos conversar <ArrowUpRight size={13} /></button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-foreground/10 bg-[#0b0e1d] px-5 py-5 md:hidden">{['Conhecimento', 'Projetos', 'Serviços', 'Contato'].map((item) => <button key={item} onClick={() => scrollTo(item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))} className="block w-full border-b border-foreground/10 py-3 text-left font-mono text-xs uppercase tracking-widest text-muted-foreground last:border-0 hover:text-primary" data-testid={`link-mobile-${item}`}>{item}</button>)}</div>}
      </header>

      <section id="inicio" className="relative min-h-[850px] overflow-hidden pt-[74px]">
        <div className="absolute inset-0 grid-lines opacity-70" /><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_45%,hsl(267_70%_38%/.16),transparent_32%),radial-gradient(ellipse_at_18%_80%,hsl(190_90%_40%/.1),transparent_30%)]" />
        <div className="section-wrap relative flex min-h-[776px] flex-col justify-center gap-12 py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="relative z-10 max-w-[640px]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="eyebrow mb-7 flex items-center gap-3"><span className="h-px w-8 bg-primary" />01 / OBSERVATÓRIO PESSOAL</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }} className="font-display text-[clamp(3.8rem,9vw,7.8rem)] font-semibold leading-[.88] tracking-[-.08em]">Olá, eu sou<br /><span className="text-gradient">Germano.</span></motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .25 }} className="mt-8 max-w-[500px] text-lg leading-relaxed text-muted-foreground">Tecnologia, desenvolvimento e inovação.<br /><span className="text-foreground/80">Um lugar para aprender fazendo — e compartilhar o caminho.</span></motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .38 }} className="mt-9 flex flex-wrap gap-3"><button onClick={() => scrollTo('conhecimento')} className="button-primary" data-testid="button-explore-knowledge">Explorar conhecimento <ArrowDown size={14} /></button><button onClick={() => scrollTo('contato')} className="button-ghost" data-testid="button-start-conversation">Iniciar conversa <MessageCircle size={14} /></button></motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }} className="mt-14 flex items-center gap-3 font-mono text-[10px] text-muted-foreground"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span> APRENDER. CRIAR. COMPARTILHAR.</motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: .85, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.2, delay: .15, ease: [.2,.8,.2,1] }} className="relative mx-auto flex w-full max-w-[500px] items-center justify-center lg:mx-0">
            <div className="absolute h-[340px] w-[340px] rounded-full bg-secondary/10 blur-3xl" /><div className="orbit"><span className="orbit-node node-a" /><span className="orbit-node node-b" /><span className="orbit-node node-c" /><div className="orbit-core" /><span className="code-float left-[-12px] top-[32%]">{"<build />"}</span><span className="code-float two right-[-16px] top-[62%]">git commit -m "learn"</span><span className="code-float three bottom-[8%] left-[20%]">01001011 01001110</span></div>
          </motion.div>
        </div>
        <div className="section-wrap absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-between font-mono text-[9px] text-muted-foreground"><span>BR / 2025</span><span className="hidden items-center gap-2 sm:flex"><span className="h-px w-24 bg-foreground/20" /> ROLE PARA NAVEGAR</span><span>01—09</span></div>
      </section>

      <section id="manifesto" className="relative border-y border-foreground/[.08] py-28">
        <div className="section-wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><div className="eyebrow mb-5">02 / MANIFESTO</div><h2 className="font-display text-4xl font-medium leading-tight tracking-[-.05em] sm:text-6xl">Tecnologia na prática.<br /><span className="text-muted-foreground">Conhecimento sem limites.</span></h2></div><div className="max-w-[580px]"><p className="text-xl leading-relaxed text-foreground/80">Germano.HTTPS é meu <span className="text-primary">hub pessoal de conhecimento</span>: um laboratório público onde ideias viram testes, testes viram clareza e clareza vira algo que pode ajudar outra pessoa.</p><div className="mt-8 section-rule" /><p className="mt-5 font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Para quem prefere entender o porquê, não apenas o como.</p></div></div>
      </section>

      <section id="conhecimento" className="relative py-28">
        <div className="section-wrap">
          <div className="mb-14 flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><div className="eyebrow mb-5">03 / MAPA DE CONHECIMENTO</div><h2 className="font-display text-4xl font-medium tracking-[-.05em] sm:text-6xl">O que estou <span className="text-gradient">explorando.</span></h2></div><div className="max-w-[320px] text-sm leading-relaxed text-muted-foreground">Cada assunto é uma porta. Entre, veja os conceitos em movimento e leve uma pergunta nova com você.</div></div>
          <div className="mb-8 flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-wider transition ${category === item ? 'border-primary/70 bg-primary/10 text-primary' : 'border-foreground/10 text-muted-foreground hover:border-foreground/30 hover:text-foreground'}`} data-testid={`button-filter-${item}`}>{item}</button>)}<button onClick={() => setSearchOpen(true)} className="ml-auto hidden items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary sm:flex" data-testid="button-search-knowledge"><Search size={13} /> Buscar no mapa</button></div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{filteredKnowledge.map((item, index) => { const Icon = item.icon; return <motion.article layout initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: index * .06 }} key={item.title} className="knowledge-card glass group relative min-h-[250px] rounded-2xl p-6" data-testid={`card-knowledge-${index}`}><div className="mb-12 flex items-start justify-between"><span className={`card-icon grid h-11 w-11 place-items-center rounded-xl bg-${item.color === 'cyan' ? 'primary' : item.color === 'violet' ? 'secondary' : item.color === 'magenta' ? 'accent' : 'yellow-400'}/[.1] text-${item.color === 'cyan' ? 'primary' : item.color === 'violet' ? 'secondary' : item.color === 'magenta' ? 'accent' : 'yellow-300'}`}><Icon size={20} /></span><span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">0{index + 1}</span></div><h3 className="font-display text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p><div className="mt-5 flex flex-wrap gap-2">{item.tags.map(tag => <span key={tag} className="rounded bg-foreground/[.06] px-2 py-1 font-mono text-[9px] text-muted-foreground">{tag}</span>)}</div><ChevronRight size={16} className="absolute bottom-6 right-6 text-foreground/25 transition group-hover:translate-x-1 group-hover:text-primary" /></motion.article>; })}</div>
          {filteredKnowledge.length === 0 && <div className="glass rounded-2xl p-12 text-center"><Search className="mx-auto mb-4 text-muted-foreground" /><p className="text-muted-foreground">Nenhum sinal encontrado para essa busca.</p><button onClick={() => { setSearchTerm(''); setCategory('Todos'); }} className="mt-4 text-sm text-primary hover:underline" data-testid="button-clear-search">Limpar filtros</button></div>}
        </div>
      </section>

      <section id="stack" className="overflow-hidden border-y border-foreground/[.08] py-24">
        <div className="section-wrap"><div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr]"><div><div className="eyebrow mb-5">04 / FERRAMENTAS DO OFÍCIO</div><h2 className="font-display text-4xl font-medium tracking-[-.05em] sm:text-5xl">As peças não são a obra.<br /><span className="text-primary">Mas fazem diferença.</span></h2><p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">Tecnologias organizadas por função — sem misturar linguagem, framework e ferramenta no mesmo saco.</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="glass rounded-2xl p-6"><div className="mb-7 flex items-center gap-3"><Braces size={17} className="text-primary" /><span className="font-mono text-[10px] uppercase tracking-widest text-primary">Linguagens</span></div><div className="flex flex-wrap gap-2">{['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS'].map(x => <span key={x} className="rounded-full border border-primary/20 px-3 py-1.5 text-xs text-foreground/80">{x}</span>)}</div></div><div className="glass rounded-2xl p-6"><div className="mb-7 flex items-center gap-3"><Layers3 size={17} className="text-secondary" /><span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Frameworks</span></div><div className="flex flex-wrap gap-2">{['React', 'Node.js', 'Next.js', 'Tailwind', 'Vite', 'Express'].map(x => <span key={x} className="rounded-full border border-secondary/20 px-3 py-1.5 text-xs text-foreground/80">{x}</span>)}</div></div><div className="glass rounded-2xl p-6 sm:col-span-2"><div className="mb-7 flex items-center gap-3"><Terminal size={17} className="text-accent" /><span className="font-mono text-[10px] uppercase tracking-widest text-accent">Ferramentas & ambiente</span></div><div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-muted-foreground">{['Git / GitHub', 'VS Code', 'Linux', 'Docker', 'Figma', 'Postman', 'Cloud', 'Terminal'].map(x => <span key={x} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{x}</span>)}</div></div></div></div></div>
      </section>

      <section id="laboratorio" className="relative py-28">
        <div className="section-wrap"><div className="mb-14"><div className="eyebrow mb-5">05 / DENTRO DO LABORATÓRIO</div><h2 className="max-w-3xl font-display text-4xl font-medium tracking-[-.05em] sm:text-6xl">Curiosidade com<br /><span className="text-gradient">mãos sujas de graxa.</span></h2></div><div className="grid gap-4 lg:grid-cols-3"><div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[.12] to-transparent p-7 lg:col-span-2"><div className="absolute right-[-30px] top-[-40px] opacity-20"><Network size={190} strokeWidth={.5} /></div><div className="relative"><GitBranch className="mb-12 text-primary" size={26} /><h3 className="font-display text-2xl font-semibold">Git é mais que versionamento.</h3><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">É uma forma de tornar o raciocínio visível: experimentar sem medo, voltar quando preciso e construir junto. Aqui ficam os bastidores do processo.</p><a href="https://github.com/GermanoDionisio" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:underline" data-testid="link-github-lab">Ver no GitHub <ExternalLink size={13} /></a></div></div><div className="glass rounded-2xl p-7"><Server className="mb-12 text-secondary" size={26} /><h3 className="font-display text-2xl font-semibold">Hardware & arquitetura</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Do componente ao rack. Entender a base muda a maneira como construímos a camada de cima.</p><div className="mt-8 flex items-center gap-2 font-mono text-[10px] text-secondary"><CircleDot size={13} /> CAMADA FÍSICA → DIGITAL</div></div><div className="glass rounded-2xl p-7"><BrainCircuit className="mb-12 text-accent" size={26} /><h3 className="font-display text-2xl font-semibold">IA sem fumaça.</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Testar modelos, entender limites e descobrir onde a inteligência artificial realmente melhora o trabalho.</p><div className="mt-8 flex items-center gap-2 font-mono text-[10px] text-accent"><Zap size={13} /> HIPÓTESE → TESTE → APRENDIZADO</div></div><div className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-secondary/[.07] p-7 lg:col-span-2"><div className="absolute right-0 top-0 h-full w-1/2 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, hsl(var(--secondary) / .55) 1px, transparent 1px)', backgroundSize: '18px 18px' }} /><div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-secondary">Sinal aberto</div><h3 className="font-display text-2xl font-semibold">O que você está tentando entender?</h3><p className="mt-3 max-w-md text-sm text-muted-foreground">Conhecimento cresce melhor quando encontra outra perspectiva.</p></div><button onClick={() => scrollTo('contato')} className="button-ghost whitespace-nowrap" data-testid="button-share-question">Compartilhar pergunta <ArrowUpRight size={14} /></button></div></div></div></div>
      </section>

      <section id="projetos" className="border-y border-foreground/[.08] py-28">
        <div className="section-wrap"><div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="eyebrow mb-5">06 / PROJETOS SELECIONADOS</div><h2 className="font-display text-4xl font-medium tracking-[-.05em] sm:text-6xl">Ideias em <span className="text-gradient">órbita.</span></h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Projetos reais, experimentos honestos. Cada um começa com uma pergunta.</p></div><div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><article className="project-card rounded-2xl border border-accent/35 bg-[#111126] p-7 sm:p-10"><div className="project-art absolute" /><div className="mb-20 flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/15 text-accent"><BrainCircuit size={20} /></span><span className="font-mono text-[10px] uppercase tracking-widest text-accent">Projeto em destaque</span></div><span className="rounded-full border border-accent/30 px-2.5 py-1 font-mono text-[9px] text-accent">COGNIA AI</span></div><h3 className="font-display text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Cognia AI</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Um espaço para explorar como a inteligência artificial pode organizar ideias, acelerar descobertas e tornar conhecimento mais acessível.</p><div className="mt-8 flex flex-wrap gap-2">{['IA aplicada', 'Produto', 'Experimentação'].map(x => <span key={x} className="rounded bg-foreground/[.07] px-2.5 py-1.5 font-mono text-[9px] text-foreground/70">{x}</span>)}</div><button onClick={() => scrollTo('contato')} className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline" data-testid="button-project-cognia">Conversar sobre o projeto <ArrowUpRight size={14} /></button></article><div className="grid gap-5"><article className="project-card glass rounded-2xl p-7"><div className="mb-12 flex justify-between"><Globe2 className="text-primary" size={21} /><span className="font-mono text-[9px] text-muted-foreground">02</span></div><h3 className="font-display text-2xl font-semibold">Germano.HTTPS</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Este observatório: um sistema vivo para aprender em público.</p><button onClick={() => scrollTo('manifesto')} className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary" data-testid="button-project-observatory">Conhecer a ideia <ChevronRight size={14} /></button></article><article className="project-card glass rounded-2xl p-7"><div className="mb-12 flex justify-between"><Database className="text-secondary" size={21} /><span className="font-mono text-[9px] text-muted-foreground">03</span></div><h3 className="font-display text-2xl font-semibold">Próxima órbita</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Um projeto ainda sendo desenhado. O melhor tipo de começo.</p><button onClick={() => scrollTo('contato')} className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-secondary" data-testid="button-project-next">Acompanhar <ChevronRight size={14} /></button></article></div></div></div>
      </section>

      <section id="servicos" className="py-28">
        <div className="section-wrap"><div className="mb-14"><div className="eyebrow mb-5">07 / COMO POSSO AJUDAR</div><h2 className="font-display text-4xl font-medium tracking-[-.05em] sm:text-6xl">Tecnologia que<br /><span className="text-primary">chega em algum lugar.</span></h2></div><div className="grid gap-3 md:grid-cols-2"><div className="glass group rounded-2xl p-7 transition hover:border-primary/40 sm:p-9"><div className="mb-16 flex items-start justify-between"><Building2 className="text-primary" size={26} /><span className="font-mono text-[10px] text-primary">PARA EMPRESAS</span></div><h3 className="font-display text-3xl font-semibold">Construir com clareza</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Desenvolvimento de produtos digitais, interfaces e soluções técnicas que equilibram o que é possível com o que é útil.</p><ul className="mt-8 space-y-3 text-sm text-foreground/75">{['Desenvolvimento web', 'Prototipação e validação', 'Arquitetura e integração'].map(x => <li key={x} className="flex items-center gap-3"><Check size={14} className="text-primary" />{x}</li>)}</ul><button onClick={() => scrollTo('contato')} className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary" data-testid="button-service-company">Falar sobre um desafio <ArrowUpRight size={14} /></button></div><div className="glass group rounded-2xl p-7 transition hover:border-secondary/40 sm:p-9"><div className="mb-16 flex items-start justify-between"><Headphones className="text-secondary" size={26} /><span className="font-mono text-[10px] text-secondary">PARA PESSOAS</span></div><h3 className="font-display text-3xl font-semibold">Aprender sem travar</h3><p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Explicações, orientação e troca para quem quer dar o próximo passo em tecnologia — seja ele o primeiro ou o décimo.</p><ul className="mt-8 space-y-3 text-sm text-foreground/75">{['Mentoria e orientação', 'Conteúdo prático', 'Revisão de ideias e projetos'].map(x => <li key={x} className="flex items-center gap-3"><Check size={14} className="text-secondary" />{x}</li>)}</ul><button onClick={() => scrollTo('contato')} className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-secondary" data-testid="button-service-person">Trocar uma ideia <ArrowUpRight size={14} /></button></div></div></div>
      </section>

      <section id="jornada" className="border-y border-foreground/[.08] py-28">
        <div className="section-wrap grid gap-14 lg:grid-cols-[.7fr_1.3fr]"><div><div className="eyebrow mb-5">08 / JORNADA</div><h2 className="font-display text-4xl font-medium tracking-[-.05em] sm:text-5xl">Ainda em<br /><span className="text-gradient">movimento.</span></h2><p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">Uma linha do tempo configurável: porque aprender tecnologia não é chegar, é continuar ajustando a rota.</p><div className="mt-7 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground"><Orbit size={13} className="text-primary" /> Atualizada conforme a jornada acontece</div></div><div className="relative ml-2 border-l border-foreground/15 pl-8 sm:ml-10 sm:pl-12"><div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary))]" /><div className="pb-12"><div className="font-mono text-[10px] text-primary">AGORA / EM CONSTRUÇÃO</div><h3 className="mt-3 font-display text-2xl font-semibold">Experimentar, documentar, compartilhar</h3><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">O ponto atual: aproximar desenvolvimento, infraestrutura, IA e comunicação em projetos que façam sentido.</p></div><div className="absolute -left-[5px] top-[47%] h-2.5 w-2.5 rounded-full border border-secondary bg-[#090b18]" /><div className="border-t border-foreground/10 pt-8"><div className="font-mono text-[10px] text-muted-foreground">PRÓXIMA COORDENADA / CONFIGURÁVEL</div><h3 className="mt-3 font-display text-2xl font-semibold text-foreground/70">O próximo capítulo está sendo escrito</h3><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">Este espaço pode receber marcos, estudos e lançamentos conforme novos capítulos ganham forma.</p></div></div></div>
      </section>

      <section id="contato" className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,hsl(267_75%_42%/.16),transparent_55%)]" />
        <div className="section-wrap relative grid gap-16 lg:grid-cols-[.9fr_1.1fr]"><div><div className="eyebrow mb-5">09 / SINAL DE CONTATO</div><h2 className="font-display text-5xl font-medium leading-[.95] tracking-[-.07em] sm:text-7xl">Vamos colocar<br /><span className="text-gradient">uma ideia em órbita?</span></h2><p className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground">Uma pergunta, um projeto, uma possibilidade. Escreva — eu respondo quando pousar por aqui.</p><a href="mailto:germano.dsneto@gmail.com" className="mt-8 inline-flex items-center gap-3 font-mono text-xs text-primary hover:underline" data-testid="link-email"><Send size={14} /> germano.dsneto@gmail.com</a><div className="mt-14 flex gap-3"><a href="https://www.linkedin.com/in/germano-neto-8036283b6/" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 text-muted-foreground transition hover:border-primary hover:text-primary" data-testid="link-linkedin" aria-label="LinkedIn"><Linkedin size={16} /></a><a href="https://www.instagram.com/germano.https/" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 text-muted-foreground transition hover:border-accent hover:text-accent" data-testid="link-instagram" aria-label="Instagram"><Instagram size={16} /></a><a href="https://github.com/GermanoDionisio" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 text-muted-foreground transition hover:border-secondary hover:text-secondary" data-testid="link-github" aria-label="GitHub"><Github size={16} /></a></div></div><form onSubmit={submitContact} className="glass rounded-2xl p-7 sm:p-10" data-testid="form-contact">{sent ? <div className="flex min-h-[380px] flex-col items-center justify-center text-center"><span className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><Check size={25} /></span><h3 className="font-display text-3xl font-semibold">Sinal recebido.</h3><p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Obrigado por escrever. Sua mensagem já entrou na fila de pouso.</p><button type="button" onClick={() => setSent(false)} className="mt-8 font-mono text-[10px] uppercase tracking-widest text-primary hover:underline" data-testid="button-send-another">Enviar outra mensagem</button></div> : <><div className="mb-8 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">nova_mensagem</span><span className="flex items-center gap-2 font-mono text-[9px] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> online para ideias</span></div><label className="mb-6 block"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Seu nome</span><input required name="name" className="input-field" placeholder="Como posso te chamar?" data-testid="input-contact-name" /></label><label className="mb-6 block"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Seu e-mail</span><input required type="email" name="email" className="input-field" placeholder="voce@exemplo.com" data-testid="input-contact-email" /></label><label className="mb-8 block"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Mensagem</span><textarea required name="message" rows={3} className="input-field resize-none" placeholder="O que está orbitando sua cabeça?" data-testid="input-contact-message" /></label><button type="submit" className="button-primary w-full" data-testid="button-submit-contact">Transmitir mensagem <Send size={14} /></button></>}</form></div>
      </section>

      <footer className="border-t border-foreground/[.08] py-8"><div className="section-wrap flex flex-col justify-between gap-4 font-mono text-[9px] uppercase tracking-[.14em] text-muted-foreground sm:flex-row sm:items-center"><span>Germano<span className="text-primary">.HTTPS</span> / Dionisio Tech</span><span>APRENDER. CRIAR. COMPARTILHAR.</span><span className="flex items-center gap-2"><CircleDot size={10} className="text-primary" /> Feito com curiosidade</span></div></footer>

      {searchOpen && <div className="search-backdrop fixed inset-0 z-[70] flex items-start justify-center p-5 pt-[15vh]" role="dialog" aria-modal="true" aria-label="Busca no conhecimento" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}><div className="glass w-full max-w-2xl rounded-2xl p-6 shadow-2xl sm:p-8"><div className="mb-7 flex items-center justify-between"><div><div className="eyebrow mb-2">BUSCA GLOBAL</div><h2 className="font-display text-2xl font-semibold">Encontre um sinal.</h2></div><button onClick={() => setSearchOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-foreground/10 text-muted-foreground hover:text-primary" data-testid="button-close-search" aria-label="Fechar busca"><X size={16} /></button></div><div className="flex items-center gap-3 border-b border-primary/50 pb-3"><Search size={18} className="text-primary" /><input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full bg-transparent font-display text-xl outline-none placeholder:text-muted-foreground/60" placeholder="React, IA, arquitetura..." data-testid="input-global-search" /></div><div className="mt-6 flex flex-wrap gap-2">{categories.slice(0, 4).map(item => <button key={item} onClick={() => { setCategory(item); setSearchOpen(false); scrollTo('conhecimento'); }} className="rounded-full border border-foreground/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:border-primary/50 hover:text-primary" data-testid={`button-search-category-${item}`}>{item}</button>)}</div><p className="mt-8 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Pressione Esc para fechar · ⌘ K a qualquer momento</p></div></div>}
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

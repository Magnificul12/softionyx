export default function Solutions() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 animate-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="animate-in">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tighter mb-6">
              Solutions <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">That Scale</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
              Modular, production-ready systems tailored to your product, team, and growth stage.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Product Engineering', desc: 'End-to-end delivery from discovery to launch with a reliable stack.' },
              { title: 'Data & Analytics', desc: 'Operational insights, dashboards, and pipelines that drive decisions.' },
              { title: 'Automation', desc: 'Workflows that reduce manual work and speed up execution.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.04] transition-all card-glow">
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

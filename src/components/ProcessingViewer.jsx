import { motion } from 'framer-motion';
import {
  Activity,
  Binary,
  ClipboardList,
  Database,
  FileSearch,
  Radar,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react';

const stepIcons = {
  'Intake + Clinical Agent': FileSearch,
  'Coding Agent': Database,
  'Validation + Ambiguity Agent': ShieldCheck,
  'Audit Agent': ClipboardList,
};

export function ProcessingViewer({
  currentStep,
  currentAgent,
  currentDetail,
  progress = 0,
  steps = [],
  activityFeed = [],
  extractedEntities = {},
}) {
  const transition = { type: 'spring', stiffness: 105, damping: 18, mass: 0.86 };
  const stageGroups = [
    { label: 'Conditions', value: extractedEntities.conditions || [], icon: Radar },
    { label: 'Procedures', value: extractedEntities.procedures || [], icon: Binary },
    { label: 'Evidence', value: extractedEntities.evidence || [], icon: Waves },
  ];

  return (
    <motion.div layout transition={transition} className="space-y-4">
      <div className="processing-command-shell">
        <motion.div layout transition={transition} className="processing-left-rail">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Agent rail</p>
            <h3 className="mt-2 font-display text-2xl text-white">Workflow stages</h3>
          </div>

          <div className="processing-stage-stack">
            {steps.map((entry, index) => {
              const Icon = stepIcons[entry.agent] || FileSearch;
              const isCurrent = entry.step === currentStep;

              return (
                <motion.div
                  key={`${entry.agent}-${entry.step}-${index}`}
                  layout
                  transition={transition}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`processing-stage-card ${isCurrent ? 'processing-stage-card-active' : ''}`}
                >
                  <div className="processing-stage-line" />
                  <div className={`processing-stage-icon ${isCurrent ? 'processing-stage-icon-active' : ''}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Stage {index + 1}</span>
                      {isCurrent ? <span className="live-dot" /> : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-100">{entry.agent}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{entry.step}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div layout transition={transition} className="processing-core-shell">
          <motion.div
            className="processing-sheen"
            animate={{ x: ['-120%', '160%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          <div className="processing-core-header">
            <div className="space-y-4">
              <div className="status-pill">
                <Activity className="h-4 w-4" />
                <span>Live processing</span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Current agent</p>
                <h2 className="mt-3 font-display text-3xl text-white">{currentAgent || 'Initializing workflow'}</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200">{currentStep}</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  {currentDetail || 'Waiting for the next processing signal.'}
                </p>
              </div>
            </div>

            <div className="processing-metrics-grid">
              <div className="processing-stat">
                <p className="processing-stat-label">Progress</p>
                <p className="processing-stat-value">{progress}%</p>
              </div>
              <div className="processing-stat">
                <p className="processing-stat-label">Active feed items</p>
                <p className="processing-stat-value">{activityFeed.length}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-900/80">
            <motion.div
              layout
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.98),rgba(52,211,153,0.9),rgba(45,212,191,0.84))]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 88, damping: 18 }}
            />
          </div>

          <div className="processing-pipeline-strip">
            {steps.map((entry, index) => {
              const isCurrent = entry.step === currentStep;
              return (
                <motion.div
                  key={`${entry.step}-${index}`}
                  layout
                  transition={transition}
                  className={`processing-pipeline-node ${isCurrent ? 'processing-pipeline-node-active' : ''}`}
                >
                  <span className="processing-pipeline-number">{index + 1}</span>
                  <span className="processing-pipeline-text">{entry.step}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {stageGroups.map((group) => {
              const Icon = group.icon;
              return (
                <motion.div layout transition={transition} key={group.label} className="processing-cell">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/10 text-cyan-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{group.label}</p>
                      <p className="text-xs text-slate-400">{group.value.length} live signals</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {group.value.length ? (
                      group.value.map((item) => (
                        <motion.div
                          layout
                          transition={transition}
                          key={item}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="signal-chip"
                        >
                          <span className="live-dot live-dot-small" />
                          <span>{item}</span>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No extracted signals yet.</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div layout transition={transition} className="processing-feed-shell">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Runtime telemetry</p>
              <h3 className="mt-2 font-display text-2xl text-white">Live feed</h3>
            </div>
            <div className="status-pill">
              <Sparkles className="h-4 w-4" />
              <span>Streaming</span>
            </div>
          </div>

          <div className="processing-feed-list">
            {activityFeed.map((item, index) => (
              <motion.div
                layout
                key={`${item.agent}-${item.title}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: index * 0.025 }}
                className={`processing-feed-card ${item.status === 'active' ? 'processing-feed-card-active' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{item.agent}</p>
                      {item.status === 'active' ? <span className="live-dot live-dot-small" /> : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{item.detail}</p>
                  </div>
                  <span className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-slate-500">{item.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

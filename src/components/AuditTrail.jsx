import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, Radar } from 'lucide-react';

export function AuditTrail({ events = [] }) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={`${event.agent}-${event.step ?? index}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06 }}
          className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/55 p-5"
        >
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-400/0 via-cyan-300/60 to-cyan-400/0" />
          <div className="flex items-start gap-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
              {event.duration ? <Radar className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                  Step {event.step ?? index + 1}
                </p>
                {event.agent && (
                  <span className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-emerald-200">
                    {event.agent}
                  </span>
                )}
              </div>
              <p className="mt-3 text-base text-slate-100">{event.action || event}</p>
            </div>

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span>{event.duration || 'logged'}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

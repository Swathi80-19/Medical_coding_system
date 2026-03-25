import { motion } from 'framer-motion';
import { ArrowRight, ClipboardCheck, Database, FlaskConical, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadPanel } from '../components/UploadPanel';
import { sampleClinicalNotes, startProcessing, uploadNote } from '../services/api';

const sideRail = [
  { title: 'Intake extraction', detail: 'Diseases, procedures, and context become structured evidence.', icon: FlaskConical },
  { title: 'Coding pass', detail: 'ICD-10 and CPT candidates are attached to each note.', icon: Database },
  { title: 'Validation gate', detail: 'Ambiguity pauses the flow before bad codes are returned.', icon: ShieldCheck },
  { title: 'Audit output', detail: 'Confidence, reasoning, and audit trail finish the run.', icon: ClipboardCheck },
];

export function UploadPage() {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (note.trim().length < 60 || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const uploadResponse = await uploadNote(note.trim());

      if (!uploadResponse.noteId) {
        throw new Error('The note could not be uploaded.');
      }

      await startProcessing(uploadResponse.noteId);
      navigate(`/note/${uploadResponse.noteId}`);
    } catch (submissionError) {
      setError(submissionError.message || 'Something went wrong while starting the workflow.');
      setIsLoading(false);
    }
  };

  return (
    <section className="page-shell">
      <div className="grid gap-px border-y border-white/10 bg-white/[0.06] xl:grid-cols-[1.16fr_0.84fr]">
        <div className="space-y-4 bg-slate-950/38 px-4 py-4 sm:px-6 lg:px-8">
          {error ? (
            <div className="rounded-[24px] border border-rose-300/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <UploadPanel
            note={note}
            onChange={setNote}
            onFileImport={setNote}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        <div className="space-y-4 bg-slate-950/22 px-4 py-4 sm:px-6 lg:px-8">
          <div className="panel">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Sample notes</p>
            <h2 className="mt-3 font-display text-2xl text-white">Quick-fill realistic examples</h2>
            <div className="mt-4 space-y-3">
              {sampleClinicalNotes.map((sample, index) => (
                <motion.button
                  key={sample.title}
                  type="button"
                  onClick={() => setNote(sample.content)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full rounded-[24px] border border-white/10 bg-slate-950/45 p-5 text-left transition-all duration-300 hover:border-cyan-300/20 hover:bg-cyan-400/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base text-slate-100">{sample.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{sample.content.slice(0, 120)}...</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-cyan-200" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="panel">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Workflow expectations</p>
            <div className="mt-4 space-y-3">
              {sideRail.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 rounded-[22px] border border-white/10 bg-slate-950/35 p-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.26em] text-slate-500">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

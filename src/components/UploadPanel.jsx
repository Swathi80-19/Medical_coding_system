import { motion } from 'framer-motion';
import { ArrowRight, FileText, Paperclip, Sparkles, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export function UploadPanel({ note, onChange, onSubmit, onFileImport, isLoading, minChars = 60 }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const count = note.trim().length;
  const progress = Math.min(100, Math.round((count / minChars) * 100));
  const isValid = count >= minChars;

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('text/') && !/\.(txt|md|csv|json)$/i.test(file.name)) {
      setFileError('Use a text-based file such as .txt, .md, .csv, or .json.');
      event.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      onFileImport(text);
      setFileName(file.name);
      setFileError('');
    } catch {
      setFileError('The selected file could not be read.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="status-pill">
            <Sparkles className="h-4 w-4" />
            <span>Clinical note intake</span>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none text-white md:text-5xl">
            Upload a note and launch the full coding workflow.
          </h1>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-slate-950/50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Readiness</p>
          <p className="mt-2 font-display text-3xl text-cyan-100">{progress}%</p>
        </div>
      </div>

      <div className="mt-5 flex-1 rounded-[28px] border border-white/10 bg-slate-950/55 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clinical note</p>
              <p className="text-sm text-slate-300">Paste physician documentation or encounter text.</p>
            </div>
          </div>

          <span className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.24em] ${isValid ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-white/5 text-slate-400'}`}>
            {count}/{minChars}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.csv,.json,text/plain"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[22px] border border-white/10 bg-slate-950/45 p-3">
          <button type="button" onClick={handlePickFile} className="secondary-button">
            <Upload className="h-4 w-4" />
            <span>Upload file</span>
          </button>

          <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
            <Paperclip className="h-4 w-4 text-cyan-200" />
            <span className="truncate">{fileName || 'No file selected. Text files only for now.'}</span>
          </div>
        </div>

        {fileError ? (
          <div className="mb-4 rounded-[20px] border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {fileError}
          </div>
        ) : null}

        <textarea
          value={note}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste the clinical note here. Include diagnoses, procedures, medications, labs, or any ambiguity you want the validation agent to catch."
          className="input-shell min-h-[18rem] w-full resize-none"
        />

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-900/80">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.9),rgba(52,211,153,0.9))]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            {isValid
              ? 'Enough context detected to start extraction and coding.'
              : `Add ${minChars - count} more characters to improve extraction quality.`}
          </p>

          <button type="button" onClick={onSubmit} disabled={!isValid || isLoading} className="primary-button">
            <span>{isLoading ? 'Submitting note...' : 'Start processing'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, HelpCircle, Send, TextCursorInput } from 'lucide-react';
import { useMemo, useState } from 'react';

export function AmbiguityBox({ questions = [], onSubmit, isLoading }) {
  const [answers, setAnswers] = useState({});
  const [activeQuestionId, setActiveQuestionId] = useState(questions[0]?.id || '');

  const normalizedQuestions = useMemo(
    () =>
      questions.map((question, index) => ({
        ...question,
        id: question.id || `question_${index}`,
        required: question.required ?? true,
        answer_type: question.answer_type || (question.options?.length ? 'choice' : 'text'),
      })),
    [questions]
  );

  const activeQuestion =
    normalizedQuestions.find((question) => question.id === activeQuestionId) || normalizedQuestions[0];

  const isAnswered = (question) => String(answers[question.id] || '').trim().length > 0;
  const allRequiredAnswered = normalizedQuestions.every((question) => !question.required || isAnswered(question));

  const handleChoice = (questionId, option) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: option,
    }));
  };

  const handleText = (questionId, value) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  };

  const orderedAnswers = normalizedQuestions
    .map((question) => answers[question.id] || '')
    .filter((value) => String(value).trim().length > 0);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-amber-500/20 bg-[linear-gradient(135deg,rgba(254,243,199,0.9),rgba(255,255,255,0.82))] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.28em] text-amber-700/80">Ambiguity detected</p>
              <h2 className="font-display text-2xl text-slate-800">The coding agent needs a precise answer before final validation.</h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Review each clarification request below. Some questions need a single choice, while others need typed clinical detail.
              </p>
            </div>
          </div>

          <div className="ambiguity-summary">
            <div>
              <p className="ambiguity-summary-label">Questions</p>
              <p className="ambiguity-summary-value">{normalizedQuestions.length}</p>
            </div>
            <div>
              <p className="ambiguity-summary-label">Answered</p>
              <p className="ambiguity-summary-value">
                {normalizedQuestions.filter((question) => isAnswered(question)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="panel space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Clarification queue</p>
            <h3 className="mt-2 font-display text-2xl text-slate-800">Questions</h3>
          </div>

          <div className="space-y-3">
            {normalizedQuestions.map((question, index) => {
              const selected = activeQuestion?.id === question.id;
              const answered = isAnswered(question);

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setActiveQuestionId(question.id)}
                  className={`ambiguity-question-card ${selected ? 'ambiguity-question-card-active' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Question {index + 1}</span>
                        <span className={`ambiguity-mode-pill ${question.answer_type === 'choice' ? 'ambiguity-mode-pill-choice' : 'ambiguity-mode-pill-text'}`}>
                          {question.answer_type === 'choice' ? 'Choose one' : 'Type input'}
                        </span>
                        {question.required ? (
                          <span className="ambiguity-required-pill">Required</span>
                        ) : (
                          <span className="ambiguity-optional-pill">Optional</span>
                        )}
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">{question.prompt}</p>
                    </div>

                    <div className="mt-1">
                      {answered ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <HelpCircle className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel space-y-5">
          {activeQuestion ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuestion.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="space-y-5"
              >
                <div className="rounded-[24px] border border-stone-200/80 bg-white/72 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Active clarification</span>
                    <span className={`ambiguity-mode-pill ${activeQuestion.answer_type === 'choice' ? 'ambiguity-mode-pill-choice' : 'ambiguity-mode-pill-text'}`}>
                      {activeQuestion.answer_type === 'choice' ? 'Choose one response' : 'Provide typed detail'}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-slate-800">{activeQuestion.prompt}</h3>
                  {activeQuestion.helper_text ? (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{activeQuestion.helper_text}</p>
                  ) : null}
                </div>

                {activeQuestion.options?.length ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
                      {activeQuestion.input_label || 'Choose one answer'}
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      {activeQuestion.options.map((option) => {
                        const selected = answers[activeQuestion.id] === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleChoice(activeQuestion.id, option)}
                            className={`ambiguity-option-card ${selected ? 'ambiguity-option-card-active' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 text-left">
                                <p className="text-base text-slate-800">{option}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">Selectable coding path</p>
                              </div>
                              {selected ? <CheckCircle2 className="h-5 w-5 text-teal-700" /> : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {activeQuestion.answer_type !== 'choice' ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
                      {activeQuestion.input_label || 'Type the clarification'}
                    </p>
                    <div className="relative">
                      <TextCursorInput className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-teal-700/70" />
                      <textarea
                        value={answers[activeQuestion.id] || ''}
                        onChange={(event) => handleText(activeQuestion.id, event.target.value)}
                        placeholder={activeQuestion.placeholder || 'Type your clarification here'}
                        className="input-shell min-h-36 w-full resize-none pl-11"
                      />
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200/80 pt-4">
            <p className="text-sm text-slate-500">
              {allRequiredAnswered
                ? 'All required ambiguity questions are answered. You can resume the workflow.'
                : 'Complete all required questions before the coding workflow can continue.'}
            </p>

            <button
              type="button"
              onClick={() => onSubmit(orderedAnswers)}
              disabled={!allRequiredAnswered || orderedAnswers.length === 0 || isLoading}
              className="primary-button"
            >
              <Send className="h-4 w-4" />
              <span>{isLoading ? 'Resuming workflow...' : 'Submit clarification'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

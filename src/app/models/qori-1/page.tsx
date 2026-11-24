import Link from 'next/link';
import BarChart from '@/components/bar-chart';

export const metadata = {
  title: 'Models',
  description:
    'Qori 1 — a 1.7B open model that writes file edits a harness can apply byte-for-byte.',
};

/**
 * Release page for Qori 1. Numbers are the measured ones from the evaluation sweep; the raw
 * per-item rows are published with the model so every figure here can be recomputed.
 */
export default function ModelsPage() {
  return (
    <main className="sheet">
      <section className="row pt-10 pb-0">
        <div className="hang">§ Model</div>
        <div>
          <h1 className="page-title">Qori 1</h1>
          <p className="lede mt-5 mb-0 max-w-[34rem]">
            A 1.7B open model that writes file edits a harness can apply exactly. You give it a
            file and a change request; it returns one SEARCH/REPLACE block whose text matches the
            file once — so nothing is fuzzy-matched into the wrong place.
          </p>
          <p className="meta mt-5 mb-0 flex flex-wrap gap-x-5 gap-y-2">
            <a href="https://huggingface.co/kyssta/Qori-1" target="_blank" rel="noreferrer">
              weights and adapters
            </a>
            <a href="https://huggingface.co/kyssta/Qori-1/blob/main/PAPER.md" target="_blank" rel="noreferrer">
              paper
            </a>
            <a href="https://huggingface.co/kyssta/Qori-1/tree/main/results" target="_blank" rel="noreferrer">
              raw results
            </a>
          </p>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Result</div>
        <div>
          <p className="muted m-0 max-w-[34rem]">
            Scored by applying the emitted block to the real file: it counts only if the SEARCH
            text occurs exactly once. Each set is a repository the model never trained on.
            Baselines are models 1.8× and 4× larger, given the same prompt and scorer.
          </p>

          <div className="mt-8 grid gap-9">
            <BarChart
              heading="httpx — held out, 60 commits"
              rows={[
                { label: 'Qori 1', value: 90.0, tone: 'us' },
                { label: 'Qwen2.5-3B', value: 31.7 },
                { label: 'Qwen2.5-7B', value: 23.3 },
                { label: 'LFM3 base', value: 0.0 },
              ]}
            />
            <BarChart
              heading="starlette — unseen, 40 commits"
              rows={[
                { label: 'Qori 1', value: 82.5, tone: 'us' },
                { label: 'Qwen2.5-3B', value: 27.5 },
                { label: 'Qwen2.5-7B', value: 25.0 },
                { label: 'LFM3 base', value: 0.0 },
              ]}
            />
            <BarChart
              heading="httpcore — unseen, 40 commits"
              rows={[
                { label: 'Qori 1', value: 87.5, tone: 'us' },
                { label: 'Qwen2.5-3B', value: 32.5 },
                { label: 'Qwen2.5-7B', value: 7.5 },
                { label: 'LFM3 base', value: 0.0 },
              ]}
            />
            <BarChart
              heading="JavaScript, Go, Rust, Java — 60 commits"
              note="Not Python: the edit format transfers, the language does not have to."
              rows={[
                { label: 'Qori 1', value: 91.7, tone: 'us' },
                { label: 'Qwen2.5-3B', value: 33.3 },
                { label: 'Qwen2.5-7B', value: 43.3 },
                { label: 'LFM3 base', value: 0.0 },
              ]}
            />
          </div>

          <p className="muted mt-8 mb-0 max-w-[34rem]">
            The 4× larger 7B scores below the 3B on three of these four sets. Parameter count does
            not teach byte-exact output; a 0.8% LoRA update does. The base model never emits a
            block at all — asked to edit a file it replies with a tool call for a tool it does not
            have.
          </p>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Trade-offs</div>
        <div>
          <p className="muted m-0 max-w-[34rem]">
            Two post-trains are released. The multi-task version adds tool calling; it edits
            slightly better and follows instructions less well. Neither dominates, so the choice
            is yours to make from the numbers.
          </p>
          <div className="mt-8 grid gap-9">
            <BarChart
              heading="Edit apply — httpx (60)"
              rows={[
                { label: 'Multi-task', value: 93.3, tone: 'us' },
                { label: 'Qori 1', value: 90.0, tone: 'us' },
                { label: 'Base', value: 0.0 },
              ]}
            />
            <BarChart
              heading="Tool-call function match (40)"
              note="Not measured for the edit-only version."
              rows={[
                { label: 'Multi-task', value: 97.5, tone: 'us' },
                { label: 'Base', value: 85.0 },
              ]}
            />
            <BarChart
              heading="IFEval, prompt-strict (541)"
              note="Base figure is Liquid's published number."
              rows={[
                { label: 'Qori 1', value: 75.6, tone: 'us' },
                { label: 'Multi-task', value: 64.7, tone: 'us' },
                { label: 'Base', value: 96.66 },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Limits</div>
        <div>
          <p className="muted m-0 max-w-[34rem]">
            Everything below is measured, not hedged. It is here because a release page that only
            lists wins is not worth reading.
          </p>
          <ul className="muted mt-5 max-w-[34rem] list-disc pl-5 leading-relaxed">
            <li className="mt-2">
              Anchoring is the weakness, not formatting: 12 to 25 applicable blocks per set land
              outside the true change region. A block can apply cleanly and still be in the wrong
              place.
            </li>
            <li className="mt-2">
              The quantised GGUF does not hold the format. It loads and generates fluently but
              reasons aloud before answering, so a strict parser finds no block — 0 of 12 on
              held-out items, against 90% in fp16.
            </li>
            <li className="mt-2">
              Instruction following regressed: IFEval is 75.6% and 64.7% against 96.66% for the
              base model. Specialising costs general adherence.
            </li>
            <li className="mt-2">
              A DPO stage on synthetic preferences made the model worse — 19/60 against 54/60 —
              and is written up rather than buried.
            </li>
            <li className="mt-2">
              Liquid&rsquo;s agentic benchmarks (SWE-bench, BFCL, WebArena, τ³, RULER) need their
              harnesses and 128K serving. They were not reproduced and no claim is made about them.
            </li>
          </ul>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Details</div>
        <div>
          <table className="paper-table">
            <tbody>
              <tr><td>Base model</td><td>LiquidAI/LFM3-1.7B</td></tr>
              <tr><td>Parameters</td><td>1.73B dense; 13.9M LoRA adapter</td></tr>
              <tr><td>Training</td><td>68,893 verified edits; one epoch on an A100</td></tr>
              <tr><td>Held out</td><td>httpx, starlette, httpcore</td></tr>
              <tr><td>Formats</td><td>PEFT adapter, GGUF Q4_K_M</td></tr>
              <tr><td>Licence</td><td>LFM Open License v1.0</td></tr>
            </tbody>
          </table>
          <p className="meta muted mt-6 mb-0">
            Every figure on this page comes from per-item result files published alongside the
            weights. <Link href="/research">How we run evaluations</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}

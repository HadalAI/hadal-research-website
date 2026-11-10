import Link from 'next/link';
import type { ReactNode } from 'react';

export type Post = {
  slug: string;
  title: string;
  kind: 'PAPER' | 'LAB NOTE';
  date: string;
  displayDate: string;
  authors: string;
  readingTime: string;
  summary: string;
  tags: string[];
  body: ReactNode;
  links: { label: string; href: string; external?: boolean }[];
};

const P = 'mt-5 font-serif text-[17px] leading-[1.68] text-ink/85';
const LEAD = 'font-serif text-[20px] leading-[1.55] text-ink';
const H2 = 'mt-12 border-t border-rule pt-5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted';
const H3 = 'mt-8 font-serif text-[21px] italic';
const UL = 'mt-5 list-disc space-y-2.5 pl-6 font-serif text-[17px] leading-[1.65] text-ink/85';
const CODE =
  'mt-6 overflow-x-auto border-l-2 border-accent/50 bg-paper-2 px-5 py-4 font-mono text-[12px] leading-[1.8] text-ink';
const NOTE = 'mt-8 border-l-2 border-accent pl-5 font-serif text-[15px] italic leading-relaxed text-muted';

function Table({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: string[][];
  caption: string;
}) {
  return (
    <figure className={`mt-8 ${head.length > 3 ? 'lg:-mx-16 xl:-mx-24' : ''}`}>
      <div className="overflow-x-auto border-t border-ink">
        <table
          className={`paper-table text-left ${head.length > 3 ? 'min-w-[660px]' : 'min-w-[300px]'}`}
        >
          <thead>
            <tr className="border-b hairline">
              {head.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={j === 0 ? 'text-ink' : 'tabular text-muted'}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 font-serif text-[13.5px] leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}

export const POSTS: Post[] = [
  {
    slug: 'changing-one-word',
    title: 'Changing one word: how anchor direction breaks list indexing',
    kind: 'PAPER',
    date: '2026-10-27',
    displayDate: '27 October 2026',
    authors: 'Muhammad Ammar Imran',
    readingTime: '9 pages',
    summary:
      'Ask for the middle of a list from the beginning and from the end. Same item, same ordinal, one word different. On Qwen2.5-1.5B-Instruct that one word costs 33 points of accuracy — and the loss depends on how the question is phrased.',
    tags: ['long context', 'positional retrieval', 'paired analysis', 'small models'],
    links: [
      {
        label: 'Paper (PDF, 9 pages)',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study/blob/main/paper/anchor_word_v6.pdf',
        external: true,
      },
      {
        label: 'Novelty audit',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study/blob/main/paper/novelty_audit.pdf',
        external: true,
      },
      {
        label: 'Code, records, manifests',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study',
        external: true,
      },
    ],
    body: (
      <>
        <p className={LEAD}>
          A model that can find the fifth item of a list from the front may still fail to find the
          same item from the back. That asymmetry is well known. What is less clear is where it comes
          from, because in an ordinary forward/backward comparison two things change at once: the
          model counts in a different direction <em>and</em> it has to compute an offset it cannot
          simply read.
        </p>
        <p className={P}>
          At the midpoint of an odd-length list the confound disappears. “5th from the beginning” and
          “5th from the end” name the same item, at the same ordinal, for the same list. The only
          difference between the prompts is the anchor word. This paper tests that contrast on a
          single small model, with paired items and a decision rule fixed in advance.
        </p>

        <h2 className={H2}>The contrast</h2>
        <pre className={CODE}>
{`Items:    L, O, J, M, R, P, N, K, Q
Question: What item is at the 5th position from the beginning?   →  R

Items:    L, O, J, M, R, P, N, K, Q
Question: What item is at the 5th position from the end?         →  R`}
        </pre>
        <p className={P}>
          Scoring is a single forward pass over the letters of that list, so the uniform baseline is
          1/L — 11.1% at L=9 — not 1/26. Each cell holds 24 lists, and every comparison is paired by
          item: the same list is asked both ways, so the difference is within-item.
        </p>

        <h2 className={H2}>What was measured</h2>
        <ul className={UL}>
          <li>
            <span className="text-ink">Model.</span> Qwen2.5-1.5B-Instruct, with a 0.5B control,
            both run in float32 on CPU.
          </li>
          <li>
            <span className="text-ink">Design.</span> 24-item cells, paired by item, across list
            set (two seeds), measurement mode (forced choice and free generation), length (L = 7, 9,
            11) and three question templates.
          </li>
          <li>
            <span className="text-ink">Statistics.</span> Exact McNemar tests and Newcombe
            method-10 intervals for paired proportions, computed from the 2×2 counts.
          </li>
          <li>
            <span className="text-ink">Decision rule.</span> A ±15 percentage-point practical
            margin and the 24-item cell size were fixed before the midpoint runs. The 95% interval
            method was not; it was adopted in v5 and corrected in v6, after the data existed. The
            paper says so, and keeps a correction log.
          </li>
        </ul>

        <h2 className={H2}>Results</h2>
        <p className={P}>
          Backward minus forward accuracy, paired by item. Negative means the backward wording is
          worse. Rows are backward correct/incorrect by forward correct/incorrect.
        </p>
        <Table
          head={['cell', '2×2', 'fwd %', 'bwd %', 'Δ pp', '95% CI', 'exact p', 'verdict']}
          rows={[
            ['L=9 · 71 · forced', '[[4,0],[8,12]]', '50', '17', '−33.3', '[−51.2, −11.6]', '0.00781', 'margin not cleared'],
            ['L=9 · 71 · generate', '[[4,0],[8,12]]', '50', '17', '−33.3', '[−51.2, −11.6]', '0.00781', 'margin not cleared'],
            ['L=9 · 101 · forced', '[[4,0],[9,11]]', '54', '17', '−37.5', '[−55.2, −14.8]', '0.00391', 'margin not cleared'],
            ['L=7 · 101 · forced', '[[2,0],[6,16]]', '33', '8', '−25.0', '[−44.3, −5.0]', '0.03125', 'margin not cleared'],
            ['L=11 · 101 · forced', '[[2,2],[3,17]]', '21', '17', '−4.2', '[−24.5, +16.3]', '1.00000', 'no reduction'],
            ['L=9 · 101 · word ordinal', '[[3,6],[2,13]]', '21', '38', '+16.7', '[−7.2, +38.2]', '0.28906', 'no reduction'],
            ['L=9 · 101 · counting', '[[0,3],[3,18]]', '12', '12', '0.0', '[−21.3, +21.3]', '1.00000', 'no headroom'],
            ['qwen05 · L=9 · 101', '[[0,3],[0,21]]', '0', '12', '+12.5', '[−3.5, +31.0]', '0.25000', 'no headroom'],
            ['qwen05 · L=7 · 101', '[[0,2],[0,22]]', '0', '8', '+8.3', '[−6.7, +25.8]', '0.50000', 'no headroom'],
          ]}
          caption="Full grid, v6; cells without a model prefix are Qwen2.5-1.5B-Instruct. Intervals are Newcombe method 10 with the n/2 covariance correction. “Margin not cleared” means the interval excludes zero but its upper end sits above the −15 pp practical margin. A cell whose forward accuracy is below 15% has no headroom and is not evidence either way."
        />

        <h2 className={H2}>What the data supports — and what it does not</h2>
        <p className={P}>
          Four cells show a reduction whose interval excludes zero: −33.3, −33.3, −37.5 and −25.0
          points. None of them clears the 15-point practical margin — their upper ends are −11.6,
          −11.6, −14.8 and −5.0. So the supported claim is about sign, not size:
        </p>
        <p className={`${P} text-ink`}>
          In this model, with this wording, changing the anchor word alone reduces accuracy. This
          study cannot bound the size of that reduction below 15 points.
        </p>
        <p className={P}>
          Those two claims are kept as separate verdicts in every table, because they are separate
          claims. Collapsing them into “a 33-point drop” would be true of the estimate and false of
          the interval.
        </p>

        <h3 className={H3}>The effect depends on the template</h3>
        <p className={P}>
          Both wording cells ran on the same 24 lists, so each item contributes both effects. The
          baseline effect is −37.50 points, the word-ordinal paraphrase is +16.67 points, and their
          interaction is −54.17 points (95% CI [−79.17, −33.33], exact permutation p = 0.00048828,
          i.e. 2/4096). The paraphrase changes several things at once — “What” to “Which”, the digit
          to a word, a dropped clause — so this is an anchor × question-template interaction, not a
          digit-versus-word effect. It was specified after the baseline cells existed, and is
          labelled exploratory.
        </p>
        <p className={P}>
          At L=11 the contrast is −4.2 points (95% CI [−24.5, +16.3]): no reduction detected at this
          sample size, and the interval still admits a penalty of about twenty points. Length
          generalisation is therefore not established, only not contradicted.
        </p>

        <div className={NOTE}>
          <p>
            <span className="mono-label">Not claimed </span>
            a general direction effect; a mixture of two mechanisms; anything about frontier models;
            priority over prior work on prompt sensitivity, which is real and predates this study.
          </p>
        </div>

        <h2 className={H2}>Reproducing it</h2>
        <p className={P}>
          The analysis path imports only the Python standard library — no numpy, no scipy, nothing to
          install. <code className="font-mono text-[13px] text-ink">recompute_v5.py</code>{' '}
          regenerates every interval and verdict from the raw JSONL in under a second. The repository
          ships the raw records, the per-item indicators, a timestamped correction log, a novelty
          audit, and a SHA-256 manifest that verifies byte-for-byte. Regenerating on a different libm
          can shift an interval endpoint by ~1e-16; compare with a tolerance, not byte equality.
        </p>
        <p className={P}>
          Code is MIT; paper, docs and data are CC BY 4.0. It is an unpublished manuscript — not peer
          reviewed — and no priority claim is made.
        </p>
      </>
    ),
  },
  {
    slug: 'cpu-only-small-model-experiments',
    title: 'What a CPU-only host can and cannot tell you',
    kind: 'LAB NOTE',
    date: '2026-10-27',
    displayDate: '27 October 2026',
    authors: 'Hadal Research',
    readingTime: '4 min read',
    summary:
      'The study above ran on two vCPUs and no GPU. That constraint is part of the method, not a footnote — it sets the model scale, the number of cells, and what the results are allowed to claim.',
    tags: ['method', 'reproducibility', 'compute'],
    links: [
      {
        label: 'Environment record',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study/blob/main/docs/ENVIRONMENT.md',
        external: true,
      },
      {
        label: 'Paper (PDF)',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study/blob/main/paper/anchor_word_v6.pdf',
        external: true,
      },
    ],
    body: (
      <>
        <p className={LEAD}>
          A lab note on the machine behind <Link href="/blog/changing-one-word" className="link">Changing One Word</Link>,
          because the hardware explains most of the design choices in it.
        </p>

        <h2 className={H2}>The host</h2>
        <Table
          head={['item', 'value']}
          rows={[
            ['CPU', '2 vCPU · Neoverse-N1 (aarch64)'],
            ['RAM', '11.9 GB'],
            ['GPU', 'none'],
            ['precision', 'float32 on CPU throughout'],
            ['model', 'Qwen2.5-1.5B-Instruct + 0.5B control'],
            ['analysis deps', 'none — standard library only'],
          ]}
          caption="From docs/ENVIRONMENT.md in the study repository."
        />

        <h2 className={H2}>What the host can carry</h2>
        <p className={P}>
          At 4 bytes per parameter, a 1.5B model is about 6 GB of weights before any activations or
          KV cache. On 11.9 GB with no GPU that is the practical ceiling — not a preference. A 7B
          model does not fit, and a quantised 7B would change the thing being measured. So the study
          is a 1.5B study, with a 0.5B control, and it says so rather than implying a family-wide
          result.
        </p>
        <p className={P}>
          One trap is worth recording: the 1.5B checkpoint ships in bfloat16, and loading it with{' '}
          <code className="font-mono text-[13px] text-ink">dtype=float32</code> doubles peak
          allocation and sends the machine into swap. The checkpoint has to be converted to float32
          on disk first. Without that step the run either fails or takes long enough to be abandoned
          mid-grid — which produces a partial grid, not a result.
        </p>

        <h2 className={H2}>Why the analysis path has no dependencies</h2>
        <p className={P}>
          The interval routine is the part of a small study most likely to be wrong, and the least
          likely to be read. Keeping the reported path to the standard library means a reader can
          run it on any machine with Python 3.10+ and get the same numbers in under a second.
          statsmodels was installed separately to cross-check the interval implementation; it is not
          required to reproduce a single reported figure. That separation is the point: a
          dependency-free path is one you can actually check.
        </p>
        <p className={P}>
          It also made the v6 correction possible. When the Newcombe routine was found to be missing
          its n/2 covariance term and failing on zero marginals, the correction changed verdicts in
          the paper. The correction log records what changed, and the regenerated tables come out of
          the same raw records — nothing was re-run at the model to make the numbers agree.
        </p>

        <h2 className={H2}>What it cannot tell you</h2>
        <p className={P}>
          Twenty-four items per cell is enough to establish a sign and not enough to bound a size.
          Nine cells with uncorrected comparisons are probes, not a confirmatory design. One model
          family, one position, one wording family. Every one of those limits is stated in the paper
          rather than left for the reader to infer, because a small result that is honest about its
          scope is more useful than a large claim that cannot be rebuilt.
        </p>
      </>
    ),
  },
];

export function postBySlug(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function sortedPosts() {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

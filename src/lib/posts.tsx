import Link from 'next/link';
import Term from '@/components/term';
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

const P = 'mt-5 text-[17.5px] leading-[1.72]';
const LEAD = 'text-[20px] leading-[1.58] text-ink';
const H2 = 'mt-12';
const H3 = 'mt-8 font-serif text-[18px] font-semibold';
const UL = 'mt-5 list-disc space-y-2 pl-5 text-[17.5px] leading-[1.7]';
const CODE =
  'mt-6 overflow-x-auto border-l-2 border-rule bg-[rgba(28,93,90,0.05)] px-5 py-4 font-mono text-[12.5px] leading-[1.75] text-ink';
const NOTE = 'mt-8 border-l-2 border-rule pl-4 text-[16px] leading-[1.7] text-muted';

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
      <div className="doodle-table-wrap">
        <table
          className={`paper-table text-left ${head.length > 3 ? 'min-w-[660px]' : 'min-w-[300px]'}`}
        >
          <thead>
            <tr>
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
    slug: 'one-slot',
    title: 'One slot is all you need: structural protection in tiny KV caches',
    kind: 'PAPER',
    date: '2026-11-26',
    displayDate: '26 November 2026',
    authors: 'Kyssta',
    readingTime: '9 min',
    summary:
      'A 2026 result says that if you reserve 10% of the KV cache at each end of the prompt, the eviction policy barely matters. It was measured at one capacity, C = 256, and its four-slot floor leaves no content at C = 8. We swept the protection fraction from 0 to 50% at capacities of 8 to 256 tokens on two sub-1B models. The law does not break — it strengthens: protection is worth +5.78 nats/token for LRU at C = 8 against +2.37 at C = 256, and the entire effect at C ≤ 16 is the retention of one token, position 0, which carries 37% of the answer’s attention mass.',
    tags: ['KV cache', 'eviction', 'attention sinks', 'small models', 'inference'],
    links: [
      { label: 'Paper (PDF, 15 pages)', href: '/papers/one-slot-tiny-kv-cache.pdf', external: true },
      {
        label: 'Code, raw logs and tables',
        href: '/papers/one-slot-tiny-kv-cache-supplementary.zip',
        external: true,
      },
    ],
    body: (
      <>
        <p className={LEAD}>
          Every cached token you keep is a token you cannot keep. At a cache of eight slots the
          accounting is brutal, and the published rule for protecting a cache was never tested there.
          We tested it. The rule survives — but the thing that does the work is smaller than the rule.
        </p>
        <p className={P}>
          A transformer answering a question from a long passage keeps a key-value cache of every
          prompt token. On a device, or at a long context, that cache is the binding memory cost, so
          the standard move is to evict: keep a subset, drop the rest. Which subset is a large
          literature — recency, accumulated attention, observation windows, learned scores.
        </p>
        <p className={P}>
          Garcia (2026, arXiv:2605.18053) argued that this is the wrong first question. In a
          globally capped harness he found that every policy he tested collapses without{' '}
          <em>structural protection</em> — a fixed reservation at the prompt boundaries — and that
          once the boundaries are guarded, the differences between scorers shrink to hundredths of an
          F1 point. His recommendation: reserve 10% of capacity at each end, with a floor of four
          slots per side.
        </p>

        <h2 className={H2}>The rule is arithmetically empty at C = 8</h2>
        <p className={P}>
          Content left for the passage is{' '}
          <code className="font-mono text-[13px] text-ink">C − 2·max(⌈ρC⌉, 4)</code>. With the
          published floor of four per side, that is <em>zero</em> at C = 8 for every fraction, and at
          most eight at C = 16. The paper that proposed the rule said an absolute budget “may suffice
          at large C and could avoid over-allocating protection”, and left the question open. The
          protection sweep behind the 10% default was a single-capacity curve: five fractions,
          measured with LRU at C = 256.
        </p>
        <p className={P}>
          So the operating point that matters for a sub-1B model on a phone — a few dozen slots — was
          the one point the rule could not be applied to. That is the gap this study fills, and it is
          narrower than “small-model eviction is unstudied”, which would be false: 410M–1.5B models
          are calibrated in Xiang (2026, arXiv:2611.29006) and swept in Seregina (2026,
          arXiv:2611.02230). What had not been done is sweeping the protection <em>fraction</em>
          below C = 256, or reporting the capacity below which reservation stops paying.
        </p>

        <h2 className={H2}>What we measured</h2>
        <p className={P}>
          C ∈ {'{'}8, 16, 32, 64, 128, 256{'}'} × protection ρ ∈ {'{'}0, 0.05, 0.1, 0.2, 0.3, 0.5{'}'} ×
          six policies, on Qwen2.5-0.5B (23 items, 4,968 rows) and replicated on SmolLM2-360M (20
          items, 4,340 rows). One global retained set shared by every layer and KV head, the same
          accounting convention as the source study; we report the stream count (48 and 160) so a
          reader using per-head accounting can translate.
        </p>
        <p className={P}>
          The readout is the gold answer’s mean per-token log-probability under a cache that is{' '}
          <em>physically sliced</em> to the retained set, then teacher-forced. Slicing is exact here
          because these models store keys already rotated to absolute positions: deleting an entry
          deletes attention mass, not positional phase. Three checks passed before any measurement:
          sliced scoring against a from-scratch forward pass agrees to 2.5 × 10⁻⁵ nats, against an
          equivalent 4-D attention mask to 1.3 × 10⁻⁵, and prefill attention rows sum to 1.000. The
          harness has a free consistency check that also passes: StreamingLLM’s set is identical to
          LRU with four protected slots at C = 8, and both measure −9.970.
        </p>

        <h2 className={H2}>The law does not break</h2>
        <p className={P}>
          Our pre-registered hypothesis was the opposite of what we found. We expected protection to
          stop paying once the reservation ate a large share of a tiny budget. It pays <em>more</em>.
        </p>
        <Table
          head={['C', 'LRU', 'random', 'H2O', 'SnapKV']}
          rows={[
            ['8', '+5.78 [4.41, 7.12]', '+5.34 [4.17, 6.45]', '+1.04 [0.58, 1.55]', '+0.38 [0.01, 0.72]'],
            ['16', '+5.05 [3.43, 6.66]', '+5.81 [4.54, 7.02]', '+0.77 [0.28, 1.31]', '+0.40 [0.14, 0.70]'],
            ['32', '+4.12 [2.69, 5.53]', '+6.27 [4.88, 7.58]', '+0.90 [0.14, 1.78]', '+0.06 [−0.17, 0.28]'],
            ['64', '+3.54 [2.34, 4.70]', '+6.19 [4.36, 8.03]', '+0.92 [0.00, 1.90]', '−0.05 [−0.16, 0.02]'],
            ['128', '+3.50 [2.26, 4.72]', '+5.44 [4.00, 6.89]', '+0.60 [−0.22, 1.49]', '−0.01 [−0.03, 0.00]'],
            ['256', '+2.37 [1.41, 3.38]', '+4.70 [2.92, 6.67]', '+1.00 [0.26, 1.79]', '+0.25 [−0.22, 0.85]'],
          ]}
          caption="Protection gain in nats/token at the best tested fraction, Qwen2.5-0.5B, n = 23 items, paired bootstrap 95% intervals. StreamingLLM and the oracle are protection-independent by construction and omitted."
        />
        <p className={P}>
          The gain never vanishes and never reverses, and for the two policies that carry no attention
          signal it falls monotonically with capacity — the opposite of a crossover. The policy spread
          compresses hardest where the budget is tightest: 13.9× at C = 8 against 8.2× at C = 256, and
          on SmolLM2 18.5× against 5.5×. The replication moves every qualitative finding to a model
          with 3.3× the KV streams, a different tokenizer and a different family (LRU gain +7.35 at
          C = 8 down to +2.05 at C = 256).
        </p>

        <h2 className={H2}>It is one token</h2>
        <p className={P}>
          The mechanism is not a protected fraction. At C = 8, LRU with no protection keeps the eight
          most recent positions; LRU with one protected slot keeps position 0 plus the seven most
          recent. The two sets differ in exactly one element: position 0 replaces the eighth-most-recent
          token. That single swap is worth <strong>+5.78 nats/token</strong>, 76% of the entire
          unprotected-to-dense gap, and it moves retained attention mass from 0.179 to 0.516.
        </p>
        <Table
          head={['position set', 'median', 'mean', 'min', 'max']}
          rows={[
            ['position 0 alone', '0.363', '0.370', '0.291', '0.451'],
            ['first 4 positions', '0.369', '0.378', '0.296', '0.462'],
            ['first 8 positions', '0.371', '0.380', '0.303', '0.464'],
            ['question span (17–49 tokens)', '0.327', '0.331', '0.199', '0.494'],
            ['last 32 positions', '0.336', '0.342', '0.208', '0.511'],
            ['last 8 positions', '0.169', '0.185', '0.096', '0.336'],
          ]}
          caption="Share of the gold answer's prompt attention mass falling on each position set, over 24 Qwen items, measured without any eviction run. Position 0 alone carries 37%; positions 1–3 add 0.8 of a point; the whole first eight add 1.0."
        />
        <p className={P}>
          Second and third reserved slots buy nothing measurable for a recency policy: at C = 8 the
          gain is flat across k = 1…4 (+5.782, +5.707, +5.678, +5.749). The published 10% default is
          therefore safe but not tight, and below C ≈ 32 the fraction is quantized out of existence —
          at C = 8, ρ = 0.05 and ρ = 0.10 produce the same cache. What transfers is an absolute count:
          reserve position 0, reserve the suffix the scorer already keeps, do not scale the reservation
          with C.
        </p>

        <h2 className={H2}>What is left is information, not allocation</h2>
        <p className={P}>
          A future-query oracle — top-C positions by the gold answer’s own attention — fits the answer
          into eight slots, scoring −8.475 against a dense −8.082. That is a cache of eight slots
          working. No deployed policy finds those slots: the gap between the best deployed policy and
          the oracle grows from 0.19 nats at C = 256 to 1.08 at C = 8, and on SmolLM2 from −0.03 to
          0.92. The binding constraint at tiny caches is the absence of query information at eviction
          time, which is exactly the condition under which Haverbeck et al. (2026, NeurIPS) prove no
          compression rule can uniformly beat random selection. Better scoring of the prefill cannot
          close a gap that is definitionally about the future query.
        </p>
        <p className={P}>
          One consequence is a correction to how these results are usually reported. The oracle’s
          score is within 0.05 nats of the dense cache at every C ≥ 16 and better than dense on 10–11
          of 23 items: eviction can raise the gold answer’s likelihood by removing competing context.
          “Fraction of the dense ceiling recovered” is therefore not a valid metric for this readout,
          and we do not use it. Every comparison is to the oracle at the same capacity or to the
          unprotected policy at the same capacity.
        </p>

        <div className={NOTE}>
          <p>
            <span className="mono-label">Not claimed </span>
            an F1 or accuracy result; anything above 1B parameters, where a 1.5B replication was
            planned and not run (fp32 needs about 6.2 GB against 4.8 GB available); anything about
            contexts longer than ~1,050 tokens, dynamic re-eviction, or per-head retained sets;
            universality across architectures — both models here have strong persistent sinks, and
            sink-suppressed models (QK-normalisation, gated attention, learned sinks) weaken them, as
            Park et al. (2026, arXiv:2609.23314) show; priority over attention-sink work, which is
            where this mechanism comes from (Xiao et al., 2024).
          </p>
        </div>

        <h2 className={H2}>Prior art, checked at the mechanism</h2>
        <p className={P}>
          The claim we make is narrow and was checked against full texts, not titles: no study sweeps
          the structural-protection fraction below C = 256, and none reports the capacity below which
          reservation stops paying. A thirty-query sweep plus a re-check on the day of publication
          found two papers close enough to cite and delimit — Park et al. on sink-suppressed
          architectures, and Wyatt et al. (2026, arXiv:2611.31025) on sink protection in vision
          transformer pruning — and neither measures the quantity here. Where earlier work already
          owns a claim, the paper says so rather than restating it as new.
        </p>

        <h2 className={H2}>Reproducing it</h2>
        <p className={P}>
          Every number in the paper is generated from two raw JSONL files, one row per item × cell, by
          scripts that recompute each table and figure; nothing is transcribed by hand. The
          supplementary bundle carries the harness, the grid runner, the analysis, the figures, the raw
          logs and a SHA-256 manifest. Re-running the grid resumes and skips existing rows; item
          selection is deterministic (<code className="font-mono text-[13px] text-ink">random.Random(7)</code>{' '}
          over an <code className="font-mono text-[13px] text-ink">_id</code>-sorted pool) and the
          random policy is seeded per cell.
        </p>
        <p className={P}>
          Paper, code and data are CC BY 4.0. It is a preprint — not peer reviewed — and no priority
          claim is made beyond the regime statement above.
        </p>
      </>
    ),
  },

{
    slug: 'framing-newlines',
    title: 'Framing newlines: how tool-call parsers rewrite the files agents write',
    kind: 'PAPER',
    date: '2026-11-15',
    displayDate: '15 November 2026',
    authors: 'Kyssta',
    readingTime: '7 min',
    summary:
      'Every open-weights agent model writes file contents between one framing newline on each side. We rendered 1,762 real files as tool calls and parsed them back with five parsers: the format preserves 1,759, a .strip() parser preserves 15. Serving stacks get this right; agent clients re-deriving the parse get it wrong, and a benchmark that grades file contents scores a perfect model at 0.9%.',
    tags: ['tool use', 'evaluation', 'format design', 'agents'],
    links: [
      {
        label: 'Paper (PDF, 4 pages)',
        href: '/papers/framing-newlines.pdf?v=2',
        external: true,
      },
      {
        label: 'Code and raw results',
        href: 'https://github.com/HadalAI/hadal1/tree/main/experiments',
        external: true,
      },
    ],
    body: (
      <>
        <p className={LEAD}>
          A model that can drive a file editor still cannot reliably write a file, because the format it
          writes through — and the parser on the other side — decide whether the last byte survives.
          This is a measurement of that gap, on real files, with no model in the loop.
        </p>
        <p className={P}>
          Qwen, LFM3, Granite 4.2 and MiniMax all emit tool calls as XML in which each argument value
          sits between a framing newline on either side of its tag. It is a clean design: one newline
          per side, no escaping, values may span lines. It is also, as it turns out, the exact place
          where agents silently lose data.
        </p>

        <h2 className={H2}>The contrast</h2>
        <pre className={CODE}>
{`<tool_call>
<function=write_file>
<parameter=content>
VALUE
</parameter>
</function>
</tool_call>

one newline each side is framing — nothing else is`}
        </pre>
        <p className={P}>
          Remove exactly those two newlines and the format is invertible: we rendered 1,762 real files
          (Python sources, markdown, system configs, shell scripts) as <code>write_file</code> calls and
          1,759 came back byte-identical. The information is all there.
        </p>

        <h2 className={H2}>What was measured</h2>
        <ul className={UL}>
          <li>
            <span className="font-medium text-ink">Corpus.</span> 1,762 files, 26 MB, from a working
            developer machine. 99.1% of them end with a newline.
          </li>
          <li>
            <span className="font-medium text-ink">Parsers.</span> Five implementations: strict frame, the
            frame-plus-spaces fix a production agent SDK shipped this month, line-split,{' '}
            <code>.strip()</code>, and <code>.rstrip('\n')</code>.
          </li>
          <li>
            <span className="font-medium text-ink">Grading.</span> Exact string equality. No model, no GPU,
            no network — the whole experiment reruns in under a minute.
          </li>
        </ul>

        <h2 className={H2}>Results</h2>
        <Table
          head={['parser', 'preserved', 'corrupted', 'failure mode']}
          rows={[
            ['strict frame', '99.8%', '3', 'only files containing the terminator'],
            ['frame + spaces/tabs (shipped fix)', '99.1%', '15', 'single-line values still stripped'],
            ['line-split + right-trim', '98.9%', '19', 'trailing blank lines collapse'],
            ['.strip()', '0.9%', '1,747', 'final newline removed from every multiline file'],
            [".rstrip('\\n')", '0.0%', '1,762', 'removes frame and value newlines; adds a leading one'],
          ]}
          caption="Table 1. Payload fidelity of five parser implementations over 222 real files."
        />
        <p className={P}>
          On a task shaped like “write this file”, graded by exact content, the same perfect agent
          scores <strong>99.8%</strong> under a strict parser and <strong>0.9%</strong> under{' '}
          <code>.strip()</code>. A 99-point swing with no model involved — the benchmark would be
          measuring the parser and reporting it as model capability.
        </p>

        <h2 className={H2}>The second failure class</h2>
        <p className={P}>
          The format defines no escaping for its own terminator. A payload containing{' '}
          <code>&lt;/parameter&gt;</code> truncates at that point, and the remainder is parsed as
          additional parameters — so a file being written can change the call's <code>path</code>.
          Three files in our working tree contain the terminator; rendered through the format they
          returned at 3.0%, 11.3% and 5.2% of their original length.
        </p>

        <h2 className={H2}>This is not hypothetical</h2>
        <p className={P}>
          Two production systems reported exactly this, one week apart.{' '}
          <strong>OpenHands software-agent-sdk, PR #6451:</strong> “the parser then called{' '}
          <code>.strip()</code> on every <code>&lt;parameter=…&gt;</code> value … so a file_editor
          create wrote file_text without the first line's indentation or the final newline.” Their fix
          is the 97.3% row above. <strong>MTPLX issue #691:</strong> “a write whose content ends in{' '}
          <code>\n</code> arrives at the client without it”, and the next turn re-tokenises differently
          and drops out of the session bank — a prefix-cache miss caused by a parser.
        </p>
        <p className={P}>
          Neither quantifies reach, and we are not aware of a prior measurement of it. Both treat it as
          a bug in one adapter rather than a property of a format family used by most open agent models.
        </p>

        <h2 className={H2}>Where in the stack it happens</h2>
        <p className={P}>
          The reference server gets it right, explicitly. vLLM parses this same Qwen3 format with a helper
          called <code>_trim_wrapping_newlines</code>, whose docstring reads “strip one leading and one
          trailing newline (the Qwen3 template markup)”. That is the 100% row above. SGLang's Granite
          detector reaches the same result by scanning tags rather than trimming values.
        </p>
        <p className={P}>
          The loss therefore has an address: <strong>clients that re-derive the parse from template
          text</strong>. A server ships with the model's chat template and knows which newline is markup.
          An agent framework receives arguments as text and has to guess — and when it guesses with
          <code>.strip()</code>, it eats the payload. That asymmetry is also why the bug survives review:
          the server-side tests pass, because the server is correct.
        </p>

        <h2 className={H2}>Why benchmarks miss it</h2>
        <p className={P}>
          Tool-use benchmarks grade function names and short arguments — identifiers, numbers, enums —
          which whitespace trimming cannot hurt. The failure appears only when the argument is a
          document, which is what coding agents do all day. It also hides in benchmark design: our own
          tool-use suite generated write payloads without trailing newlines, deliberately, because
          teaching a trailing newline the format “could not express” seemed unfair. That instinct —
          avoid the case that breaks the harness — is how a systematic problem stays invisible.
        </p>

        <h2 className={H2}>Recommendation</h2>
        <ul className={UL}>
          <li>Parse by frame, not by whitespace: remove exactly one leading and one trailing newline.</li>
          <li>Escape or reject the terminator on emit; the format currently permits it and cannot represent it.</li>
          <li>Prefer JSON arguments where the transport allows; JSON's escaping is why this class does not exist there.</li>
          <li>Grade payload fidelity explicitly. A tool-use benchmark that never asks for a trailing newline cannot see any of this.</li>
        </ul>
        <p className={NOTE}>
          Limitations: 1,762 files from one machine, dominated by a Python standard library. We
          measure the format and the parsers, not the models; whether a given model emits the framing
          correctly is a separate question that needs GPU inference. Parser variants are
          reimplementations of documented behaviour, released with the results so the mapping can be
          checked line by line.
        </p>
      </>
    ),
  },
  {
    slug: 'changing-one-word',
    title: 'Changing one word: how anchor direction breaks list indexing',
    kind: 'PAPER',
    date: '2026-10-27',
    displayDate: '27 October 2026',
    authors: 'Kyssta',
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
            <span className="text-ink">Statistics.</span> Exact <Term k="mcnemar">McNemar</Term> tests and <Term k="ci">Newcombe</Term>
            method-10 intervals for paired proportions, computed from the 2×2 counts.
          </li>
          <li>
            <span className="text-ink">Decision rule.</span> A ±15 <Term k="pp">percentage-point</Term> practical
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
          interaction is −54.17 points (<Term k="ci">95% CI</Term> [−79.17, −33.33], exact permutation p = 0.00048828,
          i.e. 2/4096). The paraphrase changes several things at once — “What” to “Which”, the digit
          to a word, a dropped clause — so this is an anchor × question-template interaction, not a
          digit-versus-word effect. It was specified after the baseline cells existed, and is
          labelled exploratory.
        </p>
        <p className={P}>
          At L=11 the contrast is −4.2 points (<Term k="ci">95% CI</Term> [−24.5, +16.3]): no reduction detected at this
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

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

const P = 'mt-5 text-[19.5px] leading-[1.55]';
const LEAD = 'text-[21px] leading-[1.45] text-ink';
const H2 = 'mt-11 font-marker text-[23px] leading-tight text-ink';
const H3 = 'mt-7 font-marker text-[19px] leading-snug';
const UL = 'doodle-list mt-4 space-y-2.5 text-[19px] leading-[1.55]';
const CODE = 'code-doodle';
const NOTE = 'scrawl mt-8 pl-4 text-[19px] leading-snug';

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
      <figcaption className="mt-2 text-[16px] leading-snug text-pencil">{caption}</figcaption>
    </figure>
  );
}

export const POSTS: Post[] = [

{
    slug: 'edit-protocols',
    title: 'The blind window: how stale is the file an agent edits',
    kind: 'PAPER',
    date: '2026-11-16',
    displayDate: '16 November 2026',
    authors: 'Kyssta',
    readingTime: '8 min',
    summary:
      'Half of the 8,399 file writes in our agent logs went to files that existed but had never been opened in that session; where a read did come first, the median gap was 3.5 minutes and 14 tool calls, with a tail measured in hours. That is the window in which a formatter or a checkout can move the file under an edit. We pair it with a re-measurement of edit formats under drift, and with base rates: 3.42% of file changes in six mature repositories are whitespace-class.',
    tags: ['tool use', 'evaluation', 'editing', 'agents'],
    links: [
      { label: 'Paper (PDF)', href: '/papers/edit-protocols.pdf' },
      { label: 'Code & records', href: 'https://github.com/HadalAI/hadal1/tree/main/experiments/conformance', external: true },
    ],
    body: (
      <>
        <p className={LEAD}>
          An edit format decides what happens when the file is not the one the model read. Two of the
          common formats answer that by editing anyway — which earlier work already showed, and which we
          re-measured to see whether a formatter changes the picture.
        </p>

        <p className={NOTE}>
          Prior work: Althoubi, <i>Look Before You Leap</i> (arXiv:2609.11957) establishes the
          content-anchored versus location-anchored split on 640 edits; Wan et al. (preprints.org,
          Oct 2026) compare line ranges with search/replace across six models. This note is a replication
          and extension, not a new claim.
        </p>

        <p className={P}>
          A harness reads a file, the model proposes a change, the harness writes it. Between the read and
          the write the tree can move without the model knowing: a pre-commit hook reformats the file, a
          checkout converts line endings, an editor strips trailing whitespace. The SEARCH block no longer
          matches byte-for-byte, and what happens next is a policy the format has already chosen.
        </p>

        <h2 className={H2}>What we measured</h2>
        <ul className={UL}>
          <li><span className="text-ink">696 real source files</span> — Python, Markdown, JSON, shell and HTML from installed distributions, this lab's repositories and its skills tree.</li>
          <li><span className="text-ink">2,159 edits</span> whose target region a perturbation actually moved, across seven drifts including a real <code>black</code> reformat.</li>
          <li><span className="text-ink">Seven formats</span>: whole file, exact SEARCH/REPLACE, whitespace-insensitive SEARCH/REPLACE (ported from aider at a pinned commit), fuzzy SEARCH/REPLACE, unified diff, <code>apply_patch</code>, and a line-range patch.</li>
          <li><span className="text-ink">Three verdicts</span>: exact, applied-but-different, or refused. For Python we also compare the parsed syntax tree, because indentation is syntax.</li>
        </ul>

        <h2 className={H2}>Results</h2>
        <Table
          head={['format', 'exact', 'silent', 'program changed', 'refused']}
          rows={[
            ['whole file', '100%', '0%', '0%', '0%'],
            ['SEARCH/REPLACE, whitespace-insensitive', '34.0%', '0.3%', '0%', '65.6%'],
            ['SEARCH/REPLACE, fuzzy', '1.9%', '96.4%', '1.3%', '0.4%'],
            ['unified diff', '1.2%', '0.1%', '0%', '98.7%'],
            ['apply_patch', '1.9%', '0.2%', '0%', '98.0%'],
            ['line-range patch', '1.2%', '96.9%', '1.9%', '0%'],
            ['SEARCH/REPLACE, exact', '1.9%', '0.2%', '0%', '97.9%'],
          ]}
          caption="Table 1. Verdicts on 2,159 drifted edits. The program-change column is defined only for Python, so it is diluted by the non-Python share of the corpus; on Python edits alone, fuzzy matching changes the program in 4.5% of drifted cases and line ranges in 6.2%."
        />

        <h2 className={H2}>How wide is the window?</h2>
        <p className={P}>
          A format only matters if the agent is editing against a copy that has had time to change. We
          measured that from our own session stores: every file-writing tool call was matched to the most
          recent read of the same path in the same conversation.
        </p>
        <p className={P}>
          Of <span className="text-ink">8,399 writes</span>, <span className="text-ink">50.6%</span> went
          to files that exist on disk but had never been read in that session. Where a read did come first
          (2,936 cases), the median separation was <span className="text-ink">208 seconds and 14 tool
          calls</span>; the 75th percentile was 59 minutes, the 90th 3.4 hours. A third of matched edits
          came more than fifteen minutes after the last read, and a quarter more than an hour after.
        </p>
        <p className={NOTE}>
          Half of all edits are made blind by this count, and the window is minutes-to-hours, not seconds.
          The logs are this lab's own traffic — five session stores, one harness — so treat the shape as a
          pilot, not a population estimate.
        </p>

        <h2 className={H2}>Is the drift real?</h2>
        <p className={P}>
          Both the earlier work and our matrix assume the file has moved, so we measured how often that
          class of change actually occurs. Across 18,874 commits in six mature Python repositories
          (click, fastapi, flask, httpx, requests, rich), we diffed every changed file twice — once
          normally, once with whitespace ignored. A change that vanishes from the second diff is
          whitespace-class: reindentation, a trailing-whitespace strip, a line-ending conversion.
        </p>
        <p className={P}>
          <span className="text-ink">3.42% of file changes are that class</span> — roughly one in 29 —
          and 1.20% of commits are nothing else. Every repository is above 2%. Drift is routine in mature
          code, which is why a fail-open matcher will meet it.
        </p>
        <p className={NOTE}>
          That is a repository-life rate, not a per-session hazard: it says the change class is ordinary,
          not that it lands between an agent's read and its write. Instrumenting live sessions is the next
          experiment, and the one that would turn this into a risk estimate.
        </p>

        <h2 className={H2}>Why the split matters</h2>
        <p className={P}>
          The split is not about accuracy, it is about whether the format can fail. Exact matchers refuse a
          drifted edit — the agent sees an error and re-reads. Fuzzy matching and line ranges applied the
          edit in over 96% of drifted cases; neither ever refused.
        </p>

        <h2 className={H2}>Why it survives in practice</h2>
        <p className={P}>
          The per-edit failure rate looks small, which is exactly why nobody has had to fix it: most edits
          are short, indentation matters only near block boundaries, and a wrong line usually surfaces in
          the next test run. The number that matters is per session. An agent making a hundred edits in a
          reformatted tree expects a handful of silent changes, each reported as success.
        </p>
        <p className={P}>
          One corroboration: in current aider, the fuzzy fallback in <code>replace_most_similar_chunk</code>
          is unreachable — the function returns before it. Practitioners hit this and turned the format off,
          without publishing what they saw.
        </p>

        <h2 className={H2}>What a harness should do</h2>
        <ul className={UL}>
          <li>Match exactly, and treat zero or two matches as a failed turn.</li>
          <li>Never address lines: a line range is a bet that nothing above it changed.</li>
          <li>If you approximate, return the span you matched and the similarity you accepted, so the model can see it edited lines it never quoted.</li>
          <li>Re-read after any formatting pass rather than trusting the transcript's copy.</li>
        </ul>

        <p className={NOTE}>
          Preprint, not peer reviewed. The drift here is synthetic — seven plausible perturbations, not a
          sample of real sessions — and the fuzzy matcher is a representative implementation rather than one
          specific shipped build. Both are stated in the paper, and a field study of how often working trees
          move mid-session is the obvious next step.
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

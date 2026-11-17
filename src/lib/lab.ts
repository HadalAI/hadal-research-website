/**
 * Lab content — the single source for the public research pages.
 * Everything here is authored, not scraped: program status, publications, models.
 */

export type Status = 'ACTIVE' | 'PUBLISHED' | 'PLANNED' | 'IN PREPARATION';

export type Program = {
  id: string;
  slug: string;
  title: string;
  status: Status;
  lead: string;
  summary: string;
  approach: string[];
  outputs?: { label: string; href: string; external?: boolean }[];
};

export const PROGRAMS: Program[] = [
  {
    id: '01',
    slug: 'long-context',
    title: 'Long-context behaviour',
    status: 'PUBLISHED',
    lead: 'When a model mis-indexes a list, what exactly did it get wrong?',
    summary:
      'Long-context failures are usually reported as one aggregate score. We isolate a single variable at a time on paired items, holding the item and the ordinal fixed, so a difference between two prompts can only come from the thing we changed. The result so far is a paired test of anchor direction at the midpoint of a list, where the two questions differ by one word.',
    approach: [
      'Design contrasts where one word — or one template — is the only difference between two otherwise identical prompts.',
      'Fix the practical margin before the run, then report sign and size as separate claims.',
      'Publish the analysis path with no third-party dependencies, so every interval can be regenerated from the raw records.',
    ],
    outputs: [
      {
        label: 'Changing One Word — paper (v6, Oct 2026)',
        href: '/blog/changing-one-word',
      },
    ],
  },
  {
    id: '02',
    slug: 'measurement',
    title: 'Measurement',
    status: 'PUBLISHED',
    lead: 'What would make a small-model result worth believing?',
    summary:
      'A tool-use score is reported as accuracy over function names and arguments, and those arguments are usually short identifiers. When the argument is a document instead, what gets measured stops being the model: rendering 1,762 real files through the XML tool-call framing and parsing them back with five implementations moves the reported number between 99.8% and 0.9%, with no model in the loop. The same question applies to every vocabulary we use to report an effect.',
    approach: [
      'Grade by executing the call and inspecting the result, not by matching its text.',
      'State the parser, the framing rule and the decoding settings next to every number, because they are part of the measurement.',
      'Ship the predictions and the harness, so a reader can recompute the score instead of trusting it.',
    ],
    outputs: [
      {
        label: 'Framing Newlines — paper (Nov 2026)',
        href: '/blog/framing-newlines',
      },
    ],
  },
];

export type Model = {
  id: string;
  name: string;
  status: Status;
  description: string;
  specs: [string, string][];
  notes?: string;
};

export const MODELS: Model[] = [
  {
    id: 'hadal-1',
    name: 'HADAL-1',
    status: 'PLANNED',
    description:
      'The first lab model: a hybrid attention / state-space stack at roughly one billion parameters, trained on the lab scheduler and evaluated against the long-context probes in program 01.',
    specs: [
      ['ARCHITECTURE', 'HYBRID ATTENTION + STATE-SPACE'],
      ['TARGET SCALE', '~1B PARAMETERS'],
      ['PRECISION', 'BF16 / FP32 EVAL'],
      ['STATUS', 'DESIGN — NO RUNS YET'],
    ],
    notes: 'No weights exist. Nothing from this program has been released.',
  },
];

export type Publication = {
  slug: string;
  title: string;
  authors: string;
  date: string;
  displayDate: string;
  version: string;
  venue: string;
  status: string;
  abstract: string;
  bibtex: string;
  links: { label: string; href: string; external?: boolean }[];
};

export const PUBLICATIONS: Publication[] = [
  {
    slug: 'framing-newlines',
    title: 'Framing Newlines: how tool-call parsers rewrite the files agents write',
    authors: 'Kyssta',
    date: '2026-11-15',
    displayDate: '15 NOVEMBER 2026',
    version: 'v1',
    venue: 'PREPRINT \u00b7 NOT PEER REVIEWED',
    status: 'PUBLISHED',
    abstract:
      'Every open-weights agent model that emits tool calls in the Qwen/LFM3 XML framing writes each parameter value between one newline on either side. We rendered 1,762 real files as write_file calls and parsed them back with five parser implementations found in shipped code. Parsed by frame the format is invertible: 1,759 of 1,762 files return byte-identical, and the three failures contain the unescaped terminator. Parsed with .strip(), 15 survive. On a benchmark that grades file contents, a perfect model therefore scores 0.9% under the dominant client-side parser and 99.8% under the rule the reference server implementation uses \u2014 a 99-point swing with no model in the loop.',
    bibtex:
      '@misc{kyssta2026framingnewlines, title = {Framing Newlines: how tool-call parsers rewrite the files agents write}, author = {Kyssta}, year = {2026}, note = {Preprint. Not peer reviewed.}, url = {https://hadal.run/blog/framing-newlines}}',
    links: [
      { label: 'Read on the blog', href: '/blog/framing-newlines' },
      { label: 'Paper (PDF)', href: '/papers/framing-newlines.pdf?v=2' },
      {
        label: 'Code & records',
        href: 'https://github.com/HadalAI/hadal1/tree/main/experiments',
        external: true,
      },
    ],
  },
  {
    slug: 'changing-one-word',
    title: 'Changing One Word: a paired test of anchor direction in list indexing',
    authors: 'Kyssta',
    date: '2026-10-27',
    displayDate: '27 OCTOBER 2026',
    version: 'v6',
    venue: 'PREPRINT · NOT PEER REVIEWED',
    status: 'PUBLISHED',
    bibtex:
      '@misc{kyssta2026changingoneword, title = {Changing One Word: a paired test of anchor direction in list indexing}, author = {Kyssta}, year = {2026}, note = {Preprint, v6. Not peer reviewed.}, url = {https://github.com/okyssta/llm-midpoint-anchor-study}}',
    abstract:
      'For an odd-length list, the middle item can be requested two ways that name the same item at the same ordinal: “5th position from the beginning” and “5th position from the end”. Only the anchor word differs. On Qwen2.5-1.5B-Instruct with 9-item lists, the backward wording reduces accuracy by 33.3 percentage points (paired difference −33.3 pp, 95% CI [−51.2, −11.6], exact McNemar p = 0.00781), and the estimated effect differs between the two question templates tested. The reduction is established; the pre-specified 15-point practical margin is not cleared.',
    links: [
      { label: 'Read on the blog', href: '/blog/changing-one-word' },
      {
        label: 'Paper (PDF)',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study/blob/main/paper/anchor_word_v6.pdf',
        external: true,
      },
      {
        label: 'Code & records',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study',
        external: true,
      },
    ],
  },
];

export function programBySlug(slug: string) {
  return PROGRAMS.find((p) => p.slug === slug);
}

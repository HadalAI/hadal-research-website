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
    slug: 'hybrid-architectures',
    title: 'Hybrid architectures',
    status: 'ACTIVE',
    lead: 'How much attention does a small model actually need?',
    summary:
      'A transformer spends its quadratic budget on token mixing in every block. Linear-attention and state-space mixers are cheaper, but they are not interchangeable with attention on every task. We are mapping which layers need real attention — induction, copying, in-context retrieval — and which can be replaced without a measurable loss at 0.5B–1.5B parameters.',
    approach: [
      'Layer-wise ablation: replace attention with a linear or recurrent mixer one block at a time, holding tokenizer, data order and optimiser fixed.',
      'Evaluate each ablation on targeted probes — induction heads, exact copy, in-context retrieval — rather than on aggregate perplexity alone.',
      'Report paired per-item differences. A hybrid can win on the mean and lose on the tasks that motivated the change.',
    ],
  },
  {
    id: '02',
    slug: 'long-context',
    title: 'Long-context behaviour',
    status: 'PUBLISHED',
    lead: 'When a model mis-indexes a list, what exactly did it get wrong?',
    summary:
      'Long-context failures are usually reported as one aggregate score. We isolate a single variable at a time on paired items, holding the item and the ordinal fixed, so a difference between two prompts can only come from the thing we changed. The first result from this program is a paired test of anchor direction at the midpoint of a list.',
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
      {
        label: 'Code, records and manifests',
        href: 'https://github.com/okyssta/llm-midpoint-anchor-study',
        external: true,
      },
    ],
  },
  {
    id: '03',
    slug: 'measurement',
    title: 'Measurement',
    status: 'ACTIVE',
    lead: 'What would make a small-model result worth believing?',
    summary:
      'Most claims in this corner of the field are single-run point estimates on a single model. We fix the practical margin before the run, use exact paired tests, keep the analysis script importable with the standard library alone, and maintain a correction log when the statistics change. A result that cannot be recomputed from the raw records is treated as not yet established.',
    approach: [
      'Pre-specify the decision rule separately from the analysis method, and say which of the two was fixed in advance.',
      'Prefer paired designs: same item, same target, one prompt difference.',
      'Ship the negative results. A cell that shows no effect is part of the result.',
    ],
  },
  {
    id: '04',
    slug: 'retrieval-geometry',
    title: 'Retrieval geometry',
    status: 'PLANNED',
    lead: 'Where does positional information live in a hybrid stack?',
    summary:
      'If a recurrent layer carries position implicitly and an attention layer carries it explicitly, a hybrid should hold two different notions of “where”. This program looks for that split with probes and ablations, and asks whether the split helps or hurts long-range retrieval. No runs have started.',
    approach: [
      'Probe positional and ordinal structure inside each layer type, at matched parameter counts.',
      'Compare retrieval failure modes across hybrid ratios, not just final accuracy.',
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
      'The first lab model: a hybrid attention / state-space stack at roughly one billion parameters, trained on the lab scheduler and evaluated against the long-context probes in program 02.',
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
  links: { label: string; href: string; external?: boolean }[];
};

export const PUBLICATIONS: Publication[] = [
  {
    slug: 'changing-one-word',
    title: 'Changing One Word: a paired test of anchor direction in list indexing',
    authors: 'Muhammad Ammar Imran',
    date: '2026-10-27',
    displayDate: '27 OCTOBER 2026',
    version: 'v6',
    venue: 'PREPRINT · NOT PEER REVIEWED',
    status: 'PUBLISHED',
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

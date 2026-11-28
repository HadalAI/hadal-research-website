import Link from 'next/link';
import BarChart from '@/components/bar-chart';

export const metadata = {
  title: 'Qori-OCR',
  description:
    'A 3.13M-parameter CTC word recogniser: 4.05 MB as int8, 11.4 ms per crop on one x86 core, and 69.9% cleansed accuracy on 5,722 held-out crops — published with the benchmark it loses.',
  alternates: { canonical: '/models/qori-ocr' },
  openGraph: {
    type: 'article',
    title: 'Qori-OCR — a 3.13M recogniser, measured against the compact state of the art',
    description:
      '3.13M parameters, 4.05 MB int8, 11.4 ms on one x86 core. On identical crops, a 1.11M PP-OCRv6 tiny is 8.3 points more accurate and 2.2× faster.',
    url: '/models/qori-ocr',
    siteName: 'Hadal Research',
  },
  twitter: {
    card: 'summary',
    title: 'Qori-OCR — small, fast, and not yet accurate enough',
    description:
      'Every number on this page is measured on the same 5,722 crops, including the two baselines that beat it on both size and accuracy.',
  },
};

/**
 * Release page for Qori-OCR. The headline is the negative result: the run met its size and
 * latency bounds and missed the accuracy target, so the page leads with the comparison rather
 * than the parameters.
 */
export default function QoriOcrPage() {
  return (
    <main className="sheet">
      <section className="row pt-10 pb-0">
        <div className="hang">
          <Link href="/models" className="muted">
            ← Models
          </Link>
        </div>
        <div>
          <h1 className="page-title">Qori-OCR</h1>
          <p className="lede mt-5 mb-0 max-w-[34rem]">
            A 3.13M-parameter CTC word recogniser trained from scratch on 300k synthetic crops and
            6,106 real ones. It is small (4.05 MB as int8) and quick (11.4 ms per crop on one x86
            core). It is also less accurate than recognisers a third of its size — this page shows
            both, because the second half is the interesting part.
          </p>
          <p className="meta mt-5 mb-0 flex flex-wrap gap-x-5 gap-y-2">
            <a href="https://huggingface.co/kyssta/Qori-OCR" target="_blank" rel="noreferrer">
              weights (ONNX, fp32 + int8)
            </a>
            <a
              href="https://huggingface.co/kyssta/Qori-OCR/blob/main/BENCHMARK_REPORT.pdf"
              target="_blank"
              rel="noreferrer"
            >
              benchmark report
            </a>
            <a
              href="https://huggingface.co/kyssta/Qori-OCR/blob/main/ocr_infer.py"
              target="_blank"
              rel="noreferrer"
            >
              inference example
            </a>
          </p>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Result</div>
        <div>
          <p className="muted m-0 max-w-[34rem]">
            Word accuracy on the held-out crop sets, greedy CTC, no lexicon, no beam search.
            Every bar in a chart was produced on the same images with the same transform and the
            same decoder, so the comparison is like-for-like rather than two papers&rsquo; tables.
          </p>

          <div className="mt-8 grid gap-9">
            <BarChart
              heading="IIIT-5K — 3,000 word crops"
              rows={[
                { label: 'PP-OCRv6 small', value: 96.5 },
                { label: 'PP-OCRv5 en', value: 95.3 },
                { label: 'PP-OCRv6 tiny', value: 88.5 },
                { label: 'Qori-OCR', value: 79.7, tone: 'us' },
              ]}
            />
            <BarChart
              heading="SVT — 647 word crops"
              rows={[
                { label: 'PP-OCRv6 small', value: 92.1 },
                { label: 'PP-OCRv5 en', value: 89.8 },
                { label: 'PP-OCRv6 tiny', value: 81.1 },
                { label: 'Qori-OCR', value: 77.3, tone: 'us' },
              ]}
            />
            <BarChart
              heading="ICDAR-2015 — 2,075 word crops"
              rows={[
                { label: 'PP-OCRv6 small', value: 78.4 },
                { label: 'PP-OCRv5 en', value: 75.6 },
                { label: 'PP-OCRv6 tiny', value: 62.4 },
                { label: 'Qori-OCR', value: 53.3, tone: 'us' },
              ]}
            />
          </div>

          <p className="muted mt-8 mb-0 max-w-[34rem]">
            Paired on individual crops, Qori-OCR is ahead on 243 and behind on 718 relative to
            PP-OCRv6 tiny, which has 1.11M parameters and ships in 4.46 MB. Against PP-OCRv6 small
            the overall gap is 19.6 points. The advantage the design was aiming for — smaller than
            the smallest high-precision recogniser with equal accuracy — was not reached: Qori-OCR
            is smaller than SVTRv2-T&rsquo;s 5.13M, but it is not in that accuracy class.
          </p>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Size and speed</div>
        <div>
          <p className="muted m-0 max-w-[34rem]">
            Where it does hold up is the budget. Single thread, one x86 core, batch 1, ONNX
            Runtime; sizes are the released files.
          </p>
          <table className="paper-table mt-6">
            <tbody>
              <tr><td>Parameters</td><td>3,126,864 after 30.4% structured pruning (4,492,032 before)</td></tr>
              <tr><td>Disk, int8</td><td>4.05 MB static int8 · 7.69 MB dynamic int8 · 11.99 MB fp32</td></tr>
              <tr><td>Latency, x86 1t</td><td>9.9 ms dynamic int8 · 11.4 ms static int8 · 16.8 ms fp32 (4.49M)</td></tr>
              <tr><td>For scale</td><td>PP-OCRv6 small 25.4 ms / 21.2 MB · PP-OCRv6 tiny 5.1 ms / 4.46 MB</td></tr>
              <tr><td>Input</td><td>3×48×320, aspect preserved, 8 px per CTC step, ≤ 40 characters</td></tr>
              <tr><td>Charset</td><td>96 classes: 95 printable ASCII, case-sensitive</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Limits</div>
        <div>
          <p className="muted m-0 max-w-[34rem]">
            Measured, not hedged. A release page that only lists wins is not worth reading.
          </p>
          <ul className="muted mt-5 max-w-[34rem] list-disc pl-5 leading-relaxed">
            <li className="mt-2">
              Accuracy is the headline miss: 69.9% cleansed word accuracy against 89.4% for a
              5.27M model and 78.2% for a 1.11M one, on the identical crops.
            </li>
            <li className="mt-2">
              Static int8 is platform-dependent. The same 4.05 MB graph measures 69.5–69.8% on
              aarch64 and 63.9% on the x86 container used for the training run; the fp32 graph
              reproduces exactly on both. Measure it on the target before shipping it.
            </li>
            <li className="mt-2">
              ASCII only, crops only, no detection and no rotation correction — it recognises a
              word or short line you have already cropped.
            </li>
            <li className="mt-2">
              1,314 of its 1,338 case-only errors are uppercase references emitted in mixed or lower
              case. Uppercasing predictions lifts case-sensitive exact match from 45.8% to 69.2%,
              but that is a convention, not a capability.
            </li>
            <li className="mt-2">
              Weakest on short, clean words — 77.8% on 1–3 character labels against 85.2% for
              PP-OCRv6 tiny — which reads as a data-budget signature: 306k training crops against
              the tens of millions the PP-OCR series uses. Distillation from PP-OCRv6 small was
              planned and not run; 84.2% of current predictions are within one edit of the
              reference, which is the headroom a teacher or a lexicon would target.
            </li>
          </ul>
        </div>
      </section>

      <section className="row">
        <div className="hang">§ Details</div>
        <div>
          <table className="paper-table">
            <tbody>
              <tr><td>Architecture</td><td>Depthwise MetaFormer (RepDW mixers, four late attention blocks), BiGRU neck, CTC head</td></tr>
              <tr><td>Training</td><td>300,000 MJSynth + 6,106 real crops; 82,854 steps + 8 epochs; one T4; $0.92 billed</td></tr>
              <tr><td>Validation</td><td>CER 0.1789, 65.5% exact match on 615 held-out crops</td></tr>
              <tr><td>Held out</td><td>IIIT-5K 3,000 · SVT 647 · ICDAR-2015 2,075</td></tr>
              <tr><td>Formats</td><td>ONNX fp32, dynamic int8, static int8 (QOperator)</td></tr>
              <tr><td>Runtime</td><td>onnxruntime + numpy + pillow; no torch, no paddle</td></tr>
              <tr><td>Licence</td><td>Research use; training crops carry ICDAR/SVT/IIIT-5K research terms</td></tr>
            </tbody>
          </table>
          <p className="meta muted mt-6 mb-0">
            Every figure here comes from per-crop predictions published with the weights. The full
            protocol, error analysis and the optimisation ladder are in the{' '}
            <a
              href="https://huggingface.co/kyssta/Qori-OCR/blob/main/BENCHMARK_REPORT.pdf"
              target="_blank"
              rel="noreferrer"
            >
              benchmark report
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

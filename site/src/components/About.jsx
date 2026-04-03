import { useScrollReveal } from '../utils/useScrollReveal';
import './About.css';

export default function About() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="about section-padded reveal" id="about">
      <div className="about-inner">
        <h2 className="section-title">The black box is the product.</h2>
        <div className="about-body">
          <p>
            Existing routers expose model choice and don't improve. Existing optimization platforms are tools for engineers who understand the levers. Slancha is neither.
          </p>
          <p>
            Behind a single API endpoint, Slancha runs a closed loop: route requests to the right model, analyze task patterns, fine-tune smaller specialist models on your actual usage, optimize inference with quantization and GPU packing, and redeploy — continuously, with zero customer involvement.
          </p>
          <ul className="about-reasons">
            <li><strong>The router captures the easy wins</strong> — a small model handles summarization identically to GPT-4. Stop overpaying.</li>
            <li><strong>Fine-tuning captures the hard wins</strong> — task-specific models match or outperform frontier generalists on your workloads.</li>
            <li><strong>The loop compounds</strong> — the longer you use Slancha, the more data is curated, the better your models get. That advantage is yours alone.</li>
          </ul>
          <p>
            If a customer wanted to replicate this internally, they'd need to build routing, task classification, data curation, fine-tuning pipelines, quantization-aware training, MIG-based serving, and continuous redeployment. That's a full ML engineering team. World-class AI inference shouldn't require a world-class infrastructure team. Slancha closes that gap.
          </p>
        </div>
      </div>
    </section>
  );
}

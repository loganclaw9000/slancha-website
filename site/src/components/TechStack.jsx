import { useScrollReveal } from '../utils/useScrollReveal';
import './TechStack.css';

const pills = ["vLLM", "Aurelio Semantic Router", "PagedAttention", "QAT (4-bit)", "MIG on B200/B300", "Multi-Token Prediction"];

export default function TechStack() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="tech-stack reveal">
      <p className="tech-label">POWERED BY</p>
      <h2 className="tech-heading">Best-in-class open-source infrastructure</h2>
      <p className="tech-body">
        vLLM with PagedAttention for memory-efficient serving. Aurelio's semantic router for sub-millisecond
        task classification. Quantization-aware training to 4-bit precision. NVIDIA MIG for GPU packing.
        Multi-token prediction for throughput. You bring the API calls. We handle the stack.
      </p>
      <div className="tech-pills">
        {pills.map(tool => (
          <span className="tech-pill" key={tool}>{tool}</span>
        ))}
      </div>
      <p className="tech-footer">One endpoint. Everything behind it, continuously improving.</p>
    </section>
  );
}

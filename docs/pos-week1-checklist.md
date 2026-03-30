# Prompt Optimization System - Week 1 Implementation Checklist

**Goal:** Complete foundation work (DSPy + MIPROv2 integration)
**Owner:** [agent:claude] subagent
**Timeline:** 7 days
**Start Date:** March 30, 2026

---

## Day 1-2: Environment Setup

### ✅ Task 1.1: Create Dedicated Workspace
- [ ] Create `/home/admin/.openclaw/workspace-pos` directory
- [ ] Initialize git repo with `[agent:pos]` prefix
- [ ] Create `requirements.txt` with:
  - `dspy-ai>=2.5.0`
  - `fastapi>=0.110.0`
  - `uvicorn[standard]>=0.27.0`
  - `sqlalchemy>=2.0.0`
  - `psycopg2-binary>=2.9.0`
  - `redis>=5.0.0`
  - `apscheduler>=3.10.0`
  - `pydantic>=2.0.0`
- [ ] Create `Dockerfile` for POS API
- [ ] Create `.env.example` with all required vars

### ✅ Task 1.2: Install & Configure DSPy
- [ ] Install DSPy in new workspace: `pip install -U dspy-ai`
- [ ] Test DSPy installation with toy example
- [ ] Configure LM provider (start with local/vllm for cost efficiency)
- [ ] Document LM config in `configs/lm_config.yaml`
- [ ] Create `tests/test_dspy_setup.py` with basic sanity checks

### ✅ Task 1.3: Database Schema
- [ ] Install PostgreSQL 16 locally or create Docker container
- [ ] Create database: `pos_db`
- [ ] Create schema in `schema/001_init.sql`:
  ```sql
  CREATE TABLE optimized_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type VARCHAR(100) NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    quality_score FLOAT NOT NULL,
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    used_in_optimizations INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    metadata JSONB
  );
  
  CREATE TABLE prompt_eval_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_version VARCHAR(100) NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    validation_set_id VARCHAR(100) NOT NULL,
    metrics JSONB NOT NULL,
    evaluated_at TIMESTAMP DEFAULT NOW(),
    model_used VARCHAR(100),
    optimizer_run_id VARCHAR(100),
    compared_to_baseline BOOLEAN DEFAULT FALSE,
    baseline_id VARCHAR(100)
  );
  
  CREATE TABLE prompt_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type VARCHAR(100) NOT NULL,
    version INTEGER NOT NULL,
    prompt_text TEXT NOT NULL,
    few_shot_examples JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(50) NOT NULL,
    optimization_run_id VARCHAR(100),
    metrics_at_creation JSONB,
    baseline_id VARCHAR(100),
    ab_test_id VARCHAR(100),
    deployed_to TEXT[],
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMP
  );
  
  CREATE TABLE optimization_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type VARCHAR(100) NOT NULL,
    start_time TIMESTAMP DEFAULT NOW(),
    end_time TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    num_trials INTEGER,
    best_score FLOAT,
    improvement_percent FLOAT,
    result_artifact_path VARCHAR(500)
  );
  
  CREATE TABLE signal_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    captured_at TIMESTAMP DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE
  );
  
  -- Indexes
  CREATE INDEX idx_examples_task_quality ON optimized_examples(task_type, quality_score DESC);
  CREATE INDEX idx_eval_metrics ON prompt_eval_records(task_type, evaluated_at DESC);
  CREATE INDEX idx_registry_active ON prompt_registry(task_type, is_active);
  ```
- [ ] Create SQLAlchemy models in `models/` directory
- [ ] Test database connection from Python

### ✅ Task 1.4: Redis Setup
- [ ] Install Redis locally or create Docker container
- [ ] Configure for:
  - Example cache (TTL: 1 week)
  - Signal event queue (streams)
  - A/B test routing state
- [ ] Create `configs/redis_config.yaml`
- [ ] Test Redis connection

---

## Day 3-4: Core Implementation

### ✅ Task 2.1: Example Repository
- [ ] Create `repositories/example_repository.py`:
  ```python
  class ExampleRepository:
      async def add_example(
          self,
          task_type: str,
          input: str,
          output: str,
          quality_score: float,
          source: str,
          metadata: dict
      ) -> str
      
      async def query(
          self,
          task_type: str,
          queries: list[str],
          k: int,
          min_quality: float = 0.7,
          limit: int = 50
      ) -> list[OptimizedExample]
      
      async def increment_usage(self, example_id: str)
      
      async def get_high_quality_pool(
          self,
          task_type: str,
          min_quality: float = 0.8,
          limit: int = 100
      ) -> list[OptimizedExample]
  ```
- [ ] Implement with SQLAlchemy
- [ ] Add unit tests
- [ ] Add integration tests with real DB

### ✅ Task 2.2: MIPROv2 Wrapper
- [ ] Create `optimizers/pos_optimizer.py`:
  ```python
  class PosOptimizer:
      """
      Slancha's wrapper around DSPy MIPROv2
      """
      
      def __init__(
          self,
          task_model: dspy.LM,
          target_model: dspy.LM,
          example_repo: ExampleRepository,
          metric_fn: Callable,
          max_bootstrapped_demos: int = 50,
          num_candidates: int = 30,
          seed: int = 42
      )
      
      async def optimize(
          self,
          task_signature: dspy.Signature,
          trainset: list[dict],
          task_type: str,
          optimization_id: str = None
      ) -> OptimizedProgram
      
      def _bootstrap_examples(
          self,
          task_type: str,
          trainset: list[dict]
      ) -> list[dict]
      
      def _evaluate(self, program, valset) -> dict
  ```
- [ ] Test with toy dataset (10 examples)
- [ ] Verify MIPROv2 runs end-to-end
- [ ] Add logging for optimization steps

### ✅ Task 2.3: Task Signatures
- [ ] Create `signatures/model_eval.py`:
  ```python
  class ModelEvalSignature(dspy.Signature):
      """Evaluate model performance on a workload"""
      workload_description: str = dspy.InputField()
      model_outputs: dict = dspy.InputField()
      metrics: list[str] = dspy.InputField()
      recommendation: str = dspy.OutputField(desc="pass/fail with reasoning")
  ```
- [ ] Create `signatures/deploy_decision.py`
- [ ] Create `signatures/post_train_config.py`
- [ ] Write basic test cases for each signature
- [ ] Document expected inputs/outputs

### ✅ Task 2.4: Metric Functions
- [ ] Create `metrics/metrics.py`:
  ```python
  def model_eval_accuracy(output, expected) -> float:
      """Check if recommendation matches ground truth"""
      return 1.0 if output.recommendation == expected else 0.0
  
  def deploy_decision_success(output, expected) -> float:
      """Check if deployment decision matches actual outcome"""
      return 1.0 if output.deployment_recommendation == expected else 0.0
  
  def post_train_improvement(output, expected) -> float:
      """Check if config leads to expected improvement"""
      return 1.0 if output.improvement >= expected else 0.0
  ```
- [ ] Add unit tests
- [ ] Document metric design choices

---

## Day 5-6: API & Integration

### ✅ Task 3.1: FastAPI Backend
- [ ] Create `api/main.py`:
  ```python
  app = FastAPI(title="Slancha Prompt Optimizer API")
  
  @app.post("/api/examples/")
  async def create_example(example: ExampleCreate):
      """Add example to repository"""
      
  @app.get("/api/examples/{task_type}")
  async def get_examples(task_type: str, k: int = 50):
      """Get high-quality examples for task type"""
      
  @app.post("/api/optimize/")
  async def run_optimization(opt_request: OptimizationRequest):
      """Trigger MIPROv2 optimization"""
      
  @app.get("/api/optimizations/{optimization_id}")
  async def get_optimization_result(optimization_id: str):
      """Get optimization results"""
      
  @app.get("/api/prompts/{task_type}/latest")
  async def get_latest_prompt(task_type: str):
      """Get current active prompt"""
  ```
- [ ] Add request/response Pydantic models
- [ ] Add error handling
- [ ] Add API docs (/docs endpoint)
- [ ] Test with Postman/curl

### ✅ Task 3.2: Signal Capture
- [ ] Create `events/signal_capture.py`:
  ```python
  class SignalCapture:
      async def on_eval_completed(self, event: EvalCompletedEvent):
          """Capture evaluation signal"""
          # Store examples, metrics
          pass
      
      async def on_deployment_event(self, event: DeploymentEvent):
          """Capture deployment signal"""
          pass
      
      async def on_post_training_event(self, event: PostTrainingEvent):
          """Capture post-training signal"""
          pass
  ```
- [ ] Create event schemas in `schemas/events.py`
- [ ] Set up Redis Streams for event queue
- [ ] Test event ingestion

### ✅ Task 3.3: Optimizer CLI
- [ ] Create `cli/optimize.py`:
  ```python
  @click.command()
  @click.option("--task-type", required=True)
  @click.option("--num-trials", default=100)
  @click.option("--force", is_flag=True)
  async def optimize(task_type, num_trials, force):
      """CLI to run optimization manually"""
  ```
- [ ] Test CLI with toy data
- [ ] Add progress reporting
- [ ] Add JSON output for automation

### ✅ Task 3.4: Logging & Monitoring
- [ ] Set up structured logging (JSON format)
- [ ] Add metrics collection (Prometheus format)
- [ ] Create `metrics/optimization_metrics.py`:
  ```python
  optimization_duration = Histogram(...)
  cost_per_optimization = Histogram(...)
  prompt_improvement_rate = Gauge(...)
  ```
- [ ] Add to FastAPI middleware
- [ ] Test metrics export

---

## Day 7: Testing & Documentation

### ✅ Task 4.1: Unit Tests
- [ ] Test ExampleRepository (mock DB)
- [ ] Test PosOptimizer (mock DSPy)
- [ ] Test metric functions
- [ ] Test API endpoints (TestClient)
- [ ] Coverage target: >80%

### ✅ Task 4.2: Integration Tests
- [ ] End-to-end optimization run
- [ ] Signal capture → optimization pipeline
- [ ] Database persistence
- [ ] Redis caching

### ✅ Task 4.3: Documentation
- [ ] README.md with setup instructions
- [ ] API documentation (/docs + OpenAPI spec)
- [ ] Architecture diagram (draw.io or mermaid)
- [ ] Contributing guidelines
- [ ] Troubleshooting guide

### ✅ Task 4.4: Docker & Deployment
- [ ] Dockerfile for API
- [ ] Docker Compose for full stack (API + DB + Redis)
- [ ] Test local deployment with `docker-compose up`
- [ ] Create deployment manifest for production

### ✅ Task 4.5: Week 1 Demo
- [ ] Prepare 10 real examples for toy task
- [ ] Run MIPROv2 optimization
- [ ] Show before/after prompts
- [ ] Measure improvement
- [ ] Document results

---

## Success Criteria for Week 1

**Must have:**
- [ ] DSPy + MIPROv2 runs end-to-end
- [ ] Can optimize prompts on toy task
- [ ] Example repository works (CRUD)
- [ ] API responds to requests
- [ ] Results stored in database
- [ ] Demo shows measurable improvement

**Nice to have:**
- [ ] A/B testing basic implementation
- [ ] Dashboard for metrics
- [ ] CI/CD pipeline

---

## Notes for Subagent

1. **Use the spec:** Reference `docs/prompt-optimization-spec.md` for architecture
2. **Ask questions:** If anything is unclear, ping me in the group chat
3. **Keep it simple:** Don't over-engineer Week 1. Get something working first.
4. **Document decisions:** Add notes to `NOTES.md` for each task
5. **Commit often:** Use `[agent:pos]` prefix on all commits
6. **Test as you go:** Don't wait until end to test
7. **Cost awareness:** Use local vllm models when possible, not paid APIs

---

## Resources

- [DSPy Documentation](https://dspy.ai/)
- [MIPROv2 Paper](https://arxiv.org/abs/2406.11695)
- [Slancha Spec](docs/prompt-optimization-spec.md)
- [Week 1 Checklist](docs/pos-week1-checklist.md)

---

**Start command:**
```bash
cd /home/admin/.openclaw/workspace-pos
git init
# Then follow checklist above
```

**Report back:** After each major milestone, send update to the group chat.

---

**End of Checklist**

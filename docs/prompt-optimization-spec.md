# Slancha Prompt Optimization System - Technical Specification

**Version:** 1.0  
**Date:** March 30, 2026  
**Status:** Approved for Implementation  
**Owner:** [agent:claw]  

---

## Executive Summary

Slancha's Prompt Optimization System (POS) will implement **automated, continuous prompt optimization** using Stanford's DSPy framework and MIPROv2 optimizer. This creates a self-reinforcing competitive moat where:

- Prompts improve automatically as production data accumulates
- Cost per optimization is ~10-100x lower than manual engineering
- System gets better with every pilot customer (data flywheel)
- Competitors must manually tune prompts; we automate it

**Goal:** Deploy a production-ready optimization pipeline within 6 weeks that pilots can see and benefit from from Day 1.

---

## Technical Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SLANCHA PROMPT OPTIMIZATION SYSTEM              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  DATA LAYER  │    │  OPTIMIZER   │    │   DEPLOYMENT LAYER   │  │
│  │              │    │              │    │                      │  │
│  │ • Example    │───▶│ • MIPROv2    │───▶│ • Prompt Registry    │  │
│  │   Repository │    │ • Bootstrap  │    │ • Version Control    │  │
│  │ • Eval       │    │ • Bayesian   │    │ • A/B Testing        │  │
│  │   Metrics    │    │   Search     │    │ • Auto-Deploy        │  │
│  │ • Signal     │    │ • Credit     │    │ • Rollback           │  │
│  │   Capture    │    │   Assignment │    │                      │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         ▲                   ▲                     │                 │
│         │                   │                     │                 │
│         └───────────────────┼─────────────────────┘                 │
│                             │                                       │
│                    ┌────────▼────────┐                              │
│                    │  SCHEDULER      │                              │
│                    │  (Cron/Event)   │                              │
│                    │  - Daily/Weekly │                              │
│                    │  - On-Demand    │                              │
│                    │  - Trigger: New │                              │
│                    │    Data Arrives │                              │
│                    └─────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Layer

#### 1. Example Repository

**Purpose:** Store few-shot examples for bootstrapping

**Schema:**
```python
class OptimizedExample(BaseModel):
    id: str
    task_type: str  # e.g., "model-eval", "deploy-decision", "post-train-config"
    input: str
    output: str
    quality_score: float  # 0-1, derived from eval metrics
    source: str  # "manual", "bootstrap", "production"
    created_at: datetime
    used_in_optimizations: int  # counter for popularity
    last_used_at: datetime
    metadata: dict  # task context, model used, etc.
```

**Storage:** PostgreSQL (with JSONB for metadata) or Redis for hot cache

**Access Pattern:**
- Write: On eval completion, post-train success, manual curation
- Read: During MIPROv2 bootstrap phase (k-nearest neighbor retrieval)

#### 2. Evaluation Metrics Store

**Purpose:** Track prompt performance across time

**Schema:**
```python
class PromptEvalRecord(BaseModel):
    id: str
    prompt_version: str
    task_type: str
    validation_set_id: str
    metrics: dict  # {"accuracy": 0.92, "f1": 0.89, "latency_ms": 145}
    evaluated_at: datetime
    model_used: str
    optimizer_run_id: str  # links to optimization job
    compared_to_baseline: bool
    baseline_id: str
```

**Metrics to Track:**
- **Primary:** Task-specific (accuracy, F1, ROUGE, etc.)
- **Secondary:** Cost (token usage), Latency (inference time)
- **Tertiary:** Stability (variance across runs)

#### 3. Signal Capture Pipeline

**Purpose:** Automatically capture production signal from Slancha's core loop

**Events to Capture:**
```python
# After model evaluation
class EvalCompletedEvent:
    model_name: str
    workloads_tested: list[Workload]
    winnner_model: str
    winnner_score: float
    prompt_used: str
    output_quality: dict

# After deployment decision
class DeploymentEvent:
    model_deployed: str
    reason: str  # "eval_winner", "cost_optimized", "latency_optimized"
    performance_delta: dict

# After post-training
class PostTrainingEvent:
    model_id: str
    training_data_size: int
    performance_improvement: float
    signal_captured: bool
```

**Implementation:** Event-driven via message queue (Redis Streams or Kafka)

---

### Optimizer Layer

#### 1. MIPROv2 Integration Wrapper

**Purpose:** Encapsulate Stanford's MIPROv2 with Slancha-specific configuration

**Core Component:** `PosOptimizer` class

```python
class PosOptimizer:
    """
    Slancha Prompt Optimizer using DSPy MIPROv2
    """
    
    def __init__(
        self,
        task_model: LM,           # The model used for optimization (can be different from target)
        target_model: LM,         # The model we're optimizing prompts for
        example_repo: ExampleRepository,
        metric_fn: Callable,      # Task-specific evaluation function
        max_bootstrapped_demos: int = 50,
        max_labeled_demos: int = 100,
        num_candidates: int = 30,
        num_trials: int = 100,
        seed: int = 42
    ):
        self.task_model = task_model
        self.target_model = target_model
        self.example_repo = example_repo
        self.metric_fn = metric_fn
        self.miprov2 = dspy.MIPROv2(
            metric=metric_fn,
            num_candidates=num_candidates,
            max_bootstrapped_demos=max_bootstrapped_demos,
            max_labeled_demos=max_labeled_demos,
            seed=seed
        )
    
    def optimize(
        self,
        task_signature: dspy.Signature,
        trainset: list[dict],
        task_type: str,
        valset: list[dict] = None,
        optimization_id: str = None
    ) -> OptimizedProgram:
        """
        Run MIPROv2 optimization for a specific task type
        
        Returns:
            OptimizedProgram with:
            - Best instruction prompt
            - Best few-shot examples
            - Performance metrics
            - Optimization metadata
        """
        
        # Step 1: Bootstrap few-shot examples from repository
        demo_candidates = self._bootstrap_examples(
            task_type=task_type,
            trainset=trainset,
            min_quality=0.7  # only use high-quality examples
        )
        
        # Step 2: Run MIPROv2
        best_program = self.miprov2.compile(
            student=dspy.Predict(task_signature),
            trainset=trainset,
            valset=valset or trainset[:20],
            num_trials=100,
            seed=self.seed
        )
        
        # Step 3: Record results
        result = OptimizedProgram(
            program=best_program,
            instruction=best_program.instructions,
            examples=demo_candidates,
            metrics=self._evaluate(best_program, valset),
            optimization_id=optimization_id or self._generate_id(),
            task_type=task_type
        )
        
        self._save_result(result)
        return result
    
    def _bootstrap_examples(
        self,
        task_type: str,
        trainset: list[dict],
        min_quality: float = 0.7
    ) -> list[dict]:
        """
        Retrieve high-quality examples from repository
        Uses semantic similarity + quality scoring
        """
        queries = [item['input'] for item in trainset]
        examples = self.example_repo.query(
            task_type=task_type,
            queries=queries,
            k=50,
            min_quality=min_quality
        )
        return examples
```

#### 2. Task-Specific Optimizers

We'll need different optimizers for each Slancha task type:

**a) Model Eval Prompt Optimizer**
```python
class ModelEvalSignature(dspy.Signature):
    """Evaluate model performance on a workload"""
    workload_description: str = dspy.InputField()
    model_outputs: dict = dspy.InputField()
    metrics: list[str] = dspy.InputField()
    recommendation: str = dspy.OutputField(desc="pass/fail with reasoning")

# Optimization target: Maximize agreement with human eval
```

**b) Deploy Decision Optimizer**
```python
class DeployDecisionSignature(dspy.Signature):
    """Decide whether to deploy a model"""
    eval_results: dict = dspy.InputField()
    cost_constraints: dict = dspy.InputField()
    latency_constraints: dict = dspy.InputField()
    deployment_recommendation: str = dspy.OutputField(
        desc="deploy/hold/wait-for-more-data with reasoning"
    )

# Optimization target: Maximize deployment success rate
```

**c) Post-Training Config Optimizer**
```python
class PostTrainConfigSignature(dspy.Signature):
    """Generate post-training configuration"""
    signal_data: dict = dspy.InputField()
    base_model: str = dspy.InputField()
    training_objective: str = dspy.InputField()
    config: dict = dspy.OutputField(desc="learning_rate, batch_size, epochs, etc.")

# Optimization target: Maximize post-training improvement
```

#### 3. Scheduler & Orchestration

**Purpose:** Coordinate when and how often to run optimizations

**Configuration:**
```yaml
optimization_schedule:
  model_eval_prompt:
    frequency: "daily"  # Run every 24 hours
    trigger:
      - "new_eval_data"  # On new evaluation data
      - "weekly_cron"    # Always run weekly
    min_data_points: 50  # Don't run if not enough data
    valset_size: 20
  
  deploy_decision_prompt:
    frequency: "weekly"
    trigger:
      - "deployment_event"
      - "weekly_cron"
    min_data_points: 20
  
  post_train_config_prompt:
    frequency: "on_demand"
    trigger:
      - "post_training_event"
    min_data_points: 100
```

**Implementation:**
```python
class OptimizationScheduler:
    def __init__(self, config: dict):
        self.config = config
        self.scheduler = APScheduler()
    
    def register_optimization(
        self,
        task_type: str,
        signature: dspy.Signature,
        optimizer: PosOptimizer
    ):
        """Register an optimization job"""
        
        @self.scheduler.job(
            trigger=self._get_trigger(task_type),
            id=f"opt_{task_type}"
        )
        async def run_optimization():
            # Check min data points
            if not self._has_enough_data(task_type):
                logger.info(f"Not enough data for {task_type}")
                return
            
            # Run optimization
            result = await self._run_optimization(
                task_type=task_type,
                signature=signature,
                optimizer=optimizer
            )
            
            # Evaluate and compare
            if result.metrics['improvement'] > 0.05:
                await self._deploy_if_better(result)
            else:
                await self._archive_result(result)
    
    async def _deploy_if_better(self, result: OptimizedProgram):
        """Deploy new prompt if it beats baseline by threshold"""
        baseline = await self._get_baseline(result.task_type)
        
        if result.metrics['improvement'] > 0.05:
            # A/B test first
            await self._start_ab_test(
                control=baseline,
                treatment=result,
                duration_hours=24
            )
            
            if await self._ab_test_won(result):
                await self._deploy_to_production(result)
```

---

### Deployment Layer

#### 1. Prompt Registry

**Purpose:** Versioned storage of all optimized prompts

**Schema:**
```python
class PromptRegistry(BaseModel):
    id: str
    task_type: str
    version: int
    prompt_text: str
    few_shot_examples: list[dict]
    created_at: datetime
    created_by: str  # "miprov2_auto" or "human"
    optimization_run_id: str
    metrics_at_creation: dict
    baseline_id: str
    ab_test_id: str | None
    deployed_to: list[str]  # ["staging", "production"]
    is_active: bool
    deployed_at: datetime | None
```

**API Endpoints:**
```python
# GET /api/prompts/{task_type}/latest
# Returns: Current active prompt for task type

# POST /api/prompts/{task_type}/ab-test
# Body: {
#   "treatment_id": "opt_123",
#   "duration_hours": 24,
#   "traffic_split": 0.5
# }

# POST /api/prompts/{task_type}/deploy
# Body: {
#   "prompt_id": "opt_123",
#   "environment": "production"
# }

# GET /api/prompts/{task_type}/history
# Returns: All versions with metrics over time
```

#### 2. A/B Testing Infrastructure

**Purpose:** Safely validate new prompts before full deployment

```python
class ABTestManager:
    async def start_test(
        self,
        control_prompt: PromptVersion,
        treatment_prompt: PromptVersion,
        task_type: str,
        traffic_split: float = 0.5,
        duration_hours: int = 24
    ) -> ABTest:
        """
        Start A/B test between control and treatment prompts
        Routes traffic based on hash(user_id) % 100 < split*100
        """
        test = ABTest(
            id=self._generate_id(),
            task_type=task_type,
            control=control_prompt,
            treatment=treatment_prompt,
            traffic_split=traffic_split,
            started_at=datetime.now(),
            ends_at=datetime.now() + timedelta(hours=duration_hours),
            metrics={
                "control": {"requests": 0, "success_rate": 0, "avg_latency": 0},
                "treatment": {"requests": 0, "success_rate": 0, "avg_latency": 0}
            }
        )
        
        await self.db.insert(test)
        return test
    
    async def record_request(self, test_id: str, group: str, success: bool, latency_ms: int):
        """Record metrics for A/B test"""
        await self.db.increment(
            test_id,
            group,
            {"requests": 1, "success_rate": success, "avg_latency": latency_ms}
        )
    
    async def get_winner(self, test_id: str) -> str | None:
        """Determine if there's a statistically significant winner"""
        test = await self.db.get(test_id)
        
        # Statistical significance test (z-test for proportions)
        control_rate = test.metrics["control"]["success_rate"]
        treatment_rate = test.metrics["treatment"]["success_rate"]
        n_control = test.metrics["control"]["requests"]
        n_treatment = test.metrics["treatment"]["requests"]
        
        p_value = self._z_test(control_rate, treatment_rate, n_control, n_treatment)
        
        if p_value < 0.05 and abs(treatment_rate - control_rate) > 0.03:
            return "treatment" if treatment_rate > control_rate else "control"
        return None
```

#### 3. Auto-Deployment Pipeline

**Purpose:** Zero-downtime prompt updates

```python
class DeploymentPipeline:
    async def deploy_to_environment(
        self,
        prompt_version: PromptVersion,
        environment: str,  # "staging" or "production"
        task_type: str
    ):
        """
        Deploy prompt to environment with:
        1. Pre-deployment validation
        2. Gradual rollout (10% → 50% → 100%)
        3. Health checks at each stage
        4. Automatic rollback if metrics degrade
        """
        
        # Step 1: Validate
        if not await self._validate_prompt(prompt_version):
            raise ValidationError("Prompt failed validation")
        
        # Step 2: Gradual rollout
        for percentage in [10, 50, 100]:
            await self._update_routing(
                task_type=task_type,
                environment=environment,
                prompt_id=prompt_version.id,
                percentage=percentage
            )
            
            # Wait and monitor
            await asyncio.sleep(60 * 5)  # 5 minutes
            metrics = await self._get_health_metrics(task_type, environment)
            
            if metrics['error_rate'] > 0.02 or metrics['latency_p99'] > 500:
                # Rollback
                await self._rollback(task_type, environment)
                raise DeploymentError("Health check failed, rolling back")
        
        # Step 3: Mark as deployed
        prompt_version.deployed_to.append(environment)
        prompt_version.deployed_at = datetime.now()
        await self.db.update(prompt_version)
```

---

## Technology Stack

### Core Frameworks

| Component | Technology | Why |
|-----------|-----------|-----|
| Prompt Optimization | **DSPy** (Stanford) | MIPROv2, declarative, self-improving |
| Backend | **Python 3.11+** | DSPy is Python-first |
| Database | **PostgreSQL 16** | Relational + JSONB for metadata |
| Cache | **Redis 7** | Hot example retrieval, feature store |
| Message Queue | **Redis Streams** | Event-driven signal capture |
| Scheduler | **APScheduler** | Cron + event triggers |
| API | **FastAPI** | Async, type-safe, auto-docs |
| Orchestration | **Prefect** or **Airflow** | Workflow orchestration |

### Infrastructure

```yaml
services:
  pos-api:
    build: ./pos-api
    ports:
      - "8080:8080"
    env:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
      - DSPY_LM=anthropic/claude-3-5-sonnet-20241022
  
  pos-worker:
    build: ./pos-worker
    depends_on:
      - pos-api
      - redis
    env:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
  
  pos-scheduler:
    build: ./pos-scheduler
    cron:
      - "0 * * * *"  # Hourly check
      - "0 0 * * *"  # Daily full optimization
```

---

## Implementation Timeline

### Week 1-2: Foundation

**Deliverables:**
- [ ] DSPy installed and configured
- [ ] PostgreSQL schema created
- [ ] Basic `PosOptimizer` wrapper implemented
- [ ] Example repository CRUD API
- [ ] MIPROv2 integration tests

**Success Criteria:**
- Can run MIPROv2 on a toy task end-to-end
- Examples stored and retrieved with quality scoring
- Optimizer logs results to database

**Owner:** [agent:claude] (subagent)

### Week 3-4: Integration

**Deliverables:**
- [ ] Signal capture events defined
- [ ] Event ingestion pipeline (Redis Streams)
- [ ] Task-specific signatures for 3 core tasks
- [ ] Scheduler implementation
- [ ] Prompt Registry API

**Success Criteria:**
- Production events trigger optimization jobs
- 3 task types have working optimizers
- Scheduler runs daily optimization

**Owner:** [agent:claude] (subagent)

### Week 5-6: Production Readiness

**Deliverables:**
- [ ] A/B testing infrastructure
- [ ] Auto-deployment pipeline with rollback
- [ ] Dashboard for optimization metrics
- [ ] Documentation (internal + pilot-facing)
- [ ] Performance benchmarks

**Success Criteria:**
- A/B test runs with statistical significance
- Deployment has zero downtime
- Dashboard shows improvement over time
- Pilot customer can see their data improving prompts

**Owner:** [agent:claude] + [agent:frontend] (dashboard)

---

## Monitoring & Observability

### Metrics to Track

```python
optimization_metrics = {
    # Optimization efficiency
    "optimization_duration_seconds": Histogram,
    "cost_per_optimization": Histogram,  # token usage
    "examples_bootstrap_ratio": Gauge,   # auto vs manual
    
    # Performance improvement
    "prompt_improvement_rate": Gauge,    # % of optimizations that improve
    "avg_improvement_magnitude": Gauge,  # how much they improve
    "time_to_first_improvement": Histogram,
    
    # System health
    "optimization_queue_depth": Gauge,
    "signal_capture_latency_ms": Histogram,
    "deployment_success_rate": Gauge,
}
```

### Dashboards

**1. Optimization Health**
- Queue depth, duration, success rate
- Cost trends
- Examples bootstrap vs. manual

**2. Performance Improvement**
- Prompt performance over time (per task type)
- A/B test results
- Production vs. baseline

**3. Data Flywheel**
- Signal capture rate
- New examples added per day
- Optimization run frequency

---

## Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| MIPROv2 too slow for daily runs | Medium | High | Minibatch optimization, Bayesian surrogate models |
| Optimization degrades performance | Medium | Medium | A/B testing with statistical significance |
| Example repository becomes biased | High | Medium | Quality scoring, diversity constraints |
| DSPy updates break compatibility | Low | Medium | Version pinning, abstraction layer |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| No data for pilots to improve | High | Medium | Start with synthetic + public datasets |
| Pilots don't see value | Medium | High | Dashboard showing improvement curve |
| Manual intervention needed | Medium | Low | Auto-rollback, human-in-the-loop override |

---

## Success Metrics

### Week 1 (MVP)
- [ ] Can optimize prompts automatically
- [ ] Optimization completes in <1 hour
- [ ] Shows measurable improvement on validation set

### Month 1 (Beta)
- [ ] Running daily optimizations
- [ ] A/B testing working
- [ ] 3 task types live with pilots

### Month 2 (Production)
- [ ] 50+ prompts optimized
- [ ] Average improvement >10% over baseline
- [ ] Zero manual prompt engineering by human team
- [ ] Pilots reporting visible improvement

### Quarter 1 (Scale)
- [ ] 200+ prompts across all tasks
- [ ] Cost per optimization <$0.50
- [ ] Self-improvement loop running autonomously
- [ ] Competitors can't match our auto-tuning

---

## Next Steps

1. **Approve this spec** (you)
2. **Spawn Claude Code subagent** to start Week 1 implementation
3. **Set up development environment** (PostgreSQL, Redis, DSPy)
4. **Create first optimization job** for model eval prompts
5. **Run end-to-end test** with toy dataset

---

## Appendix: DSPy MIPROv2 API Reference

### Core Classes

```python
# Optimize both instructions and few-shot examples
class dspy.MIPROv2(dspy.Optimizer):
    def __init__(
        self,
        metric: Callable,
        num_candidates: int = 30,
        max_bootstrapped_demos: int = 50,
        max_labeled_demos: int = 100,
        num_instruct_candidates: int = 30,
        num_fewshot_candidates: int = 30,
        seed: int = 42,
        auto: str = "balanced"  # "balanced", "fast", "thorough"
    )
    
    def compile(self, student, trainset, teacher=None, valset=None, num_trials=100):
        """
        Returns optimized program with best instruction + examples
        """
```

### Example Usage

```python
import dspy

# Configure LM
lm = dspy.LM("anthropic/claude-3-5-sonnet-20241022", api_key="...")
dspy.configure(lm=lm)

# Define signature
class MyTask(dspy.Signature):
    """Input text and classify sentiment"""
    text: str = dspy.InputField()
    sentiment: str = dspy.OutputField(desc="positive, negative, or neutral")

# Create optimizer
optimizer = dspy.MIPROv2(
    metric=accuracy_metric,
    num_candidates=30,
    max_bootstrapped_demos=50
)

# Run optimization
optimized_predictor = optimizer.compile(
    student=dspy.Predict(MyTask),
    trainset=train_examples,
    valset=val_examples,
    num_trials=100
)

# Use optimized prompt
result = optimized_predictor(text="I love this product!")
```

---

**End of Specification**

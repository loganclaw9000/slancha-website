# FAQ

## General

**Q: We already use Databricks. Do we need Slancha?**

A: Most enterprise customers use both. Databricks manages your data infrastructure (ETL, warehouses, analytics), while Slancha manages your AI engineering workflow (model evaluation, deployment, continuous learning). They're complementary — Databricks handles data; Slancha handles AI.

---

**Q: What frameworks do you support?**

A: All major frameworks: PyTorch, TensorFlow, Hugging Face, Ray, and more. Our Python SDK works with your existing models. Just drop in the Slancha evaluation wrapper, run tests, and deploy with one command.

---

**Q: Can we customize the evaluation metrics?**

A: Yes. Use our 50+ pre-built benchmarks, or define your own custom metrics and datasets. Our SDK makes it easy to integrate your proprietary evals.

---

**Q: How does auto post-training work?**

A: Slancha automatically captures production data, triggers model retraining when performance degrades or new data accumulates, and deploys improved models with A/B testing to ensure quality. No manual pipelines required.

---

## Technical

**Q: What kind of latency can we expect for evaluations?**

A: Typical model evaluations complete in minutes to hours, depending on model size and dataset complexity. Parallel evaluation of multiple models keeps total time low.

---

**Q: How does A/B testing work?**

A: Deploy multiple model versions simultaneously. Slancha automatically tracks performance metrics, calculates statistical significance, and tells you which model wins. Roll back instantly if needed.

---

**Q: Where is data stored?**

A: All data is encrypted at rest and in transit. Enterprise customers can deploy in their own VPC. We support SOC 2, GDPR, and can sign custom BAAs for healthcare customers.

---

**Q: Do you have API access?**

A: Yes. Full REST and gRPC APIs for all operations. SDK available for Python. CLI tools for common tasks.

---

## Pricing

**Q: How is usage-based pricing calculated?**

A: Based on model evaluations (per model), deployments (per model per month), and data capture (GB/month). We provide a usage calculator on the pricing page.

---

**Q: Can we upgrade or downgrade anytime?**

A: Yes. Changes take effect immediately. Prorated credits apply for mid-cycle upgrades.

---

**Q: Do you offer discounts for annual commitments?**

A: Yes. 20% off for annual commitments on Full Loop plan. Custom enterprise discounts available.

---

## Security & Compliance

**Q: Is Slancha SOC 2 compliant?**

A: Yes. SOC 2 Type II certified. Full audit logs available for enterprise customers.

---

**Q: Can we use Slancha with our own models?**

A: Absolutely. Slancha works with any model — your own fine-tuned models, open-weight models, or commercial API models.

---

**Q: What about data privacy?**

A: Your data never leaves your environment unless you choose to share it. We don't train on customer data. All models are evaluated in isolation.

---

**Q: Do you offer SSO?**

A: Yes. SAML SSO available on Full Loop and Enterprise plans. SCIM provisioning for Enterprise.

---

## Migration

**Q: How do we migrate from our current setup?**

A: Our SDK works with your existing models. Drop in the Slancha evaluation wrapper, run tests, and deploy with one command. Most teams are live within a day.

---

**Q: Can we self-host?**

A: Enterprise customers can self-host Slancha on their own infrastructure. Contact sales for details.

---

**Q: What about support?**

A: 
- **Eval + Deploy:** Email support, 48-hour response
- **Full Loop:** Priority email + chat, 4-hour response
- **Enterprise:** Dedicated success manager, 1-hour response, SLA-backed

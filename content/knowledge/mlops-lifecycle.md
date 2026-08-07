---
title: The MLOps Lifecycle
date: 2026-07-21
summary: A compact lifecycle for moving a model from an experiment into a service that can be understood and improved.
domain: Enterprise AI
topics:
  - MLOps
  - Evaluation
  - Observability
connections:
  - enterprise-ai-platform
  - rag-in-production
kind: note
---

MLOps is the operating discipline around a model, not merely the pipeline that deploys it. The lifecycle closes the loop between experimentation and what actually happens after release.

## Five recurring stages

1. **Frame** the decision, user, success measure, and acceptable failure modes.
2. **Build** reproducible data, features, experiments, and evaluation sets.
3. **Release** a versioned artifact through tested, reviewable automation.
4. **Observe** service health, model behavior, drift, cost, and user outcomes.
5. **Learn** from production feedback and feed it into the next experiment.

The loop matters more than any one tool. A sophisticated deployment platform cannot compensate for an evaluation set that does not represent the real decision.

---
title: RAG in Production
date: 2026-07-29
summary: Retrieval-augmented generation becomes an information-quality and evaluation problem long before it becomes a model problem.
domain: Enterprise AI
topics:
  - Generative AI
  - Governance
  - Evaluation
connections:
  - enterprise-ai-platform
  - mlops-lifecycle
kind: note
---

A retrieval-augmented generation demo can be assembled quickly. A production system has to answer harder questions: which sources are authoritative, what a user is allowed to retrieve, how freshness is measured, and what happens when the system cannot find enough evidence.

## The production checklist

- Preserve source identity and access controls through indexing and retrieval.
- Evaluate retrieval separately from generation. A fluent answer can hide a poor search result.
- Log the evidence set, prompt version, model version, and final response together.
- Define abstention behavior for weak, conflicting, or missing evidence.
- Measure business usefulness alongside technical relevance metrics.

## A helpful mental model

Treat RAG as a **search product with a probabilistic interface**. That framing keeps teams focused on corpus quality, permissions, ranking, citations, and user feedback—not only prompt engineering.

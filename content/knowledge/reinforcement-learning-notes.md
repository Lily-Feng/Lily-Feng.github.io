---
title: Reinforcement Learning, in One Map
date: 2026-06-30
summary: The core concepts that connect agents, environments, rewards, policies, and the exploration problem.
domain: Applied Machine Learning
topics:
  - Reinforcement Learning
  - Deep Learning
  - Evaluation
connections:
  - decision-quality
kind: note
---

Reinforcement learning studies how an agent learns a policy by interacting with an environment. Unlike supervised learning, the system is not given the correct action for every state. It receives feedback through rewards, often delayed and incomplete.

## The essential pieces

- The **state** represents what the agent can observe.
- An **action** changes the environment or the agent's position in it.
- The **reward** supplies a learning signal, but may not fully describe the desired behavior.
- A **policy** maps states to actions.
- A **value function** estimates expected future reward.

The hard part is frequently reward design. When the reward is only a rough proxy for the real objective, optimizing it can produce behavior that is technically successful and practically wrong.

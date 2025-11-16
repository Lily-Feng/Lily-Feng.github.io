---
layout: page
title: Text-to-SQL Chat Application
description: A chat application that translates natural language questions into SQL queries.
importance: 1
category: work
---

I'm currently designing and building a "Text-to-SQL" chat application. The goal is to combine these cutting-edge tools into a single, seamless experience:

1.  **Frontend:** Use **ChatKit** as the drop-in user interface.
2.  **Backend Agent:** Use the **OpenAI Agent SDK** to manage the conversation and orchestrate tasks.
3.  **Specialized Tool:** When the user asks a question about data, the main agent will hand off the request to a specialized agent powered by **Vanna.ai**, which will:
    * Generate a safe SQL query based on its training.
    * Run the query against a database.
    * Return the natural language answer to the main agent, which then streams it to the user via ChatKit.

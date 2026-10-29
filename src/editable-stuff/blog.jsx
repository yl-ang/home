import { BlogBuilder } from "../components/blog/BlogBuilder";
const bloglist = [];

const blog2 = new BlogBuilder({
  title: "Building Agents with Google's ADK",
  image: require('../assets/img/blog1/parallel-agent.png'),
  description:
    "Notes on Google's Agent Development Kit (ADK): agent patterns, evaluating agents, long-term memory and RAG.",
})
  .addHeading("What is ADK?")
  .addParagraph(
    <>
      The{" "}
      <a
        href="https://google.github.io/adk-docs/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Agent Development Kit (ADK)
      </a>{" "}
      is Google's framework for building agents. These are my notes from working through the codelabs and talks: how to structure agents, how to test them, and how to give them memory and private knowledge.
    </>
  )
  .addHeading("Agent patterns")
  .addParagraph("A single agent is a model (LLM), some tools, and an instruction that tells the agent which tools to use. It is the simplest pattern and good for simple tasks, but because LLMs are not deterministic it is not reliable for complex instructions.")
  .addImage(require('../assets/img/blog1/single-agent.png'), "Single agent pattern")
  .addList([
    "Pros: simple to implement, easier to debug, low latency.",
    "Cons: the system prompt becomes unwieldy as it grows, individual components are hard to re-use, and the agent is a single point of failure.",
  ])
  .addParagraph("A sequential agent runs its sub-agents in a fixed order, so it is a workflow rather than an LLM-driven decision. In my travel example, the sequential agent first calls a food-finding agent, then passes the output to a transportation agent. Each sub-agent is specialised and has its own google_search tool.")
  .addImage(require('../assets/img/blog1/sequential-agent.png'), "Sequential agent pattern")
  .addParagraph("The arrows only indicate execution order, not communication. The agents share state through the session: short-term memory held in the session state. In code, the sequential agent simply lists the sub-agents in the order they should run.")
  .addImage(require('../assets/img/blog1/shared-state.png'), "Code for a sequential agent that runs the food-finding agent, then the transportation agent")
  .addList([
    "Pros: predictable execution with a high degree of control, easier to test and debug, fewer LLM calls so lower latency and cost.",
    "Cons: inflexible, because steps can't be skipped like an LLM-driven multi-agent system could, edge cases have to be hardcoded, and latency accumulates like chained microservices since sub-agent B waits for sub-agent A.",
  ])
  .addParagraph("A parallel agent runs multiple specialised agents at the same time, independently. For example, search for results concurrently, then combine each agent's output with a sequential agent. That is why the example uses a parallel agent inside a sequential agent: the parallel agent runs the searches, then a synthesis agent combines the results.")
  .addImage(require('../assets/img/blog1/parallel-then-sequential.png'), "Parallel research agents followed by a synthesis agent in a sequential agent")
  .addList([
    "Pros: lower latency because agents don't wait on each other, while keeping the predictability of a sequential workflow.",
    "Cons: dependencies and shared state are harder to manage (race conditions), parallel sub-agents can contend for compute, and debugging is harder.",
  ])
  .addHeading("Evaluating agents")
  .addParagraph("LLMs can give different responses to the same prompt, so traditional tests are not enough. We need to assert that an agent responds properly and calls the right tools, with the right parameters and in the right order. ADK ships with evals out of the box, and there are three ways to run them.")
  .addImage(require('../assets/img/blog1/evals.png'), "Flow of an agent evaluation: run the test query, compare actual against expected results, produce a report")
  .addList([
    "ADK Web UI: good for local development and quickly generating tests, and its Trace tab lets you correlate test events with traces. But it only offers tool trajectory average score and response match score, and you have to click each evalset to run it.",
    "ADK eval command (CLI): supports more criteria such as LLM-as-a-judge, hallucination and safety, produces a detailed per-criterion report, and can be scripted for local automation. The open question is bringing it into CI/CD, for example an endpoint that runs the evals on the remote server.",
    "ADK with pytest: load evalsets and run them against the agent code.",
  ])
  .addParagraph("The first two need the agent to be up and running. An evalset config lets you set each criterion's threshold from 0 to 1.0, which controls how strict the evaluation is.")
  .addHeading("Long-term memory with Memory Bank")
  .addParagraph("Session memory is short-term. Memory Bank adds long-term, personalised context on top of it. This is from Google's Christmas card codelab.")
  .addList([
    "Session service: short-term memory. It keeps the immediate conversation context (\"What did the user just ask?\") and is cleared when the session ends.",
    "Vertex AI Memory Bank: long-term memory. It persists user-specific facts and preferences (\"User prefers Python\") indefinitely so later interactions can be personalised, and TTL and topics are configurable.",
    "Vertex AI Agent Engine: the managed infrastructure that hosts the agent logic and memory components at scale.",
  ])
  .addImage(require('../assets/img/blog1/memory-bank.png'), "Christmas agent architecture with Memory Bank")
  .addHeading("Private knowledge with RAG")
  .addParagraph("LLMs don't know an organisation's private data. Vertex AI RAG Engine, part of the Vertex AI platform, enriches the model's context with that private information, which reduces hallucination and makes answers more accurate. In the repair-manual example, the PDFs are ingested and indexed by Vertex AI Search, and the app runs on Agent Engine (Cloud Run).")
  .addImage(require('../assets/img/blog1/rag-app.png'), "Repair manual app using RAG")
  .addParagraph(
    <>
      I'm still working through RAG versus A2A versus sub-agents. The{" "}
      <a
        href="https://www.youtube.com/watch?v=ks4M8b9Ul6E"
        target="_blank"
        rel="noopener noreferrer"
      >
        video I'm following
      </a>{" "}
      compares them, and I'll expand this section once my notes are complete.
    </>
  );

bloglist.push(blog2);

const blog1 = new BlogBuilder({
  title: "Terraform Associate (003) Guide",
  image: require('../assets/img/blog0/terraform associate.png'),
  description:
    "A walkthrough of how I studied and passed the HashiCorp Terraform Associate (003) exam.",
})
  .addHeading("Motivation to take the exam")
  .addParagraph("I decided to pursue the Terraform Associate exam to deepen my understanding of Infrastructure as Code (IaC) concepts and explore the benefits of using Terraform. I initially planned to take the cert in Jan 2024, but I was busy with school. Now, during my downtime in December, I’ve revisited the goal and decided to give it another try, and learned more about Terraform.")
  .addHeading("Exam Tips")
  .addParagraph(
    <>
      1. Go through the learning path - Terraform Associate 003. The learning path is available on the{" "}
      <a
        href="https://developer.hashicorp.com/terraform/tutorials/certification-003/associate-study-003"
        target="_blank"
        rel="noopener noreferrer"
      >
        HashiCorp official website
      </a>. It covers all the topics tested in the exam and is a great starting point to prepare and build your foundation in Terraform.
    </>
  )
  .addParagraph(
    "2. Practice the HashiCorp Certified: Terraform Associate Practice Exam 2025 by Bryan Krausen. The practice exam is available on Udemy. I recommend scoring at least 80% in all five exams. The questions in the practice exams are similar to those in the actual exam."
  )
  .addParagraph(
    <>
      3. Practice the Skillmix - Terraform Associate Certification Question Guide. The guide is available on{" "}
      <a
        href="https://docs.google.com/document/u/0/d/1KgtWQNRfLH5YYzBDEDB8WtPG5UeK_Cj4O9uz5YZfo8Y/mobilebasic"
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Docs
      </a>. This practice paper is harder and more challenging compared to Bryan Krausen's practice exams. 
      I encountered a small subset of questions on the exam that were not covered in the learning path or Bryan Krausen's practice exams. 
      Credits to this{" "}
      <a
        href="https://www.reddit.com/r/Terraform/comments/1dgm42q/guide_to_pass_terraform_associate_003_exam/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reddit post
      </a>{" "}
      on r/Terraform.
    </>
  )
  .addParagraph(
    <>
      4. Gain hands-on experience with Terraform. I used{" "}
      <a
        href="https://learn.kodekloud.com/user/courses/udemy-labs-terraform-for-beginners"
        target="_blank"
        rel="noopener noreferrer"
      >
        Udemy Labs - Terraform for Beginners
      </a>{" "}
      on KodeKloud to practice provisioning infrastructure with Terraform and some Terraform CLI commands.
    </>
  )
  .addParagraph(
    <>
      5. Read the documentation provided by HashiCorp. For example, understand the difference between "terraform plan" and "terraform plan -auto-approve." The documentation provides detailed examples for the flags used in Terraform CLI commands.
    </>
  );

bloglist.push(blog1);

export default bloglist;
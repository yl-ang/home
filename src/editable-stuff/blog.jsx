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

const blog3 = new BlogBuilder({
  title: "Python GIL, Threads, Processes and Asyncio",
  description:
    "Notes on concurrency vs parallelism, what the GIL really limits, and when to use multithreading, multiprocessing or asyncio.",
})
  .addHeading("Concurrency vs parallelism")
  .addParagraph(
    <>
      These notes are based on{" "}
      <a
        href="https://medium.com/data-science/deep-dive-into-multithreading-multiprocessing-and-asyncio-94fdbe0c91f0"
        target="_blank"
        rel="noopener noreferrer"
      >
        this deep dive into multithreading, multiprocessing and asyncio
      </a>{" "}
      on Medium, which has good diagrams that I recommend reading alongside this post.
    </>
  )
  .addList([
    "Concurrency is about managing multiple tasks at the same time, but not necessarily simultaneously. Tasks take turns, which creates the illusion of multitasking.",
    "Parallelism is about running multiple tasks simultaneously, typically on multiple CPU cores.",
  ])
  .addHeading("Programs, processes and threads")
  .addParagraph("A program sits on disk and is passive. Once the OS loads it into memory to run, it becomes a process: an independent instance of a running program with its own memory space, resources and execution state. Processes are isolated from each other, so one cannot interfere with another unless they communicate explicitly through inter-process communication (IPC).")
  .addParagraph("A thread is the smallest unit of execution inside a process. Every process has at least one thread, the main thread, and can create more. Threads are lightweight and share the memory and resources of their process, which makes communication efficient. The downside is that sharing leads to race conditions and deadlocks if it isn't managed carefully, and one misbehaving thread can crash the whole process.")
  .addParagraph("Processes tend to be one of two kinds:")
  .addList([
    "I/O bound: spend most of their time waiting for file access, network responses or user input, while the CPU sits idle. During blocking I/O, CPython releases the GIL so another thread in the same process can run.",
    "CPU bound: spend most of their time computing, such as video encoding or numerical analysis. The GIL isn't released for a thread doing heavy CPU work, so extra cores don't help a multithreaded CPU-bound program.",
  ])
  .addHeading("How the OS juggles them")
  .addParagraph("A CPU core can only execute one task at a time, so the OS uses preemptive context switching: it pauses the current task, saves its state and loads the state of the next one. Done rapidly, this looks like simultaneous execution on a single core.")
  .addParagraph("Switching between processes is more expensive because the OS has to save and load separate memory spaces. Switching between threads is cheaper because they share memory, but switching too often still adds overhead and can slow things down.")
  .addHeading("The GIL")
  .addParagraph("The Global Interpreter Lock (GIL) is a lock that lets only one thread hold control of the Python interpreter at a time, so only one thread executes Python bytecode at once. It exists to simplify memory management: many internal operations, such as object creation, are not thread safe by default. Without the GIL, threads sharing memory would need complex locking to prevent race conditions and data corruption.")
  .addParagraph("When it becomes a bottleneck:")
  .addList([
    "Single-threaded programs: the GIL is irrelevant, since the one thread has exclusive access to the interpreter.",
    "Multithreaded I/O-bound programs: usually fine, because threads release the GIL while they wait for I/O.",
    "Multithreaded CPU-bound programs: a significant bottleneck. The threads compete for the GIL and take turns running bytecode, so you get no parallel speed-up.",
  ])
  .addHeading("Multiprocessing")
  .addParagraph("Multiprocessing runs multiple processes in parallel, each with its own memory, its own GIL and its own resources (and possibly several threads). Because every process has its own interpreter, it sidesteps the GIL, which makes it the right fit for CPU-bound work. The price is more resource use, from separate memory and process start-up overhead.")
  .addHeading("Asyncio")
  .addParagraph("Asyncio uses a single thread to handle many tasks. You write code with the async and await keywords, and the key concepts are:")
  .addList([
    "Coroutines: functions defined with async def. They are the core of asyncio and represent work that can be paused and resumed later, a bit like yield.",
    "Event loop: manages the execution of tasks.",
    "Tasks: wrappers around coroutines. A coroutine only starts running concurrently once you turn it into a task with asyncio.create_task().",
    "await: pauses the current coroutine and gives control back to the event loop.",
  ])
  .addParagraph("The difference is easiest to see with three downloads. Without asyncio you wait for A to finish before starting B, then B before C. With asyncio, each task starts, hits its network wait, and hands control back so the next one can start:")
  .addCode(`Without asyncio
Task A: [work] WAIT........ DONE
Task B:                          [work] WAIT........ DONE
Task C:                                                   [work] WAIT........ DONE

With asyncio
Task A: [work] WAIT............ DONE
Task B:        [work] WAIT............ DONE
Task C:               [work] WAIT............ DONE
                ^ switch between tasks`)
  .addParagraph("When a task runs await network_request(), it is essentially saying: \"I'm waiting for the network and can't do anything right now, so let another task run.\"")
  .addHeading("Which one should I use?")
  .addParagraph("Ask two questions: is the task I/O bound, and if so, is the I/O very slow?")
  .addList([
    "Multiprocessing: best for CPU-bound, computationally heavy tasks, or whenever you need to bypass the GIL. Each process has its own interpreter, which gives true parallelism.",
    "Multithreading: best for fast I/O-bound tasks, since context switches are less frequent and the interpreter stays on one thread for longer. Not ideal for CPU-bound work because of the GIL.",
    "Asyncio: ideal for slow I/O-bound tasks such as long network requests or database queries, because it handles waiting efficiently and scales well. It isn't suitable for CPU-bound tasks unless you offload that work to other processes.",
  ]);

bloglist.push(blog3);

export default bloglist;
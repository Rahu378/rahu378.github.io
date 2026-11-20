/*
  Single source of truth for résumé content (Software Engineer – AI & ML, November 2026).
  Every page reads from window.RESUME, so dates, numbers and wording only need fixing here
  (the static fallbacks inside each HTML page mirror this file).
*/
window.RESUME = (() => {
  const roles = [
    {
      id: 'nextgen',
      company: 'NextGen IT Solutions',
      title: 'Software Engineer – AI & ML',
      place: 'Ashburn, VA',
      start: 'Feb 2026',
      end: 'Oct 2026',
      kind: 'Full-time',
      mono: 'NG',
      color: '#1a73e8',
      bullets: [
        'Partnered with compliance, legal, and advisory business users to gather requirements and translate them into an enterprise conversational knowledge assistant over policies and SOPs, replacing manual document search with natural-language Q&A.',
        'Built RAG grounding on Azure OpenAI with hybrid (BM25 + vector) retrieval and designed a multi-step agent workflow in LangGraph that decides when to retrieve, which source to query, and when to iterate, reducing multi-document answer failures versus the prior top-k baseline.',
        'Secured the assistant and its APIs with Microsoft Entra ID (app registrations, OAuth 2.0 tokens, role-based access) so users only retrieved documents they were authorized to see.',
        'Implemented AI governance controls: confidence scoring and structured refusal kept hallucination on out-of-scope questions under 3% in quarterly audits; all responses logged for auditability.',
        'Built an evaluation harness (Ragas + LangSmith, 500+ query golden set) as a blocking GitHub Actions gate for prompt and model changes, catching regressions before production.',
        'Added cost-aware routing (simple lookups on a lightweight path, complex questions escalated to full agent reasoning), lowering per-query inference cost while meeting task-completion SLOs.',
        'Led weekly demos, Responsible AI reviews, and technical readouts for business and compliance stakeholders.'
      ],
      uses: ['Azure OpenAI', 'Azure AKS', 'Python', 'FastAPI', 'LangGraph', 'LangChain', 'Pinecone', 'PgVector', 'LangSmith', 'Ragas',
        'GitHub Actions', 'Microsoft Entra ID', 'OAuth 2.0', 'Hybrid RAG (BM25 + Vector)', 'Guardrails & Structured Refusal',
        'Audit Logging', 'CI Quality Gates', 'Responsible AI Reviews', 'Prompt Engineering']
    },
    {
      id: 'appworks',
      company: 'Appworks',
      title: 'Associate Software Engineer – Generative AI',
      place: 'McAllen, TX (hybrid)',
      start: 'Feb 2025',
      end: 'Jan 2026',
      kind: 'Full-time',
      mono: 'AW',
      color: '#e8710a',
      bullets: [
        'Built REST APIs (FastAPI) integrated with AWS Lambda to automate event-driven data workflows in a regulated transaction-processing pipeline, with PostgreSQL as the system of record.',
        'Delivered an LLM proof of concept that auto-classifies and routes support tickets: designed prompts and parsed structured JSON output into downstream routing logic for operations teams.',
        'Deployed a containerized fraud-scoring API with p99 latency under 80 ms, auto-scaled on ECS for peak transaction windows.',
        'Rebuilt a data-transformation integration with strict input validation so malformed records were flagged instead of silently dropped; added pytest coverage to two services and caught a validation defect before it reached downstream systems.'
      ],
      uses: ['Python', 'FastAPI', 'AWS Lambda', 'PostgreSQL', 'Docker', 'AWS ECS', 'Agile/Scrum', 'REST APIs', 'JSON',
        'Event-Driven Workflows', 'Prompt Engineering']
    },
    {
      id: 'dxc',
      company: 'DXC Technology',
      title: 'Software Engineer Intern',
      place: 'Bangalore, India',
      start: 'May 2022',
      end: 'Dec 2022',
      kind: 'Internship',
      mono: 'DXC',
      color: '#188038',
      bullets: [
        'Automated a manual vendor CSV import by building scheduled Python integration pipelines that synced third-party data into internal systems, eliminating recurring analyst effort.',
        'Developed backend services and integrations in Java and Python supporting high-volume transactional workflows for retail and logistics clients across multiple regions.',
        'Migrated legacy on-premises modules to AWS (EC2, S3, RDS), covering environment configuration, provisioning, and post-migration validation.',
        'Optimized SQL queries and stored procedures through indexing improvements, reducing report execution time on large datasets; delivered across 5+ full SDLC client cycles.'
      ],
      uses: ['Java', 'Python', 'MySQL', 'PostgreSQL', 'Scheduled Ingestion Pipelines']
    }
  ];

  const projects = [
    {
      id: 'hwgateway',
      name: 'Hardware-Aware Gateway',
      short: 'HW Gateway',
      kind: 'GPU kernels for LLM inference',
      color: '#30d158',
      line: 'Fused LLM kernels written twice, in Triton for NVIDIA and in Metal for Apple silicon, with every benchmark generated from committed runs.',
      stack: ['Triton', 'CUDA', 'Metal (MLX)', 'PyTorch'],
      uses: ['Triton', 'CUDA', 'Metal (MLX)', 'PyTorch'],
      links: [
        ['GitHub', 'https://github.com/Rahu378/hardware-aware-gateway'],
        ['Interactive explorer', 'https://rahu378.github.io/hardware-aware-gateway/'],
        ['Medium article', 'https://medium.com/@chidipudirahulreddy/the-fastest-code-i-wrote-last-week-was-the-code-i-didnt-write-3400a149e067']
      ],
      bullets: [
        'Fused RMSNorm + residual and SwiGLU kernels written in both Triton (NVIDIA) and Metal (Apple silicon): up to 5.75× over eager PyTorch at prefill on a Tesla T4 (RMSNorm + residual, op-level), with SwiGLU reaching 79% of datasheet memory bandwidth.',
        'Roofline analysis showed decode was dispatch-bound, not bandwidth-bound (54% of each token on CPU dispatch, ~6,130 ops per token), which cancelled a planned GEMV kernel and led to CUDA-graph capture: 1.72× decode throughput (28.0 → 48.1 tok/s) with token-identical output.'
      ]
    },
    {
      id: 'finopsai',
      name: 'FinOpsAI',
      kind: 'LLM billing and token-audit engine',
      color: '#ffd60a',
      line: 'Normalizes LLM usage logs from three providers, attributes the spend, forecasts the month-end invoice, and tells a gateway when to hold back.',
      stack: ['Python', 'FastAPI'],
      uses: ['Python', 'FastAPI'],
      links: [
        ['GitHub', 'https://github.com/Rahu378/finopsAI'],
        ['Live dashboard', 'https://rahu378.github.io/finopsAI/']
      ],
      bullets: [
        'LLM billing and token-audit engine: normalizes OpenAI, Anthropic, and Bedrock usage logs, attributes spend to cost centers, forecasts month-end invoices (4.16% MAPE across 76 backtest origins), and serves a pre-dispatch policy endpoint that tells a gateway to allow, downgrade, or block a call. Demo data is synthetic; 88 tests.'
      ]
    },
    {
      id: 'gallery',
      name: 'The Gallery',
      kind: 'Agentic F1 broadcast director',
      color: '#bf5af2',
      line: 'An agent that directs the Formula 1 world feed: a 10 Hz scorer and Gemini 2.5 Flash decide, live, which battle the cameras should be on.',
      stack: ['Python', 'Gemini 2.5', 'Google ADK', 'FastAPI', 'WebSockets', 'Grafana'],
      uses: ['Python', 'Gemini 2.5', 'Google ADK', 'FastAPI', 'WebSockets', 'Grafana', 'Three.js'],
      links: [
        ['GitHub', 'https://github.com/Rahu378/The-F1-Gallery'],
        ['Live demo', 'https://the-gallery-742484896712.us-central1.run.app/']
      ],
      bullets: [
        'Architected an agentic F1 world feed director using a 10 Hz deterministic Python telemetry scorer and Gemini 2.5 Flash via Google ADK, capturing 50% of live passes (vs. 1.8% baseline) at $0.0026 per decision.',
        'Built a real-time multimodal audio engine using Gemini multi-speaker TTS and Web Audio API synthesis to dynamically switch between play-by-play and color commentary based on live race events.',
        'Developed a low-latency full-stack architecture featuring FastAPI WebSockets, interactive Three.js 2D/3D track maps, and Grafana Cloud MCP integration for real-time telemetry observability and agent cut tracking.'
      ]
    }
  ];

  const credentials = [
    { id: 'pl900', name: 'Microsoft Certified: Power Platform (PL-900)', short: 'PL-900', by: 'Microsoft',
      uses: ['Power Automate', 'Power Apps', 'Dataverse'] },
    { id: 'pl200', name: 'Microsoft Certified: Power Platform (PL-200)', short: 'PL-200', by: 'Microsoft',
      uses: ['Power Automate', 'Power Apps', 'Dataverse', 'Solutions & ALM', 'Environment Variables', 'DLP Policies'] },
    { id: 'aws', name: 'AWS Certified Developer', short: 'AWS cert', by: 'Amazon Web Services', uses: ['AWS Lambda', 'AWS ECS'] },
    { id: 'hf', name: 'Hugging Face Agents', short: 'HF Agents', by: 'Hugging Face', uses: ['Tool Calling'] },
    { id: 'ibm-genai', name: 'IBM Generative AI', short: 'IBM GenAI', by: 'IBM', uses: ['Prompt Engineering'] },
    { id: 'ibm-dt', name: 'IBM Design Thinking', short: 'IBM DT', by: 'IBM', uses: [] },
    { id: 'ml', name: 'Machine Learning Specialization', short: 'ML cert', by: 'Stanford / DeepLearning.AI', uses: ['Python'] }
  ];

  const skills = [
    { group: 'Conversational AI & Agents', items: ['Microsoft Copilot Studio', 'LangGraph', 'LangChain', 'Google ADK', 'Tool Calling', 'Human-in-the-Loop'] },
    { group: 'Generative AI & RAG', items: ['Azure OpenAI', 'Azure AI Foundry', 'Azure AI Search', 'Hybrid RAG (BM25 + Vector)', 'PgVector', 'Pinecone', 'FAISS', 'Prompt Engineering', 'Gemini 2.5'] },
    { group: 'AI Governance & Quality', items: ['Responsible AI Reviews', 'Guardrails & Structured Refusal', 'Ragas', 'LangSmith', 'CI Quality Gates', 'Audit Logging'] },
    { group: 'Integration & Security', items: ['REST APIs', 'JSON', 'FastAPI', 'Webhooks', 'Custom Connectors (OpenAPI)', 'OAuth 2.0', 'Microsoft Entra ID', 'Microsoft Graph', 'SharePoint', 'WebSockets'] },
    { group: 'Microsoft Power Platform', items: ['Power Automate', 'Power Apps', 'Dataverse', 'Solutions & ALM', 'Environment Variables', 'DLP Policies'] },
    { group: 'Workflow Automation', items: ['Event-Driven Workflows', 'Scheduled Ingestion Pipelines', 'Approval & Human Review Routing', 'Retries / Dead-Lettering'] },
    { group: 'Cloud & Engineering', items: ['Azure AKS', 'AWS Lambda', 'AWS ECS', 'AWS Textract', 'AWS Bedrock', 'Python', 'Java', 'PostgreSQL', 'MySQL', 'Docker', 'GitHub Actions', 'Agile/Scrum'] },
    { group: 'ML Systems & Real-Time', items: ['PyTorch', 'Triton', 'CUDA', 'Metal (MLX)', 'Three.js', 'Grafana'] }
  ];

  return {
    name: 'Rahul Chidipudi',
    title: 'Software Engineer – AI & ML',
    email: 'rahul.r24.c@gmail.com',
    phone: '(856) 526-9115',
    phoneHref: 'tel:+18565269115',
    github: 'https://github.com/Rahu378',
    githubLabel: 'github.com/Rahu378',
    linkedin: 'https://www.linkedin.com/in/rahulchidipudi/',
    resume: 'Rahul_Chidipudi_Resume.pdf',
    location: 'United States',
    roles,
    projects,
    credentials,
    skills
  };
})();

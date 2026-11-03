"""Per-page content. Chrome lives in build.py; copy lives here."""

# ── HOME ───────────────────────────────────────────────────────────────
HOME = """
<section class="hero" id="hero">
  <div class="hero__glow" aria-hidden="true"></div>

  <figure class="portrait" id="portrait">
    <div class="portrait__aura" aria-hidden="true"></div>
    <div class="portrait__stage" id="portraitStage">
      <img class="portrait__plate" src="/assets/img/rahul.jpg" alt="" aria-hidden="true" />
      <img class="portrait__img" src="/assets/img/rahul.jpg" alt="Rahul Reddy Chidipudi" />
      <div class="portrait__halftone" aria-hidden="true"></div>
      <div class="portrait__vig" aria-hidden="true"></div>
      <div class="portrait__rim" aria-hidden="true"></div>
    </div>
    <div class="portrait__fade" aria-hidden="true"></div>
  </figure>

  <div class="hero__copy">
    <h1 class="hero__title">
      <span class="ln"><span class="w">Backend</span> <span class="w">systems,</span></span>
      <span class="ln"><span class="w">measured</span> <span class="w">in</span></span>
      <span class="ln"><span class="w accent">milliseconds<span class="dot">.</span></span></span>
    </h1>

    <p class="hero__eyebrow"><i class="rule"></i>HI, I AM RAHUL</p>
    <p class="hero__role">
      <span>SOFTWARE ENGINEER</span><span>BACKEND &middot; DISTRIBUTED SYSTEMS &middot; APPLIED AI</span>
    </p>

    <a class="cta" href="/projects/">
      <span class="cta__disc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l10 7-10 7z"/></svg></span>
      <span class="cta__txt">SEE THE SYSTEMS</span>
    </a>
  </div>

  <!-- A real shell, not a chatbot. Type into it. -->
  <div class="term" id="term">
    <div class="term__bar">
      <span class="term__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="term__title">rahul@portfolio &mdash; zsh</span>
      <span class="term__live" aria-hidden="true"><b></b>live</span>
    </div>

    <div class="term__body" id="termBody" role="log" aria-live="polite" aria-label="Terminal output"></div>

    <form class="term__form" id="termForm" autocomplete="off">
      <label class="term__prompt" for="termInput" aria-hidden="true">&rsaquo;</label>
      <input class="term__input" id="termInput" name="cmd" type="text"
             autocomplete="off" autocapitalize="off" spellcheck="false"
             aria-label="Type a command" placeholder="type a command &mdash; try &lsquo;help&rsquo;" />
    </form>

    <div class="term__hints" aria-label="Suggested commands">
      <button type="button" data-cmd="help">help</button>
      <button type="button" data-cmd="whoami">whoami</button>
      <button type="button" data-cmd="projects">projects</button>
      <button type="button" data-cmd="stack">stack</button>
      <button type="button" data-cmd="contact">contact</button>
    </div>
  </div>

  <div class="hero__slate" aria-hidden="true">
    <span>MCLEAN, VA</span><span>AVAILABLE</span>
  </div>
</section>

<section class="sec sec--tight">
  <div class="metrics__rail">
    <article class="metric reveal">
      <div class="metric__v"><span class="count" data-to="95" data-suffix="ms">0</span></div>
      <p class="metric__k">p50 API latency</p>
      <p class="metric__n">down from 180ms &mdash; REST&nbsp;&rarr;&nbsp;gRPC in Go</p>
    </article>
    <article class="metric reveal">
      <div class="metric__v"><span class="count" data-to="50" data-suffix="K+">0</span></div>
      <p class="metric__k">requests / sec sustained</p>
      <p class="metric__n">Netty async I/O, 3ms overhead</p>
    </article>
    <article class="metric reveal">
      <div class="metric__v"><span class="count" data-to="500" data-suffix="GB">0</span></div>
      <p class="metric__k">telemetry processed daily</p>
      <p class="metric__n">Kafka &rarr; PostgreSQL, 5 business units</p>
    </article>
    <article class="metric reveal">
      <div class="metric__v"><span class="count" data-to="94" data-suffix="%">0</span></div>
      <p class="metric__k">detection precision</p>
      <p class="metric__n">AML structuring patterns, LangGraph</p>
    </article>
  </div>
</section>

<section class="sec">
  <header class="sec__head">
    <span class="sec__tag">THE INDEX</span>
    <h2 class="sec__title">Four ways in</h2>
    <p class="sec__sub">Start wherever you like &mdash; each one stands on its own.</p>
  </header>

  <ol class="index">
    <li class="reveal"><a href="/projects/">
      <span class="index__n">01</span>
      <span class="index__b"><b>Systems</b><i>ShadowDB, FinSight, Text2Workflow, PageRank at scale &mdash; with the architecture drawn out.</i></span>
      <span class="index__go" aria-hidden="true">&rarr;</span></a></li>
    <li class="reveal"><a href="/work/">
      <span class="index__n">02</span>
      <span class="index__b"><b>Experience</b><i>NextGen IT Solutions, Appworks, DXC Technology.</i></span>
      <span class="index__go" aria-hidden="true">&rarr;</span></a></li>
    <li class="reveal"><a href="/skills/">
      <span class="index__n">03</span>
      <span class="index__b"><b>Tooling</b><i>Go, Java, Python, Kubernetes, Kafka, Spark, and the rest of it.</i></span>
      <span class="index__go" aria-hidden="true">&rarr;</span></a></li>
    <li class="reveal"><a href="/about/">
      <span class="index__n">04</span>
      <span class="index__b"><b>About</b><i>Background, education, certifications and what I do outside the editor.</i></span>
      <span class="index__go" aria-hidden="true">&rarr;</span></a></li>
  </ol>
</section>
"""

# ── WORK ───────────────────────────────────────────────────────────────
WORK = """
<section class="sec" id="work">
  <header class="sec__head">
    <span class="sec__tag">01 &mdash; EXPERIENCE</span>
    <h2 class="sec__title">Where I've shipped</h2>
    <p class="sec__sub">Three roles, all backend. The numbers are the ones I actually moved.</p>
  </header>

  <div class="jobs">

    <article class="job reveal">
      <div class="job__when">
        <span class="job__dates">02/2026 &mdash; Present</span>
        <span class="job__now">CURRENT</span>
      </div>
      <div class="job__body">
        <h3 class="job__role">Software Engineer</h3>
        <p class="job__co">NextGen IT Solutions <span>&middot; Ashburn, VA</span></p>
        <ul class="job__pts">
          <li>Migrated legacy REST endpoints to <b>gRPC microservices in Go</b>, cutting average API latency from <b class="hl">180ms to 95ms</b> and cloud compute costs by 15%.</li>
          <li>Containerized backend services with Docker and deployed on <b>AWS EKS</b>, reducing deployment rollback incidents by <b class="hl">40%</b> through automated canary releases.</li>
          <li>Designed event-driven pipelines with <b>Apache Kafka and PostgreSQL</b>, processing <b class="hl">500GB of telemetry daily</b> for dashboards used by 5 business units.</li>
          <li>Raised code coverage from 68% to <b class="hl">89%</b> across the core services repo with PyTest and JUnit integration and unit tests.</li>
          <li>Built CI/CD with GitHub Actions, taking build-to-deploy from <b class="hl">45 minutes to 12</b>.</li>
        </ul>
        <ul class="job__stack">
          <li>Go</li><li>gRPC</li><li>Docker</li><li>Kubernetes</li><li>AWS EKS</li>
          <li>Kafka</li><li>PostgreSQL</li><li>GitHub Actions</li><li>PyTest</li><li>JUnit</li>
        </ul>
      </div>
    </article>

    <article class="job reveal">
      <div class="job__when"><span class="job__dates">02/2025 &mdash; 01/2026</span></div>
      <div class="job__body">
        <h3 class="job__role">Associate Software Engineer</h3>
        <p class="job__co">Appworks <span>&middot; Ashburn, VA</span></p>
        <ul class="job__pts">
          <li>Developed secure <b>REST APIs in Java (Spring Boot)</b> for user authentication, serving 200 concurrent internal users at <b class="hl">under 65ms</b> average response.</li>
          <li>Refactored slow SQL with composite indexes and rewritten joins, improving read performance on a <b>2M-row PostgreSQL table by 40%</b>.</li>
          <li>Provisioned Linux staging environments and resolved TCP/IP issues &mdash; DNS resolution, DHCP leases, firewall misconfigurations &mdash; to hold service uptime.</li>
          <li>Wrote <b>Terraform</b> for AWS environments (VPC, subnets, EC2, RDS), taking setup from <b class="hl">2 days to under 2 hours</b>.</li>
        </ul>
        <ul class="job__stack">
          <li>Java</li><li>Spring Boot</li><li>PostgreSQL</li><li>Terraform</li>
          <li>AWS</li><li>Linux</li><li>TCP/IP</li>
        </ul>
      </div>
    </article>

    <article class="job reveal">
      <div class="job__when"><span class="job__dates">05/2022 &mdash; 09/2022</span></div>
      <div class="job__body">
        <h3 class="job__role">Software Developer Intern</h3>
        <p class="job__co">DXC Technology <span>&middot; Hyderabad, TG</span></p>
        <ul class="job__pts">
          <li>Built <b>RESTful APIs in Java (Spring Boot)</b> for internal project-management dashboards serving 50 concurrent users.</li>
          <li>Wrote complex SQL and stored procedures on <b>Oracle</b> for weekly compliance reports, cutting manual reporting by <b class="hl">10 hours per week</b>.</li>
          <li>Configured and maintained Linux development servers, troubleshooting TCP/IP and DNS connectivity.</li>
          <li>Documented endpoints with <b>Swagger</b> and wrote onboarding guides, reducing new-intern ramp-up by <b class="hl">30%</b>.</li>
        </ul>
        <ul class="job__stack">
          <li>Java</li><li>Spring Boot</li><li>Oracle</li><li>SQL</li><li>Swagger</li><li>Linux</li>
        </ul>
      </div>
    </article>

  </div>
</section>
"""

# ── PROJECTS ───────────────────────────────────────────────────────────
_GH = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48'
       'l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 '
       '1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 '
       '1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 '
       '1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18'
       '.58.69.48A10 10 0 0 0 12 2z"/></svg>')

PROJECTS = """
<section class="sec sec--wide" id="projects">
  <header class="sec__head">
    <span class="sec__tag">02 &mdash; SYSTEMS</span>
    <h2 class="sec__title">Things I've built</h2>
    <p class="sec__sub">Four systems, each with its own failure mode. The diagrams show how data actually moves.</p>
  </header>

  <article class="proj reveal" id="shadowdb">
    <div class="proj__head">
      <div>
        <span class="proj__idx">01</span>
        <h3 class="proj__name">ShadowDB</h3>
        <p class="proj__tag">Traffic-forking proxy for risk-free schema migration</p>
      </div>
      <div class="proj__links">
        <span class="proj__repo proj__repo--none" title="Source not public yet"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="10.5" width="16" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg> Private repo</span>
      </div>
    </div>

    <div class="proj__grid">
      <div class="diagram">
        <svg viewBox="0 0 880 290" role="img" aria-labelledby="sdb-t sdb-d">
          <title id="sdb-t">ShadowDB architecture</title>
          <desc id="sdb-d">Live production traffic enters a Netty proxy, which forwards it to the production database and simultaneously forks a copy to a shadow database. Both feed metrics into Prometheus and Grafana for comparison.</desc>
          <path class="flow" d="M160,145 H222" />
          <path class="flow" d="M378,145 C412,145 418,62 452,62" />
          <path class="flow flow--shadow" d="M378,145 C412,145 418,228 452,228" />
          <path class="flow flow--dim" d="M604,62 C642,62 648,145 682,145" />
          <path class="flow flow--dim flow--shadow" d="M604,228 C642,228 648,145 682,145" />
          <g class="node"><rect x="10" y="117" width="150" height="56" rx="7" />
            <text x="85" y="141" class="n-t">Live traffic</text><text x="85" y="159" class="n-s">production clients</text></g>
          <g class="node node--hot"><rect x="222" y="107" width="156" height="76" rx="7" />
            <text x="300" y="136" class="n-t">Netty proxy</text><text x="300" y="154" class="n-s">async non-blocking</text>
            <text x="300" y="170" class="n-s n-s--hot">intercept &amp; fork</text></g>
          <g class="node"><rect x="452" y="34" width="152" height="56" rx="7" />
            <text x="528" y="58" class="n-t">Production DB</text><text x="528" y="76" class="n-s">PostgreSQL</text></g>
          <g class="node node--shadow"><rect x="452" y="200" width="152" height="56" rx="7" />
            <text x="528" y="224" class="n-t">Shadow DB</text><text x="528" y="242" class="n-s">new schema under test</text></g>
          <g class="node"><rect x="682" y="117" width="160" height="56" rx="7" />
            <text x="762" y="141" class="n-t">Prometheus</text><text x="762" y="159" class="n-s">+ Grafana compare</text></g>
          <text x="415" y="98" class="edge">real path</text>
          <text x="415" y="205" class="edge edge--shadow">forked copy</text>
        </svg>
      </div>
      <div class="proj__copy">
        <p>A Netty-based middleware proxy that duplicates live production traffic to shadow test
        databases, so schema migrations and chaos testing can be rehearsed against real query
        patterns without touching production.</p>
        <ul class="proj__pts">
          <li><b class="hl">3ms</b> average latency overhead at <b class="hl">50K+ requests/sec</b>, using Netty's asynchronous non-blocking I/O for interception and forking.</li>
          <li>Real-time Prometheus and Grafana dashboards comparing production against shadow query performance, surfacing <b class="hl">12+ regressions</b> before they reached production.</li>
        </ul>
        <ul class="proj__stack">
          <li>Java</li><li>Netty</li><li>Kafka</li><li>PostgreSQL</li><li>MongoDB</li><li>Prometheus</li><li>Grafana</li>
        </ul>
      </div>
    </div>
  </article>

  <article class="proj reveal" id="finsight">
    <div class="proj__head">
      <div>
        <span class="proj__idx">02</span>
        <h3 class="proj__name">FinSight Agent</h3>
        <p class="proj__tag">AML / OFAC compliance agent with audit-ready output</p>
      </div>
      <div class="proj__links">
        <a class="proj__repo" href="https://github.com/Rahu378/finsight-agent" target="_blank" rel="noopener noreferrer">__GH__ View repo</a>
      </div>
    </div>

    <div class="proj__grid">
      <div class="diagram">
        <svg viewBox="0 0 880 290" role="img" aria-labelledby="fs-t fs-d">
          <title id="fs-t">FinSight Agent architecture</title>
          <desc id="fs-d">A transaction stream enters a LangGraph orchestrator that loops between reasoning steps and tool calls against sanctions and pattern checks, then emits a structuring verdict and an audit report.</desc>
          <path class="flow" d="M150,175 H222" />
          <path class="flow flow--dim" d="M300,120 V88" />
          <path class="flow flow--dim flow--rev" d="M360,88 V120" />
          <path class="flow" d="M400,175 H470" />
          <path class="flow" d="M622,175 H692" />
          <g class="node"><rect x="10" y="147" width="140" height="56" rx="7" />
            <text x="80" y="171" class="n-t">Transactions</text><text x="80" y="189" class="n-s">FastAPI ingest</text></g>
          <g class="node node--hot"><rect x="222" y="120" width="178" height="84" rx="7" />
            <text x="311" y="150" class="n-t">LangGraph</text><text x="311" y="168" class="n-s">orchestrator</text>
            <text x="311" y="186" class="n-s n-s--hot">reason &#8644; tool-call</text></g>
          <g class="node node--ghost"><rect x="238" y="32" width="184" height="56" rx="7" />
            <text x="330" y="56" class="n-t">Tools</text><text x="330" y="74" class="n-s">OFAC list &middot; BSA patterns</text></g>
          <g class="node"><rect x="470" y="147" width="152" height="56" rx="7" />
            <text x="546" y="171" class="n-t">Structuring</text><text x="546" y="189" class="n-s">verdict + evidence</text></g>
          <g class="node node--ok"><rect x="692" y="147" width="150" height="56" rx="7" />
            <text x="767" y="171" class="n-t">Audit report</text><text x="767" y="189" class="n-s n-s--ok">94% precision</text></g>
          <text x="228" y="108" class="edge">multi-step loop</text>
          <text x="767" y="128" class="edge edge--ok">for compliance officers</text>
        </svg>
      </div>
      <div class="proj__copy">
        <p>An AML/OFAC compliance agent that detects Bank Secrecy Act structuring patterns &mdash;
        deposits deliberately kept under reporting thresholds &mdash; and produces reports a
        compliance officer can actually file.</p>
        <ul class="proj__pts">
          <li><b class="hl">94% precision</b> on suspicious-transaction detection, by orchestrating multi-step LLM reasoning and tool-calling through LangGraph rather than a single prompt.</li>
          <li>Every verdict carries its evidence chain, so the output is auditable instead of a bare score.</li>
        </ul>
        <ul class="proj__stack"><li>Python</li><li>LangGraph</li><li>AWS Bedrock</li><li>FastAPI</li></ul>
      </div>
    </div>
  </article>

  <article class="proj reveal" id="text2workflow">
    <div class="proj__head">
      <div>
        <span class="proj__idx">03</span>
        <h3 class="proj__name">Text2Workflow</h3>
        <p class="proj__tag">Plain English into validated swimlane blueprints</p>
      </div>
      <div class="proj__links">
        <a class="proj__repo proj__repo--live" href="https://rahu378.github.io/text2workflow/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8l6 4-6 4z"/><circle cx="12" cy="12" r="9"/></svg> Live demo</a>
        <a class="proj__repo" href="https://github.com/Rahu378/text2workflow" target="_blank" rel="noopener noreferrer">__GH__ Repo</a>
      </div>
    </div>

    <div class="proj__grid">
      <div class="diagram">
        <svg viewBox="0 0 880 250" role="img" aria-labelledby="t2w-t t2w-d">
          <title id="t2w-t">Text2Workflow architecture</title>
          <desc id="t2w-d">A plain-text process description is parsed, checked by a deterministic grammar validator, and emitted as an exportable swimlane blueprint. Ambiguities send the description back to be recompiled rather than patched.</desc>
          <path class="flow" d="M170,110 H238" />
          <path class="flow" d="M392,110 H458" />
          <path class="flow" d="M612,110 H678" />
          <path class="flow flow--dim flow--rev" d="M535,142 C535,196 315,196 315,146" />
          <g class="node"><rect x="10" y="82" width="160" height="56" rx="7" />
            <text x="90" y="106" class="n-t">Plain text</text><text x="90" y="124" class="n-s">"first the analyst&hellip;"</text></g>
          <g class="node"><rect x="238" y="82" width="154" height="56" rx="7" />
            <text x="315" y="106" class="n-t">Parser</text><text x="315" y="124" class="n-s">intent &amp; actors</text></g>
          <g class="node node--hot"><rect x="458" y="82" width="154" height="60" rx="7" />
            <text x="535" y="106" class="n-t">Validator</text><text x="535" y="124" class="n-s n-s--hot">deterministic grammar</text></g>
          <g class="node node--ok"><rect x="678" y="82" width="164" height="56" rx="7" />
            <text x="760" y="106" class="n-t">Swimlane blueprint</text><text x="760" y="124" class="n-s n-s--ok">exportable</text></g>
          <text x="425" y="215" class="edge">ambiguous? recompile, don't patch</text>
        </svg>
      </div>
      <div class="proj__copy">
        <p>A natural-language workflow engine that turns plain-text process descriptions into
        validated, exportable swimlane blueprints &mdash; aimed at business analysts who know the
        process but not the tooling.</p>
        <ul class="proj__pts">
          <li>Cut workflow design turnaround from <b class="hl">hours to under 5 minutes</b> by removing manual Step Functions configuration entirely.</li>
          <li>Ambiguous descriptions are recompiled from a clarified source rather than hand-patched, so the blueprint always matches the text that produced it.</li>
        </ul>
        <ul class="proj__stack"><li>JavaScript</li><li>NLP</li><li>Workflow engines</li></ul>
      </div>
    </div>
  </article>

  <article class="proj reveal" id="graph">
    <div class="proj__head">
      <div>
        <span class="proj__idx">04</span>
        <h3 class="proj__name">Distributed Graph Analysis</h3>
        <p class="proj__tag">PageRank at scale on Spark and EMR</p>
      </div>
      <div class="proj__links">
        <a class="proj__repo" href="https://github.com/Rahu378/distributed-graph-analysis" target="_blank" rel="noopener noreferrer">__GH__ View repo</a>
      </div>
    </div>

    <div class="proj__grid">
      <div class="diagram">
        <svg viewBox="0 0 880 290" role="img" aria-labelledby="dg-t dg-d">
          <title id="dg-t">Distributed graph analysis architecture</title>
          <desc id="dg-d">Graph data in S3 is partitioned across an EMR Spark cluster, iterated through PageRank rounds with tuned shuffle behaviour, and written back as converged ranks.</desc>
          <path class="flow" d="M150,145 H222" />
          <path class="flow flow--dim" d="M420,88 H470" />
          <path class="flow flow--dim" d="M420,145 H470" />
          <path class="flow flow--dim" d="M420,202 H470" />
          <path class="flow" d="M628,145 H698" />
          <path class="flow flow--dim flow--rev" d="M549,110 C549,52 320,52 320,86" />
          <g class="node"><rect x="10" y="117" width="140" height="56" rx="7" />
            <text x="80" y="141" class="n-t">Graph data</text><text x="80" y="159" class="n-s">AWS S3</text></g>
          <g class="cluster"><rect x="222" y="60" width="198" height="182" rx="9" />
            <text x="321" y="82" class="cl-t">EMR &middot; Spark</text></g>
          <g class="node node--part"><rect x="244" y="96" width="154" height="34" rx="5" /><text x="321" y="118" class="n-p">partition 01</text></g>
          <g class="node node--part"><rect x="244" y="140" width="154" height="34" rx="5" /><text x="321" y="162" class="n-p">partition 02</text></g>
          <g class="node node--part"><rect x="244" y="184" width="154" height="34" rx="5" /><text x="321" y="206" class="n-p">partition n</text></g>
          <g class="node node--hot"><rect x="470" y="110" width="158" height="72" rx="7" />
            <text x="549" y="138" class="n-t">PageRank</text><text x="549" y="156" class="n-s">iterate to converge</text>
            <text x="549" y="172" class="n-s n-s--hot">tuned shuffle</text></g>
          <g class="node node--ok"><rect x="698" y="117" width="144" height="56" rx="7" />
            <text x="770" y="141" class="n-t">Ranked nodes</text><text x="770" y="159" class="n-s n-s--ok">linear scalability</text></g>
          <text x="430" y="42" class="edge">re-partition each round</text>
        </svg>
      </div>
      <div class="proj__copy">
        <p>PageRank implemented over large synthetic web graphs, built to evaluate distributed
        graph-processing frameworks for research teams rather than to serve traffic.</p>
        <ul class="proj__pts">
          <li>Achieved <b class="hl">linear scalability</b> across node counts by tuning Spark partition strategy and shuffle behaviour on EMR clusters.</li>
          <li>Shuffle cost, not compute, turned out to be the binding constraint &mdash; the partitioning work is where the speedup lives.</li>
        </ul>
        <ul class="proj__stack"><li>Apache Spark</li><li>AWS EMR</li><li>S3</li></ul>
      </div>
    </div>
  </article>
</section>
""".replace('__GH__', _GH)

# ── SKILLS ─────────────────────────────────────────────────────────────
SKILLS = """
<section class="sec" id="skills">
  <header class="sec__head">
    <span class="sec__tag">03 &mdash; TOOLING</span>
    <h2 class="sec__title">What I work in</h2>
    <p class="sec__sub">Grouped by where it sits in the stack rather than by how well I know it.</p>
  </header>

  <div class="skills">
    <article class="skillset reveal">
      <h3>Languages</h3>
      <ul><li>Python</li><li>Java</li><li>Go</li><li>C++</li><li>JavaScript</li><li>TypeScript</li><li>SQL</li></ul>
    </article>
    <article class="skillset reveal">
      <h3>Frameworks &amp; APIs</h3>
      <ul><li>FastAPI</li><li>Spring Boot</li><li>Django</li><li>gRPC</li><li>RESTful APIs</li><li>LangGraph</li></ul>
    </article>
    <article class="skillset reveal">
      <h3>Cloud &amp; infrastructure</h3>
      <ul><li>AWS EC2</li><li>S3</li><li>RDS</li><li>Lambda</li><li>EMR</li><li>Bedrock</li><li>Textract</li><li>GCP Vertex AI</li><li>Docker</li><li>Kubernetes</li><li>Terraform</li><li>Linux/Unix</li></ul>
    </article>
    <article class="skillset reveal">
      <h3>AI / ML</h3>
      <ul><li>PyTorch</li><li>TensorFlow</li><li>scikit-learn</li><li>Triton</li><li>Metal</li><li>RAG</li><li>LangChain</li><li>MLflow</li><li>DVC</li><li>Airflow</li></ul>
    </article>
    <article class="skillset reveal">
      <h3>Data &amp; storage</h3>
      <ul><li>PostgreSQL</li><li>MySQL</li><li>Oracle</li><li>MongoDB</li><li>Hadoop</li><li>Redis</li></ul>
    </article>
    <article class="skillset reveal">
      <h3>Ops &amp; delivery</h3>
      <ul><li>GitHub Actions</li><li>Jenkins</li><li>Git</li><li>BitBucket / Jira</li><li>Prometheus</li><li>Grafana</li><li>DataDog</li></ul>
    </article>
    <article class="skillset reveal">
      <h3>Networking</h3>
      <ul><li>TCP/IP</li><li>DNS</li><li>DHCP</li><li>BGP</li><li>VLANs</li></ul>
    </article>
    <article class="skillset reveal">
      <h3>Methodologies</h3>
      <ul><li>Agile / Scrum</li><li>SDLC</li><li>Regulatory Compliance (PII / OFAC / AML)</li></ul>
    </article>
    <article class="skillset reveal skillset--soft">
      <h3>Working style</h3>
      <ul><li>Critical Thinking</li><li>Requirements Analysis</li><li>Cross-functional Collaboration</li><li>Technical Mentorship</li></ul>
    </article>
  </div>
</section>
"""

# ── ABOUT ──────────────────────────────────────────────────────────────
ABOUT = """
<section class="sec" id="about">
  <header class="sec__head">
    <span class="sec__tag">04 &mdash; BACKGROUND</span>
    <h2 class="sec__title">About</h2>
  </header>

  <div class="about">
    <figure class="about__photo reveal">
      <img src="/assets/img/rahul.jpg" alt="Rahul Reddy Chidipudi" width="440" height="440" />
    </figure>

    <div class="about__copy reveal">
      <p>I'm a software engineer in McLean, Virginia, working mostly on backend and distributed
      systems &mdash; the request paths, pipelines and infrastructure that only get noticed when
      they break.</p>
      <p>Most of what I enjoy sits at the boundary between systems: forking live traffic without
      disturbing it, keeping two databases honest against each other, deciding what a Spark job
      should shuffle. The projects are largely about that boundary.</p>

      <div class="edu">
        <h3>Education</h3>
        <p class="edu__deg">B.S. Computer Science</p>
        <p class="edu__school">Rowan University &middot; Glassboro, NJ</p>
        <p class="edu__meta">Graduated December 2024 &middot; Merit-based International Credit Transfer Scholarship</p>
        <p class="edu__course">Data Structures &amp; Algorithms &middot; Databases &middot; Operating Systems &middot; Distributed Systems &middot; AI &amp; ML</p>
      </div>

      <div class="certs">
        <h3>Certifications</h3>
        <ul>
          <li>AWS Certified Developer</li>
          <li>Machine Learning Specialization &mdash; StanfordOnline</li>
          <li>IBM Enterprise Design Thinking Practitioner</li>
          <li>Anthropic AI Fluency for Business</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="lead">
    <h3 class="lead__h">Leadership &amp; activities</h3>
    <div class="lead__grid">
      <article class="lead__item reveal">
        <p class="lead__role">Tech Coordinator</p>
        <p class="lead__org">ACM &middot; Rowan University</p>
        <p class="lead__d">Organized 6 hackathons and 12 tech talks on AI, cloud and software architecture &mdash; around <b class="hl">300 students</b> and <b class="hl">$15K</b> in regional sponsorship.</p>
      </article>
      <article class="lead__item reveal">
        <p class="lead__role">Graphic Designer &amp; Team Member, AI &amp; Cloud</p>
        <p class="lead__org">Google Developer Student Club &middot; LPU</p>
        <p class="lead__d">Led ML and Google Cloud workshops for <b class="hl">150+ students</b>, growing membership by <b class="hl">40%</b>.</p>
      </article>
      <article class="lead__item reveal">
        <p class="lead__role">Public Speaker &amp; Event Coordinator</p>
        <p class="lead__org">Orator Student Club &middot; LPU</p>
        <p class="lead__d">Hosted 8 public-speaking workshops and debates, growing participation from 30 to <b class="hl">120+</b>.</p>
      </article>
    </div>
  </div>
</section>
"""

# ── CONTACT ────────────────────────────────────────────────────────────
CONTACT = """
<section class="sec contact" id="contact">
  <header class="sec__head">
    <span class="sec__tag">05 &mdash; CONTACT</span>
    <h2 class="contact__title">Let's build something<br />that holds up.</h2>
    <p class="sec__sub">Open to software engineering roles in backend, distributed systems and applied AI.</p>
  </header>

  <div class="contact__links">
    <a class="clink reveal" href="mailto:rahul.r24.c@gmail.com">
      <span class="clink__k">EMAIL</span><span class="clink__v">rahul.r24.c@gmail.com</span></a>
    <a class="clink reveal" href="https://www.linkedin.com/in/rahulchidipudi/" target="_blank" rel="noopener noreferrer">
      <span class="clink__k">LINKEDIN</span><span class="clink__v">in/rahulchidipudi</span></a>
    <a class="clink reveal" href="https://github.com/Rahu378" target="_blank" rel="noopener noreferrer">
      <span class="clink__k">GITHUB</span><span class="clink__v">github.com/Rahu378</span></a>
    <span class="clink clink--static reveal">
      <span class="clink__k">BASED</span><span class="clink__v">McLean, VA</span></span>
  </div>
</section>
"""

PAGES = [
    {"slug": "", "nav": "HOME", "num": "00", "portrait": True, "wide": False,
     "title": "Rahul Reddy Chidipudi — Software Engineer",
     "desc": "Software engineer building backend and distributed systems in Go, Java and Python. gRPC microservices, Kubernetes, event-driven pipelines, and applied AI.",
     "body": HOME},
    {"slug": "projects", "nav": "SYSTEMS", "num": "01", "wide": True,
     "title": "Systems — Rahul Reddy Chidipudi",
     "desc": "ShadowDB traffic-forking proxy, FinSight AML agent, Text2Workflow, and distributed PageRank on Spark — with architecture diagrams.",
     "body": PROJECTS},
    {"slug": "work", "nav": "EXPERIENCE", "num": "02", "wide": False,
     "title": "Experience — Rahul Reddy Chidipudi",
     "desc": "Software engineering at NextGen IT Solutions, Appworks and DXC Technology.",
     "body": WORK},
    {"slug": "skills", "nav": "TOOLING", "num": "03", "wide": False,
     "title": "Tooling — Rahul Reddy Chidipudi",
     "desc": "Go, Java, Python, gRPC, Kubernetes, Kafka, Spark, AWS, PyTorch and the rest of the stack.",
     "body": SKILLS},
    {"slug": "about", "nav": "ABOUT", "num": "04", "wide": False,
     "title": "About — Rahul Reddy Chidipudi",
     "desc": "Background, education at Rowan University, certifications, and leadership activities.",
     "body": ABOUT},
    {"slug": "contact", "nav": "CONTACT", "num": "05", "wide": False,
     "title": "Contact — Rahul Reddy Chidipudi",
     "desc": "Get in touch with Rahul Reddy Chidipudi, software engineer in McLean, VA.",
     "body": CONTACT},
]

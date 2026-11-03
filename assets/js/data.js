/*
  Single source of truth for résumé content.
  Every page reads from window.RESUME, so dates, numbers and wording only need fixing here
  (the static fallbacks inside each HTML page mirror this file).
*/
window.RESUME = (() => {
  const roles = [
    {
      id: 'nextgen',
      company: 'NextGen IT Solutions',
      client: 'JPMorgan Chase',
      title: 'Full Stack Software Engineer',
      place: 'Ashburn, VA',
      start: 'Feb 2026',
      end: 'Oct 2026',
      kind: 'Full-time',
      mono: 'NG',
      color: '#1a73e8',
      bullets: [
        'Cut average API response time from 450ms to 120ms by adding Redis caching and optimizing complex SQL queries.',
        'Built Java 17 and Spring Boot microservices for a data management platform, improving data processing efficiency by 30%.',
        'Built Jenkins and GitHub Actions CI/CD pipelines for AWS (EC2, S3, RDS), cutting manual deployment time by 80%.',
        'Set up Prometheus and Grafana monitoring for 15+ microservices, catching issues earlier and reducing downtime by 15%.',
        'Worked with product managers and fellow engineers in Agile sprints to turn requirements into on-schedule features.'
      ],
      uses: ['Java', 'Spring Boot', 'Microservices', 'REST APIs', 'Redis', 'SQL', 'Jenkins', 'GitHub Actions',
        'AWS EC2', 'AWS S3', 'AWS RDS', 'Prometheus', 'Grafana']
    },
    {
      id: 'appworks',
      company: 'Appworks',
      title: 'Associate Software Engineer',
      place: 'McAllen, TX',
      start: 'Feb 2025',
      end: 'Jan 2026',
      kind: 'Full-time',
      mono: 'AW',
      color: '#e8710a',
      bullets: [
        'Built modular Java and Python back-end services for core business apps, including third-party REST API integrations.',
        'Led code reviews and unit testing against secure-coding standards, reducing post-release defect density by 15%.',
        'Helped migrate on-premise applications to AWS (EC2, S3), containerizing services and drafting initial IaC templates.'
      ],
      uses: ['Java', 'Python', 'REST APIs', 'AWS EC2', 'AWS S3', 'Docker']
    },
    {
      id: 'dxc',
      company: 'DXC Technology',
      title: 'Software Engineer Intern',
      place: 'Hyderabad, India',
      start: 'May 2022',
      end: 'Oct 2022',
      kind: 'Internship',
      mono: 'DXC',
      color: '#188038',
      bullets: [
        'Built features for a customer-facing web portal in Java, Spring MVC, and JavaScript, and optimized its MySQL queries.',
        'Worked with QA to resolve 50+ defects, improving the portal’s stability and user experience.'
      ],
      uses: ['Java', 'Spring MVC', 'JavaScript', 'MySQL', 'SQL']
    }
  ];

  const projects = [
    {
      id: 'shadowdb',
      name: 'ShadowDB',
      kind: 'Database shadowing proxy',
      color: '#2997ff',
      line: 'Mirrors live database traffic to a shadow database, so schema migrations and chaos tests meet real load before production does.',
      stack: ['Java', 'Netty', 'Kafka', 'PostgreSQL', 'MongoDB', 'Prometheus', 'Grafana'],
      uses: ['Java', 'Netty', 'Kafka', 'PostgreSQL', 'MongoDB', 'Prometheus', 'Grafana'],
      bullets: [
        'Built a Netty proxy that mirrors live database traffic to a shadow database for safe schema-migration and chaos testing.',
        'Benchmarked at 50K+ requests/sec with 3ms average added latency using Netty’s asynchronous, non-blocking I/O.',
        'Added Grafana dashboards comparing primary vs. shadow query performance, surfacing 12+ regressions.'
      ]
    },
    {
      id: 'gateway',
      name: 'API Gateway & Contract Tests',
      short: 'Gateway',
      kind: 'Contract testing framework',
      color: '#30d158',
      line: 'A Spring Boot gateway over five mock financial services, held in place by 150+ edge-case contract tests.',
      stack: ['Java', 'Spring Boot', 'JUnit 5', 'REST Assured', 'Mockito', 'Maven', 'Jenkins'],
      uses: ['Java', 'Spring Boot', 'REST APIs', 'JUnit 5', 'REST Assured', 'Mockito', 'Maven', 'Jenkins'],
      bullets: [
        'Built a Spring Boot gateway over 5 mock financial services with 150+ edge-case contract tests at 92% line coverage.',
        'Cut test boilerplate by 45% with a reusable test-data factory; Mockito isolation exposed 3 race-condition bugs.'
      ]
    },
    {
      id: 'stayfinder',
      name: 'StayFinder',
      kind: 'Vacation-rental booking',
      color: '#ff385c',
      line: 'Search, booking and payments as separate services, with a Kafka saga that gives dates back when a payment fails.',
      stack: ['Java 21', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Elasticsearch', 'Redis', 'Docker'],
      uses: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'PostgreSQL', 'Elasticsearch', 'Redis', 'Docker', 'k6'],
      bullets: [
        'Split search, booking, and payments into services; a Kafka-based saga releases held dates when a payment fails.',
        'Elasticsearch geo, date, and price search over 1M seeded listings held p99 under 150ms at 1,500 req/s in k6 load tests.'
      ]
    },
    {
      id: 'tripplanner',
      name: 'Trip Planner',
      full: 'Trip Planner GraphQL API',
      kind: 'GraphQL API with AI itineraries',
      color: '#ff9f0a',
      line: 'A GraphQL API for trips and wishlists that batches its database work and suggests itineraries with an LLM.',
      stack: ['Kotlin', 'Spring Boot', 'Spring for GraphQL', 'Spring AI', 'MySQL', 'Redis'],
      uses: ['Kotlin', 'Spring Boot', 'GraphQL', 'Spring AI', 'MySQL', 'Redis'],
      bullets: [
        'Designed a GraphQL schema for trips and wishlists; DataLoader batching cut database calls per query from 40+ to 3.',
        'Added AI itinerary suggestions via Spring AI and an LLM API; Redis response caching kept API cost under $5/month.'
      ]
    },
    {
      id: 'finsight',
      name: 'FinSight',
      kind: 'AI financial compliance agent',
      color: '#ffd60a',
      line: 'An AWS Bedrock agent that reads transactions the way a compliance analyst would, and writes up what it finds.',
      stack: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'AWS Bedrock', 'Docker'],
      uses: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'AWS Bedrock', 'Docker'],
      bullets: [
        'Built an AWS Bedrock agent that flags BSA structuring, screens OFAC/AML watchlists, and generates audit-ready reports.'
      ]
    },
    {
      id: 'gallery',
      name: 'The Gallery',
      kind: 'Agentic F1 broadcast director',
      color: '#bf5af2',
      line: 'A race director that watches 10 Hz telemetry and decides, live, which battle the cameras should be on.',
      stack: ['Python', 'FastAPI', 'WebSockets', 'Gemini 2.5', 'Three.js'],
      uses: ['Python', 'FastAPI', 'WebSockets', 'Gemini 2.5', 'Three.js'],
      bullets: [
        'Paired a 10 Hz telemetry scorer with Gemini 2.5 Flash to direct a live F1 feed, catching 50% of passes vs. a 1.8% baseline.'
      ]
    }
  ];

  const credentials = [
    {
      id: 'aws-cert',
      name: 'AWS Certified Developer – Associate',
      by: 'Amazon Web Services',
      uses: ['AWS EC2', 'AWS S3', 'AWS RDS', 'AWS Lambda', 'AWS DynamoDB', 'AWS CloudWatch']
    },
    {
      id: 'ml-cert',
      name: 'Machine Learning Specialization',
      by: 'Stanford Online & DeepLearning.AI',
      uses: ['Machine Learning', 'Python']
    }
  ];

  const skills = [
    { group: 'Languages', items: ['Java', 'Kotlin', 'Python', 'SQL', 'JavaScript', 'TypeScript'] },
    { group: 'Backend', items: ['Spring Boot', 'Spring MVC', 'Spring Security', 'JPA/Hibernate', 'REST APIs', 'Microservices', 'GraphQL', 'Kafka', 'Netty', 'FastAPI', 'WebSockets'] },
    { group: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
    { group: 'Cloud & DevOps', items: ['AWS EC2', 'AWS S3', 'AWS RDS', 'AWS Lambda', 'AWS DynamoDB', 'AWS CloudWatch', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions'] },
    { group: 'AI', items: ['AWS Bedrock', 'Spring AI', 'Gemini 2.5', 'Machine Learning'] },
    { group: 'Frontend', items: ['React', 'Redux', 'HTML5', 'CSS3', 'Three.js'] },
    { group: 'Testing & Tools', items: ['JUnit 5', 'Mockito', 'REST Assured', 'k6', 'Postman', 'Maven', 'Git', 'Prometheus', 'Grafana', 'Jira'] }
  ];

  return {
    name: 'Rahul Chidipudi',
    email: 'rahulchidipudi@outlook.com',
    phone: '+1 (856) 526-9115',
    phoneHref: 'tel:+18565269115',
    github: 'https://github.com/Rahu378',
    githubLabel: 'github.com/Rahu378',
    linkedin: 'https://www.linkedin.com/in/rahulchidipudi',
    resume: 'Rahul_Chidipudi_Resume.pdf',
    location: 'United States',
    roles,
    projects,
    credentials,
    skills
  };
})();

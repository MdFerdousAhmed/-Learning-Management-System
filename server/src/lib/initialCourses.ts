export const INITIAL_FALLBACK_COURSES = [
  {
    _id: "6ac8b6a5338beea476d6500b",
    title: "Site Reliability Engineering (SRE): Incident Postmortems & Error Budgets",
    slug: "site-reliability-engineering-sre-incident-postmortems-error-budgets",
    description: "Architect production resilience with SLIs, SLOs, multi-window multi-burn-rate alerts, chaos engineering, and blameless postmortem culture.",
    category: "DevOps",
    difficulty: "Advanced",
    price: 139,
    duration: "26 hours",
    status: "Published",
    instructorName: "Dr. Elena Rostova",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=800&auto=format&fit=crop",
    enrolledStudentsCount: 1420,
    learningObjectives: [
      "Define quantitative Service Level Indicators (SLIs) and Service Level Objectives (SLOs)",
      "Design multi-window burn rate alert algorithms to eliminate alert fatigue",
      "Execute automated chaos experiments using Chaos Mesh and LitmusChaos",
      "Conduct blameless postmortems with comprehensive root cause analysis",
    ],
    requirements: ["Experience running Linux servers or containerized microservices", "Basic Prometheus & Grafana knowledge"],
    modules: [
      {
        title: "Module 1: Foundations of Reliability & Error Budgets",
        lessons: [
          {
            title: "1.1 The Mathematics of Reliability & Five Nines Fallacy",
            duration: "18 min",
            content: "Explore uptime calculations, maintenance windows, and why 100% availability is almost always the wrong target.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            title: "1.2 Designing SLIs and SLOs for High-Traffic APIs",
            duration: "24 min",
            content: "How to craft good SLIs: latency percentiles (p95, p99), error ratios, and availability measuring.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
        ],
      },
      {
        title: "Module 2: Alerting Systems & Burn-Rate Algorithms",
        lessons: [
          {
            title: "2.1 Multi-Window Multi-Burn-Rate Alert Rules in Prometheus",
            duration: "22 min",
            content: "Step-by-step configuration of 1h and 6h burn-rate alerts with zero false-alarm tolerance.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
        ],
      },
    ],
    quizzes: [
      {
        title: "SRE Assessment: Error Budgets & Burn Rates",
        description: "Test your understanding of reliability engineering metrics and multi-window burn-rate alerts.",
        timeLimitMinutes: 15,
        passingScore: 70,
        questions: [
          {
            questionText: "What does an error budget represent in Site Reliability Engineering?",
            options: [
              "The allowable fraction of unreliable service over a specified measurement window",
              "The financial budget allocated to bug bounties",
              "The disk space allocated for error logs",
              "The number of support tickets opened per day",
            ],
            correctAnswerIndex: 0,
            points: 50,
          },
          {
            questionText: "Why are multi-window multi-burn-rate alerts superior to simple static threshold alerts?",
            options: [
              "They catch rapid severe budget consumption while avoiding false alarms from brief transient spikes",
              "They reduce CPU usage on the monitoring server to zero",
              "They automatically delete corrupted logs",
              "They only trigger during business hours",
            ],
            correctAnswerIndex: 0,
            points: 50,
          },
        ],
      },
    ],
    assignments: [
      {
        title: "Hands-on Lab: Configure Multi-Burn-Rate Prometheus Rules",
        instructions: "Construct a PrometheusRule CRD that implements multi-window burn-rate alerts for a critical checkout API. Submit your manifest YAML and alert simulation test output.",
        totalMarks: 100,
      },
    ],
  },
  {
    _id: "6ac8b6a5338beea476d6495b",
    title: "Apache Kafka Internals: Partitioning, Replication & Low-Latency Streaming",
    slug: "apache-kafka-internals-partitioning-replication",
    description: "Master distributed commit logs, KRaft consensus protocol, ISR replication, consumer group rebalancing, and zero-copy OS performance tuning.",
    category: "Architecture",
    difficulty: "Advanced",
    price: 149,
    duration: "28 hours",
    status: "Published",
    instructorName: "Dr. Elena Rostova",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    enrolledStudentsCount: 3120,
    learningObjectives: [
      "Master partition layouts, index files, and zero-copy sendfile syscalls",
      "Understand KRaft metadata quorums and controller election failovers",
      "Provision enterprise Kafka and Raft clusters with Docker Compose",
    ],
    requirements: ["Proficiency in modern TypeScript, Java, or Python", "Basic networking concepts"],
    modules: [
      {
        title: "Module 1: Event-Driven Fundamentals",
        lessons: [
          {
            title: "1.1 Introduction to Distributed Event Streams",
            duration: "14 min",
            content: "Event-driven architectures decouple producers from consumers through an immutable append-only log.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            title: "1.2 Pub/Sub vs Message Queue Topologies",
            duration: "20 min",
            content: "Explore the architectural trade-offs between point-to-point queues and distributed replayable stream logs.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
        ],
      },
    ],
    quizzes: [
      {
        title: "Quiz: Kafka Fault Tolerance",
        description: "Assess your mastery of partition failovers and ISR pools.",
        timeLimitMinutes: 15,
        passingScore: 70,
        questions: [
          {
            questionText: "Which component acts as the consensus metadata coordinator in modern KRaft-based Kafka clusters?",
            options: ["KRaft Quorum Controller with Raft metadata log", "Apache ZooKeeper ensemble", "Client-side producer pool", "OS Kernel page cache"],
            correctAnswerIndex: 0,
            points: 50,
          },
        ],
      },
    ],
    assignments: [
      {
        title: "Lab: Deploy a 3-broker KRaft Cluster",
        instructions: "Deploy a 3-broker KRaft cluster using Docker Compose and benchmark partition failover.",
        totalMarks: 100,
      },
    ],
  },
  {
    _id: "6ac8b6a5338beea476d6495c",
    title: "Full-Stack Web Engineering with React, Node.js & TypeScript",
    slug: "full-stack-web-engineering-react-node",
    description: "Master modern enterprise full-stack engineering with Next.js, Express, TypeScript, and MongoDB from architecture to production containerization.",
    category: "Development",
    difficulty: "Beginner",
    price: 89,
    duration: "24 hours",
    status: "Published",
    instructorName: "Dr. Sarah Jenkins",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    enrolledStudentsCount: 5240,
    learningObjectives: [
      "Build scalable Node.js and Express REST APIs with JWT & bcrypt",
      "Design MongoDB schemas and relations with Mongoose",
      "Develop interactive React and Next.js applications",
    ],
    requirements: ["Basic knowledge of JavaScript (ES6+)", "Node.js installed on your machine"],
    modules: [
      {
        title: "Module 1: Foundations & Architecture",
        lessons: [
          {
            title: "1.1 Client-Server Communication & HTTP Protocol",
            duration: "18 min",
            content: "Learn how the HTTP protocol, REST APIs, headers, and browsers communicate under the hood.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
        ],
      },
    ],
    quizzes: [],
    assignments: [],
  },
  {
    _id: "6ac8b6a5338beea476d6495d",
    title: "Applied Generative AI & LLM Systems Engineering",
    slug: "generative-ai-systems-engineering",
    description: "Architect multi-agent workflows, vector databases, RAG pipelines, and fine-tuned open-source models with Python & LangChain.",
    category: "AI & ML",
    difficulty: "Advanced",
    price: 159,
    duration: "30 hours",
    status: "Published",
    instructorName: "Marcus Vance",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
    enrolledStudentsCount: 4190,
    learningObjectives: [
      "Build production RAG pipelines with hybrid keyword-vector search",
      "Implement multi-agent collaborative workflows",
      "Deploy localized Ollama and HuggingFace models",
    ],
    requirements: ["Intermediate Python", "Familiarity with embeddings"],
    modules: [
      {
        title: "Module 1: Vector Databases & Embeddings",
        lessons: [
          {
            title: "1.1 HNSW Indexes and Vector Similarity Metrics",
            duration: "25 min",
            content: "Deep dive into cosine similarity, dot product, and approximate nearest neighbor search.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        ],
      },
    ],
    quizzes: [],
    assignments: [],
  },
  {
    _id: "6ac8b6a5338beea476d6495e",
    title: "Kubernetes & Cloud-Native Microservices at Scale",
    slug: "kubernetes-cloud-native-microservices-scale",
    description: "Deploy, orchestrate, and observe high-availability distributed microservices with Helm, Istio service mesh, and ArgoCD GitOps.",
    category: "DevOps",
    difficulty: "Intermediate",
    price: 119,
    duration: "22 hours",
    status: "Published",
    instructorName: "Alex Rivera",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
    enrolledStudentsCount: 2840,
    learningObjectives: [
      "Master Kubernetes architecture: control plane, kubelet, and etcd",
      "Configure Ingress controllers, cert-manager, and TLS termination",
      "Implement canary and blue-green deployments with Argo Rollouts",
    ],
    requirements: ["Basic Docker and Linux CLI understanding"],
    modules: [
      {
        title: "Module 1: Pods, Deployments & Networking",
        lessons: [
          {
            title: "1.1 Cluster Architecture & Core Primitives",
            duration: "20 min",
            content: "Understand how Kubernetes coordinates containers across a fleet of compute nodes.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
        ],
      },
    ],
    quizzes: [],
    assignments: [],
  },
  {
    _id: "6ac8b6a5338beea476d6495f",
    title: "Advanced Data Engineering with Apache Spark & Delta Lake",
    slug: "advanced-data-engineering-apache-spark-delta-lake",
    description: "Design petabyte-scale lakehouse architectures with PySpark, Delta Lake ACID transactions, structured streaming, and data quality pipelines.",
    category: "Data Engineering",
    difficulty: "Advanced",
    price: 149,
    duration: "28 hours",
    status: "Published",
    instructorName: "Dr. Sarah Jenkins",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    enrolledStudentsCount: 1980,
    learningObjectives: [
      "Execute distributed PySpark transformations and optimizations",
      "Implement Medallion lakehouse architecture (Bronze, Silver, Gold)",
      "Enforce data governance and time travel with Delta Lake",
    ],
    requirements: ["Basic SQL and Python proficiency"],
    modules: [
      {
        title: "Module 1: Lakehouse Foundations",
        lessons: [
          {
            title: "1.1 Medallion Architecture Principles",
            duration: "18 min",
            content: "How modern data lakes transform raw data into high-value analytical gold tables.",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
        ],
      },
    ],
    quizzes: [],
    assignments: [],
  },
];

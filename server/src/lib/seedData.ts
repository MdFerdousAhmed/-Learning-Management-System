import mongoose from "mongoose";
import { Course } from "../models/Course";
import { User } from "../models/User";
import { Enrollment } from "../models/Enrollment";
import { Submission } from "../models/Submission";

// Curated 100 realistic courses blueprint across technical disciplines
const COURSE_CATALOG_BLUEPRINTS = [
  // 1-10: Advanced Architecture & Distributed Systems
  {
    title: "Distributed Consensus Protocols: Raft, Paxos & Zab in Depth",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "24 hours",
    price: 139,
    description: "Deep dive into state machine replication, leader election terms, quorum slices, and log compaction algorithms.",
    modules: ["Consensus Foundations", "The Raft Protocol", "Multi-Paxos Mechanics", "Production Failover Scenarios"],
  },
  {
    title: "CQRS & Event Sourcing Architecture with Apache Kafka",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "20 hours",
    price: 129,
    description: "Decouple read and write models with event sourcing, projection rebuilds, snapshot stores, and eventual consistency.",
    modules: ["Event Sourcing Basics", "Kafka Event Store", "Read Model Projections", "Eventual Consistency"],
  },
  {
    title: "Zero-Trust Security Architecture for Cloud-Native Microservices",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "18 hours",
    price: 119,
    description: "Implement SPIFFE/SPIRE workload identities, mTLS service meshes, Open Policy Agent (OPA) gatekeepers, and RBAC.",
    modules: ["Zero Trust Principles", "mTLS with Envoy", "OPA Policy as Code", "Continuous Identity Verification"],
  },
  {
    title: "High-Frequency Low-Latency Systems Architecture in C++ & Rust",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "32 hours",
    price: 169,
    description: "Lock-free data structures, cache-line alignment, kernel bypass (DPDK/Solarflare), and sub-microsecond event loops.",
    modules: ["Memory Hierarchy & Cache", "Lock-Free Ring Buffers", "Kernel Bypass Networking", "Benchmarking Sub-Microsecond Code"],
  },
  {
    title: "Database Internals: Storage Engines, B-Trees & LSM Trees",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "26 hours",
    price: 149,
    description: "Understand page layout, Write-Ahead Logging (WAL), MVCC, RocksDB LSM-trees, and B+Tree concurrency control.",
    modules: ["Page Layout & Buffer Pool", "Write-Ahead Logging", "LSM vs B-Tree Engines", "Multi-Version Concurrency (MVCC)"],
  },
  {
    title: "Enterprise Domain-Driven Design (DDD) & Strategic Monolith Decomposition",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "22 hours",
    price: 99,
    description: "Bounded contexts, aggregate roots, domain events, anti-corruption layers, and decomposing legacy monoliths safely.",
    modules: ["Strategic Design & Context Maps", "Aggregates & Value Objects", "Domain Events Pipeline", "Strangler Fig Pattern"],
  },
  {
    title: "Distributed Caching Topologies with Redis Cluster & Dragonfly",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "16 hours",
    price: 89,
    description: "Cache-aside, write-through, write-behind, cache stamps, consistent hashing rings, and multi-region synchronization.",
    modules: ["Caching Strategies", "Redis Cluster & Hash Slots", "Cache Stampede Mitigation", "Active-Active Geo-Replication"],
  },
  {
    title: "Global Multi-Region Distributed Systems with Spanner & CockroachDB",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "28 hours",
    price: 159,
    description: "TrueTime API, GPS/atomic clocks, serializable isolation levels, and survival of regional cloud outages.",
    modules: ["Physical Clocks vs Hybrid Clocks", "Google TrueTime Architecture", "Raft Range Splitting", "Multi-Region Survivability"],
  },
  {
    title: "API Gateway Patterns: Rate Limiting, Circuit Breakers & Token Buckets",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "15 hours",
    price: 79,
    description: "Architect resilient API gateways using Kong, Envoy, and Cloudflare Workers with distributed rate limiters.",
    modules: ["Gateway Topology", "Distributed Rate Limiting", "Circuit Breakers & Retries", "Edge Token Authentication"],
  },
  {
    title: "Micro-Frontend Orchestration with Module Federation",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "18 hours",
    price: 95,
    description: "Scale large engineering organizations with decentralized frontend deployments, shared design tokens, and runtime federation.",
    modules: ["Micro-Frontend Paradigms", "Webpack Module Federation", "State Sharing & Routing", "Independent CI/CD Pipelines"],
  },

  // 11-20: Modern Full-Stack & Web Development
  {
    title: "Mastering Next.js 15: Server Components, Server Actions & Turbopack",
    category: "Development",
    difficulty: "Intermediate" as const,
    duration: "24 hours",
    price: 99,
    description: "Production Next.js application architecture: App Router, streaming SSR, partial prerendering, and caching mechanisms.",
    modules: ["App Router Fundamentals", "React Server Components (RSC)", "Server Actions & Mutations", "Partial Prerendering (PPR)"],
  },
  {
    title: "Full-Stack TypeScript: Strict Types from Database to Browser",
    category: "Development",
    difficulty: "Intermediate" as const,
    duration: "20 hours",
    price: 89,
    description: "End-to-end type safety using tRPC, Zod validation, Prisma, and Next.js without code generation.",
    modules: ["Advanced TypeScript Types", "Zod Schema Inference", "tRPC Client-Server Bridge", "Strict Monorepo Setup"],
  },
  {
    title: "React 19 Deep Dive: Actions, useOptimistic & Asset Loading",
    category: "Development",
    difficulty: "Advanced" as const,
    duration: "16 hours",
    price: 85,
    description: "Master React 19's newest features: the compiler, useActionState, useOptimistic, and new document metadata hooks.",
    modules: ["React 19 Compiler", "Action Hooks & Transitions", "Optimistic UI Updates", "Suspense & Streaming Hydration"],
  },
  {
    title: "Node.js Performance Tuning: Event Loop, Worker Threads & Profiling",
    category: "Development",
    difficulty: "Advanced" as const,
    duration: "22 hours",
    price: 119,
    description: "Diagnose event loop lag, memory leaks with Chrome DevTools, CPU profiling, and scaling with cluster mode.",
    modules: ["Event Loop Phases", "V8 Memory Management & GC", "Clinic.js & CPU Profiling", "Worker Threads & SharedArrayBuffer"],
  },
  {
    title: "Building Real-Time Collaborative Web Apps with WebSockets & CRDTs",
    category: "Development",
    difficulty: "Advanced" as const,
    duration: "25 hours",
    price: 139,
    description: "Architect Google Docs-style collaborative editing with Yjs, Automerge, WebRTC mesh, and resilient WebSocket clusters.",
    modules: ["WebSockets at Scale", "Conflict-Free Replicated Data Types", "Yjs Collaborative State", "Awareness & Offline Sync"],
  },
  {
    title: "Go for Enterprise Microservices: gRPC, Protobuf & Concurrency",
    category: "Development",
    difficulty: "Intermediate" as const,
    duration: "28 hours",
    price: 109,
    description: "Build ultra-fast backend microservices in Go: goroutines, channels, context cancellation, and streaming gRPC.",
    modules: ["Go Concurrency & Channels", "Protocol Buffers v3", "Bidirectional gRPC Streams", "Production Observability in Go"],
  },
  {
    title: "GraphQL Federation with Apollo Router & Rust Subgraphs",
    category: "Development",
    difficulty: "Intermediate" as const,
    duration: "18 hours",
    price: 99,
    description: "Unify decoupled backend services into a single graph with Apollo Federation v2, entity resolvers, and query plans.",
    modules: ["Federation 2 Core Concepts", "Apollo Router in Rust", "Entities & Key Directives", "Schema Composition & CI Checks"],
  },
  {
    title: "Modern Python 3.12 Backend Engineering with FastAPI & AsyncIO",
    category: "Development",
    difficulty: "Beginner" as const,
    duration: "20 hours",
    price: 79,
    description: "Asynchronous Python web APIs with FastAPI, Pydantic v2, dependency injection, and async SQLAlchemy.",
    modules: ["AsyncIO Event Loop", "FastAPI Route Handlers", "Pydantic v2 Serialization", "Async Database Connections"],
  },
  {
    title: "Rust for Web Developers: From Zero to WebAssembly & Axum",
    category: "Development",
    difficulty: "Intermediate" as const,
    duration: "30 hours",
    price: 129,
    description: "Borrow checker, ownership, traits, async Tokio runtime, building high-throughput web APIs with Axum.",
    modules: ["Ownership & Lifetimes", "Traits & Pattern Matching", "Axum Web Framework", "Wasm in the Browser"],
  },
  {
    title: "High-Performance CSS, Tailwind & Modern Design Systems",
    category: "Development",
    difficulty: "Beginner" as const,
    duration: "14 hours",
    price: 69,
    description: "Build accessible, beautiful design systems with Tailwind CSS, CSS Grid subgrid, container queries, and Radix UI.",
    modules: ["Modern CSS Layouts", "Tailwind Design Tokens", "Radix UI Primitives", "Fluid Typography & Dark Mode"],
  },

  // 21-30: AI, LLMs & Machine Learning Engineering
  {
    title: "Enterprise RAG: Advanced Retrieval, Reranking & Vector DBs",
    category: "AI & ML",
    difficulty: "Advanced" as const,
    duration: "26 hours",
    price: 149,
    description: "Hybrid search with BM25 + dense vectors, Cohere rerankers, semantic routing, parent-document chunking, and evaluation.",
    modules: ["Vector Math & Indexing (HNSW)", "Chunking Strategies", "Cross-Encoder Rerankers", "RAG Triad Evaluation (Ragas)"],
  },
  {
    title: "Building Autonomous AI Agents with LangGraph & Multi-Agent Swarms",
    category: "AI & ML",
    difficulty: "Advanced" as const,
    duration: "24 hours",
    price: 139,
    description: "Stateful agentic graphs, human-in-the-loop approvals, supervisor swarms, tool use, and long-term memory.",
    modules: ["StateGraph Fundamentals", "Tool Calling & Schemas", "Multi-Agent Collaboration", "Persistence & Time Travel"],
  },
  {
    title: "Fine-Tuning Open Source LLMs with LoRA, QLoRA & Unsloth",
    category: "AI & ML",
    difficulty: "Advanced" as const,
    duration: "28 hours",
    price: 159,
    description: "Train Llama 3 and Mistral on custom instruction datasets using 4-bit quantization, parameter-efficient fine-tuning, and HuggingFace.",
    modules: ["Quantization Mechanics (NF4)", "LoRA Rank & Alpha Weights", "Unsloth GPU Acceleration", "Evaluation & Model Merging"],
  },
  {
    title: "Production LLMOps: Latency Optimization, vLLM & TensorRT-LLM",
    category: "AI & ML",
    difficulty: "Advanced" as const,
    duration: "22 hours",
    price: 145,
    description: "Continuous batching, PagedAttention, speculative decoding, model quantization (AWQ/GPTQ), and deploying vLLM on Kubernetes.",
    modules: ["PagedAttention & KV Cache", "Continuous Batching with vLLM", "TensorRT-LLM Engines", "Prometheus Metrics for LLMs"],
  },
  {
    title: "PyTorch Deep Learning Foundations: Computer Vision to Transformers",
    category: "AI & ML",
    difficulty: "Intermediate" as const,
    duration: "30 hours",
    price: 119,
    description: "Tensors, autograd, convolution layers, self-attention mechanisms, and training custom neural networks from scratch.",
    modules: ["PyTorch Tensors & GPU Ops", "Backpropagation from Scratch", "CNNs & Image Classification", "Transformer Attention Blocks"],
  },
  {
    title: "Multimodal AI Applications: Vision, Audio & Whisper Integration",
    category: "AI & ML",
    difficulty: "Intermediate" as const,
    duration: "18 hours",
    price: 99,
    description: "Process video, images, and voice streams using OpenAI Whisper, CLIP embeddings, and multimodal vision language models.",
    modules: ["Vision Transformers (ViT)", "Audio Transcriptions with Whisper", "Cross-Modal Embeddings", "Real-Time Voice Streaming APIs"],
  },
  {
    title: "Vector Search at Scale: Milvus, Pinecone & pgvector Performance",
    category: "AI & ML",
    difficulty: "Intermediate" as const,
    duration: "16 hours",
    price: 89,
    description: "Index 100M+ vectors with IVFFlat, HNSW, metadata filtering, partition keys, and hardware acceleration.",
    modules: ["Nearest Neighbor Search Math", "HNSW Graph Construction", "pgvector in PostgreSQL", "Distributed Milvus Clusters"],
  },
  {
    title: "AI Safety, Guardrails & LLM Red-Teaming for Production Systems",
    category: "AI & ML",
    difficulty: "Intermediate" as const,
    duration: "15 hours",
    price: 89,
    description: "Mitigate prompt injection, jailbreaks, PII exfiltration, and toxic outputs using NeMo Guardrails and Llama Guard.",
    modules: ["Prompt Injection Vectors", "Input & Output Rail Policies", "Llama Guard Classifier Setup", "Automated Red-Teaming Suites"],
  },
  {
    title: "LangChain in Production: Streaming, Caching & Memory Architectures",
    category: "AI & ML",
    difficulty: "Beginner" as const,
    duration: "18 hours",
    price: 79,
    description: "LCEL syntax, async streaming responses, token usage telemetry, and persistent user conversational memory.",
    modules: ["LCEL Expression Language", "SSE Streaming to React", "Semantic Caching with Redis", "Telemetry with Langfuse"],
  },
  {
    title: "Synthetic Data Generation & DPO/RLHF Alignment for Custom Models",
    category: "AI & ML",
    difficulty: "Advanced" as const,
    duration: "20 hours",
    price: 129,
    description: "Generate high-quality instruction datasets, preference pair curation, and Direct Preference Optimization (DPO).",
    modules: ["Self-Instruct Techniques", "Preference Pair Annotation", "DPO vs PPO Training", "Benchmarking with MT-Bench"],
  },

  // 31-40: Cloud, DevOps & Site Reliability Engineering (SRE)
  {
    title: "Kubernetes Production Engineering: Autoscaling, Ingress & GitOps",
    category: "DevOps",
    difficulty: "Advanced" as const,
    duration: "26 hours",
    price: 129,
    description: "Cluster autoscaling with Karpenter, ArgoCD GitOps pipelines, cert-manager automated TLS, and multi-tenant namespaces.",
    modules: ["Karpenter Node Autoscaling", "ArgoCD Application Sets", "Ingress NGINX & Cert-Manager", "Network Policies & Security Contexts"],
  },
  {
    title: "Terraform & OpenTofu: Modular Enterprise Infrastructure as Code",
    category: "DevOps",
    difficulty: "Intermediate" as const,
    duration: "22 hours",
    price: 99,
    description: "State management, remote backends with DynamoDB locking, reusable module design, and automated PR plans with Atlantis.",
    modules: ["HCL Syntax & State Locks", "Reusable Cloud Modules", "Drift Detection & Terragrunt", "Atlantis CI Automation"],
  },
  {
    title: "Observability Engineering: Prometheus, Grafana & OpenTelemetry",
    category: "DevOps",
    difficulty: "Intermediate" as const,
    duration: "24 hours",
    price: 109,
    description: "Instrument microservices with OTel SDKs, collector pipelines, RED metrics, trace exemplars, and Grafana Tempo.",
    modules: ["The Three Pillars of Observability", "OpenTelemetry Collector Config", "PromQL Query Optimization", "Distributed Tracing in Tempo"],
  },
  {
    title: "CI/CD Pipeline Mastery with GitHub Actions & Docker Layer Caching",
    category: "DevOps",
    difficulty: "Beginner" as const,
    duration: "16 hours",
    price: 69,
    description: "Multi-stage Docker builds, BuildKit cache mounts, matrix test runners, OIDC cloud authentication, and semantic releases.",
    modules: ["GitHub Actions Workflows", "BuildKit Cache Mounts", "OIDC Keyless Cloud Auth", "Canary Deployment Gates"],
  },
  {
    title: "AWS Cloud Solutions Architect: High Availability & Cost Optimization",
    category: "DevOps",
    difficulty: "Intermediate" as const,
    duration: "30 hours",
    price: 119,
    description: "VPC subnetting, Transit Gateways, ALB/NLB topologies, Aurora Serverless, and AWS Well-Architected Framework.",
    modules: ["VPC Peering & Routing Tables", "Compute: ECS Fargate vs EKS", "Multi-AZ Storage Strategies", "FinOps & Cost Allocation Tags"],
  },
  {
    title: "Service Mesh with Istio & Envoy: Traffic Shifting & mTLS Security",
    category: "DevOps",
    difficulty: "Advanced" as const,
    duration: "22 hours",
    price: 139,
    description: "Canary traffic splitting with VirtualServices, fault injection, Envoy access logs, and mutual TLS encryption.",
    modules: ["Envoy Sidecar Mechanics", "Istio Control Plane (istiod)", "Traffic Shifting & Canary Releases", "Distributed Fault Injection"],
  },
  {
    title: "Chaos Engineering in Practice: Simulating Outages with Chaos Mesh",
    category: "DevOps",
    difficulty: "Advanced" as const,
    duration: "18 hours",
    price: 119,
    description: "Inject packet delays, kill Kubernetes pods, fill storage volumes, and validate SLO alert firing.",
    modules: ["Chaos Engineering Principles", "Pod & Network Chaos Experiments", "I/O & Stress Testing", "GameDay Runbooks & SLOs"],
  },
  {
    title: "Linux Kernel Internals & eBPF Observability with Cilium",
    category: "DevOps",
    difficulty: "Advanced" as const,
    duration: "28 hours",
    price: 159,
    description: "Write custom eBPF programs in C, hook kernel tracepoints, high-performance packet routing with Cilium CNI.",
    modules: ["eBPF Virtual Machine & Maps", "Kprobes & Tracepoints", "Cilium High-Speed Networking", "Security Observability with Tetragon"],
  },
  {
    title: "Serverless Architecture on AWS: Lambda, EventBridge & Step Functions",
    category: "DevOps",
    difficulty: "Intermediate" as const,
    duration: "20 hours",
    price: 89,
    description: "Event-driven serverless architectures, cold start mitigation, DynamoDB single-table design, and Step Functions workflows.",
    modules: ["AWS Lambda Cold Starts", "EventBridge Routing Rules", "Step Functions State Machines", "DynamoDB Single-Table Modeling"],
  },
  {
    title: "Google Cloud Platform (GCP) Enterprise Architecture & Cloud Run",
    category: "DevOps",
    difficulty: "Intermediate" as const,
    duration: "22 hours",
    price: 99,
    description: "Cloud Run container deployments, Google Cloud Storage, BigQuery integration, VPC Service Controls, and IAM.",
    modules: ["Cloud Run Microservices", "GCP VPC & Private Service Access", "BigQuery Analytics Pipeline", "Workload Identity Federation"],
  },

  // 41-50: Data Engineering & Analytics Pipelines
  {
    title: "Apache Spark & PySpark for Big Data Batch & Stream Processing",
    category: "Data Engineering",
    difficulty: "Advanced" as const,
    duration: "30 hours",
    price: 139,
    description: "Resilient Distributed Datasets (RDDs), Catalyst optimizer, Structured Streaming, shuffle partitions, and memory tuning.",
    modules: ["Spark Execution Engine", "DataFrame API & Catalyst", "Structured Streaming on Kafka", "Shuffle Partition Optimization"],
  },
  {
    title: "Data Lakehouse Architecture with Apache Iceberg & Trino",
    category: "Data Engineering",
    difficulty: "Advanced" as const,
    duration: "24 hours",
    price: 149,
    description: "ACID transactions on S3, hidden partitioning, schema evolution, time-travel queries, and federated SQL with Trino.",
    modules: ["Iceberg Metadata Trees", "Snapshot Management & Time Travel", "Trino Distributed SQL Engine", "Compaction & Maintenance Jobs"],
  },
  {
    title: "Real-Time Stream Processing with Apache Flink & Stateful Functions",
    category: "Data Engineering",
    difficulty: "Advanced" as const,
    duration: "28 hours",
    price: 159,
    description: "Event time vs processing time, watermarks, tumbling and sliding windows, RocksDB state backends, and exactly-once sinks.",
    modules: ["Flink Streaming Runtime", "Watermarks & Late Data", "Keyed State & Checkpointing", "Flink SQL & Kafka Integration"],
  },
  {
    title: "Modern Data Pipeline Orchestration with Apache Airflow 2 & Dagster",
    category: "Data Engineering",
    difficulty: "Intermediate" as const,
    duration: "22 hours",
    price: 99,
    description: "Write programmatic DAGs, dynamic task mapping, Celery executors, asset-based data pipelines, and error alerts.",
    modules: ["Airflow DAG Construction", "Dynamic Task Mapping", "Dagster Asset-Based Pipelines", "Data Quality Validations with Great Expectations"],
  },
  {
    title: "Data Modeling with dbt (data build tool) & Snowflake Warehouse",
    category: "Data Engineering",
    difficulty: "Beginner" as const,
    duration: "18 hours",
    price: 89,
    description: "Transform raw data warehouse tables into clean dimensional star schemas using dbt, Jinja templating, and CI testing.",
    modules: ["dbt Models & Ref Tags", "Jinja Macros & Materializations", "Dimensional Modeling (Kimball)", "Snowflake Virtual Warehouses"],
  },
  {
    title: "PostgreSQL DBA Masterclass: Query Plans, VACUUM & Replication",
    category: "Data Engineering",
    difficulty: "Advanced" as const,
    duration: "26 hours",
    price: 129,
    description: "EXPLAIN ANALYZE deep dive, WAL replication slots, autovacuum tuning, connection pooling with PgBouncer, and partition tables.",
    modules: ["Query Optimizer & Scan Types", "Autovacuum & Bloat Remediation", "Streaming Replication & Failover", "PgBouncer Connection Pooling"],
  },
  {
    title: "ClickHouse: Ultra-Fast Real-Time Columnar Analytics",
    category: "Data Engineering",
    difficulty: "Intermediate" as const,
    duration: "20 hours",
    price: 119,
    description: "Analyze billions of event rows per second: MergeTree engine family, vector execution, Kafka engine ingestion, and projections.",
    modules: ["Columnar Storage Mechanics", "MergeTree Partitioning & Sorting", "ClickHouse Kafka Engine", "Materialized Views & Aggregates"],
  },
  {
    title: "Graph Databases & Analytics with Neo4j & Cypher Query Language",
    category: "Data Engineering",
    difficulty: "Intermediate" as const,
    duration: "18 hours",
    price: 89,
    description: "Model interconnected data, graph traversal algorithms, fraud detection networks, and recommendation engines.",
    modules: ["Property Graph Model", "Cypher Query Syntax", "Shortest Path & PageRank", "Fraud Detection Topologies"],
  },
  {
    title: "Elasticsearch & OpenSearch: Distributed Search & Inverted Indexes",
    category: "Data Engineering",
    difficulty: "Intermediate" as const,
    duration: "22 hours",
    price: 99,
    description: "Inverted index internals, shard allocation, BM25 text relevance, fuzzy matching, and aggregations.",
    modules: ["Lucene Inverted Index Internals", "Cluster Topologies & Sharding", "Fuzzy Search & Synonyms", "Aggregations & Log Analytics"],
  },
  {
    title: "Change Data Capture (CDC) with Debezium & Apache Kafka",
    category: "Data Engineering",
    difficulty: "Advanced" as const,
    duration: "19 hours",
    price: 129,
    description: "Stream database transaction logs (PostgreSQL WAL, MySQL binlog) directly into Kafka with zero application code changes.",
    modules: ["Log-Based CDC Principles", "Debezium Connector Setup", "Schema Evolution in CDC Streams", "Outbox Pattern Integration"],
  },

  // 51-60: Cybersecurity & Ethical Hacking
  {
    title: "Offensive Security & Web Application Penetration Testing (OSCP)",
    category: "Cybersecurity",
    difficulty: "Advanced" as const,
    duration: "32 hours",
    price: 159,
    description: "SQL injection, SSRF, IDOR, prototype pollution, cross-site scripting (XSS), and privilege escalation techniques.",
    modules: ["Reconnaissance & Port Scanning", "Server-Side Flaws (SSRF/SQLi)", "Client-Side Attacks (XSS/CSRF)", "Burp Suite Pro Automation"],
  },
  {
    title: "Cloud Security: AWS IAM Hardening & Threat Detection with GuardDuty",
    category: "Cybersecurity",
    difficulty: "Intermediate" as const,
    duration: "20 hours",
    price: 109,
    description: "Detect compromised access keys, analyze CloudTrail logs, configure SCP policies, and automate incident responses.",
    modules: ["IAM Least Privilege & SCPs", "CloudTrail & VPC Flow Logs", "GuardDuty Anomaly Detection", "Automated Remediation with Lambda"],
  },
  {
    title: "Cryptography for Software Engineers: TLS, RSA, ECC & Quantum Safe",
    category: "Cybersecurity",
    difficulty: "Advanced" as const,
    duration: "22 hours",
    price: 129,
    description: "Symmetric vs asymmetric ciphers, Diffie-Hellman key exchange, digital signatures, hash collisions, and post-quantum crypto.",
    modules: ["AES-GCM & ChaCha20-Poly1305", "Elliptic Curve Cryptography", "TLS 1.3 Handshake Protocol", "Post-Quantum Algorithms (ML-KEM)"],
  },
  {
    title: "DevSecOps: SAST, DAST & Container Image Vulnerability Scanning",
    category: "Cybersecurity",
    difficulty: "Intermediate" as const,
    duration: "18 hours",
    price: 89,
    description: "Integrate Trivy, Snyk, SonarQube, and Semgrep into CI/CD pipelines to block vulnerable dependencies before production.",
    modules: ["Shift-Left Security Concepts", "Static Code Analysis with Semgrep", "Container Scanning with Trivy", "Software Bill of Materials (SBOM)"],
  },
  {
    title: "API Security: OAuth 2.1, JWT Security & Rate Limiting Defense",
    category: "Cybersecurity",
    difficulty: "Intermediate" as const,
    duration: "16 hours",
    price: 85,
    description: "Prevent JWT signature stripping, token replay attacks, OAuth redirect manipulation, and credential stuffing.",
    modules: ["OAuth 2.1 Authorization Flows", "JWT Signing (RS256 vs HS256)", "Credential Stuffing Protections", "OWASP API Security Top 10"],
  },
  {
    title: "Kubernetes Security: Pod Security Standards, Falco & Network Policies",
    category: "Cybersecurity",
    difficulty: "Advanced" as const,
    duration: "24 hours",
    price: 139,
    description: "Enforce baseline & restricted pod security standards, real-time syscall alerting with Falco, and micro-segmentation.",
    modules: ["Pod Security Admission (PSA)", "Runtime Detection with Falco", "Calico Network Policies", "Hardening Kubelet & ETCD"],
  },
  {
    title: "Incident Response & Digital Forensics for Cloud Environments",
    category: "Cybersecurity",
    difficulty: "Advanced" as const,
    duration: "26 hours",
    price: 145,
    description: "Analyze disk images, trace memory artifacts, recreate attack kill chains, and coordinate emergency incident response.",
    modules: ["Incident Response Lifecycle", "Memory Forensics with Volatility", "Log Corroboration & Timeline Reconstruction", "Containment Strategies"],
  },
  {
    title: "Reverse Engineering & Malware Analysis Fundamentals",
    category: "Cybersecurity",
    difficulty: "Advanced" as const,
    duration: "28 hours",
    price: 149,
    description: "Disassemble compiled x86/ARM binaries using Ghidra, debug with x64dbg, identify packed binaries, and understand shellcode.",
    modules: ["x86-64 Assembly Review", "Static Analysis with Ghidra", "Dynamic Analysis in Sandboxes", "Recognizing C2 Communications"],
  },
  {
    title: "Threat Modeling: STRIDE, Attack Trees & Secure System Design",
    category: "Cybersecurity",
    difficulty: "Beginner" as const,
    duration: "14 hours",
    price: 69,
    description: "Identify vulnerabilities before writing code: STRIDE threat modeling, Data Flow Diagrams (DFDs), and mitigation matrices.",
    modules: ["STRIDE Methodology", "Data Flow Diagrams (DFDs)", "Mitigation Validation", "Automated Threat Modeling Tools"],
  },
  {
    title: "SOC 2 Type II & ISO 27001 Compliance for Engineering Teams",
    category: "Cybersecurity",
    difficulty: "Beginner" as const,
    duration: "12 hours",
    price: 59,
    description: "Prepare cloud architectures for audits: access controls, continuous compliance monitoring with Vanta, and policy runbooks.",
    modules: ["SOC 2 Trust Services Criteria", "Access Review Automations", "Vendor Risk Assessments", "Passing Your First Audit"],
  },

  // 61-70: Mobile & Cross-Platform Engineering
  {
    title: "React Native & Expo: Cross-Platform iOS & Android Engineering",
    category: "Mobile",
    difficulty: "Intermediate" as const,
    duration: "24 hours",
    price: 99,
    description: "Build native mobile apps with Expo Router, Reanimated 3 fluid animations, native device modules, and EAS builds.",
    modules: ["Expo Router File Routing", "Reanimated 3 & Gesture Handler", "Native Device APIs", "EAS Build & App Store Submissions"],
  },
  {
    title: "Flutter 3 & Dart: High-Performance Pixel-Perfect Mobile Apps",
    category: "Mobile",
    difficulty: "Intermediate" as const,
    duration: "26 hours",
    price: 89,
    description: "Widget trees, state management with Riverpod, custom canvas painting, and offline-first SQLite databases.",
    modules: ["Flutter Rendering Pipeline", "State Management with Riverpod", "Custom Painter & Animations", "Offline-First Sync Engines"],
  },
  {
    title: "Modern iOS Development with SwiftUI 6 & Combine",
    category: "Mobile",
    difficulty: "Intermediate" as const,
    duration: "28 hours",
    price: 119,
    description: "Declarative UI with SwiftUI, Swift Concurrency (async/await & actors), SwiftData persistence, and TestFlight deploys.",
    modules: ["Swift 6 Concurrency & Actors", "SwiftUI View Hierarchy", "SwiftData Local Storage", "Widgets & Dynamic Island"],
  },
  {
    title: "Modern Android Development with Jetpack Compose & Kotlin",
    category: "Mobile",
    difficulty: "Intermediate" as const,
    duration: "28 hours",
    price: 119,
    description: "Declarative Android UI with Compose, Kotlin Coroutines & Flow, Room database, and Hilt dependency injection.",
    modules: ["Jetpack Compose Layouts", "Kotlin Coroutines & Flow", "Clean Architecture with ViewModel", "Room Database & Migrations"],
  },
  {
    title: "Mobile App Security: Biometrics, Keychain & Code Obfuscation",
    category: "Mobile",
    difficulty: "Advanced" as const,
    duration: "16 hours",
    price: 89,
    description: "Secure storage with iOS Keychain and Android Keystore, certificate pinning, anti-tampering, and jailbreak detection.",
    modules: ["Hardware-Backed Keystores", "SSL/TLS Certificate Pinning", "Biometric Authentication Flows", "Reverse Engineering Protections"],
  },
  {
    title: "Offline-First Mobile Architecture with WatermelonDB & RxDB",
    category: "Mobile",
    difficulty: "Advanced" as const,
    duration: "18 hours",
    price: 95,
    description: "Handle flaky mobile networks: local SQLite sync, optimistic mutations, conflict resolution, and background sync workers.",
    modules: ["Local Database Caching", "Sync Protocols & Change Sets", "Optimistic State Trees", "Background Sync Tasks"],
  },
  {
    title: "High-Performance Mobile Games with Unity & C#",
    category: "Mobile",
    difficulty: "Beginner" as const,
    duration: "30 hours",
    price: 99,
    description: "Physics engines, particle systems, 2D/3D sprite rendering, mobile performance profiling, and in-app monetization.",
    modules: ["Unity Scene Graph & Components", "C# Scripting & Physics", "Mobile GPU Optimization", "In-App Purchases & Analytics"],
  },
  {
    title: "WebAssembly (Wasm) for Native Mobile & Browser Hybrid Apps",
    category: "Mobile",
    difficulty: "Advanced" as const,
    duration: "20 hours",
    price: 109,
    description: "Compile C++ and Rust code into WebAssembly to execute heavy computation inside mobile WebView containers.",
    modules: ["WebAssembly Binary Format", "Emscripten & Rust Wasm Toolchains", "Shared Memory & Threads", "Native Bridge Integration"],
  },
  {
    title: "Progressive Web Apps (PWA): Service Workers & Web Push",
    category: "Mobile",
    difficulty: "Beginner" as const,
    duration: "14 hours",
    price: 65,
    description: "Installable web apps on iOS and Android: Service Worker caching strategies, Web Push notifications, and Background Sync.",
    modules: ["Web App Manifest Config", "Service Worker Lifecycle", "Cache Storage API Strategies", "Web Push Notifications"],
  },
  {
    title: "Automated Mobile Testing: Maestro & Appium End-to-End Suites",
    category: "Mobile",
    difficulty: "Beginner" as const,
    duration: "15 hours",
    price: 75,
    description: "Write reliable UI tests for iOS and Android apps using Maestro declarative YAML flows and integrate into GitHub Actions.",
    modules: ["Maestro Test Suite Setup", "Flakiness-Free Selectors", "Simulating Network Conditions", "CI Emulators in Cloud Pipelines"],
  },

  // 71-80: System Design & Enterprise Architecture
  {
    title: "System Design Masterclass: Designing Systems for 100M+ Daily Users",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "32 hours",
    price: 159,
    description: "End-to-end design of YouTube, Uber, WhatsApp, Twitter, and Netflix: trade-offs, bottlenecks, and napkin math.",
    modules: ["Capacity Planning & Back of the Envelope", "Designing Global Video Streaming", "Geospatial Indexing for Ride Sharing", "Real-Time Chat & Presences"],
  },
  {
    title: "Designing Distributed Key-Value Stores: Dynamo & Cassandra Deep Dive",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "24 hours",
    price: 139,
    description: "Consistent hashing, virtual nodes, sloppy quorums, hinted handoff, read repair, and gossip protocols.",
    modules: ["Consistent Hashing Topology", "Tunable Consistency (R + W > N)", "Gossip Protocol Mechanics", "Anti-Entropy with Merkle Trees"],
  },
  {
    title: "Software Architecture Patterns: Hexagonal, Clean & Onion Architecture",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "18 hours",
    price: 89,
    description: "Decouple core business logic from database and transport frameworks using ports, adapters, and dependency inversion.",
    modules: ["Clean Architecture Principles", "Ports & Adapters (Hexagonal)", "Dependency Inversion in TypeScript", "Testing Domain Logic in Isolation"],
  },
  {
    title: "Designing Real-Time Notification Engines at Massive Scale",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "17 hours",
    price: 85,
    description: "Process billions of push notifications, emails, and SMS alerts: deduplication, user rate limits, and priority queues.",
    modules: ["Multi-Channel Dispatch Engines", "Deduplication with Redis", "User Preferences & Quiet Hours", "Fallback Provider Topologies"],
  },
  {
    title: "Designing Distributed Job Schedulers & Cron Systems",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "20 hours",
    price: 109,
    description: "High-accuracy distributed cron: delayed queues with Redis ZSETs, leader elections, and at-least-once execution guarantees.",
    modules: ["Delayed Queue Mechanics", "Distributed Locking with Redlock", "Worker Heartbeats & Failover", "Preventing Thundering Herds"],
  },
  {
    title: "Designing Global Payments & Financial Ledger Systems",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "28 hours",
    price: 169,
    description: "Double-entry bookkeeping, immutable financial ledgers, idempotency keys, currency conversions, and reconciliation.",
    modules: ["Double-Entry Accounting Math", "Strict Idempotency Patterns", "Two-Phase Commits in Banking", "Automated Daily Reconciliation"],
  },
  {
    title: "Designing Global Collaborative Whiteboards (Figma / Miro Architecture)",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "22 hours",
    price: 135,
    description: "Canvas rendering optimizations, operational transformation, WebGL shaders, spatial partitioning, and cursor streaming.",
    modules: ["Spatial Grid Partitioning", "Cursor Position Streaming", "WebGL Render Optimization", "Undo/Redo State Stacks"],
  },
  {
    title: "Designing Search Autocomplete & Typeahead Systems",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "16 hours",
    price: 79,
    description: "Trie data structures, prefix indexing, frequency counters, client-side caching, and sub-10ms query responses.",
    modules: ["Trie Construction in Memory", "Frequency Aggregations", "Edge Caching at CDNs", "Spelling Corrections & Fuzzy Matching"],
  },
  {
    title: "Designing Scalable Web Crawlers & Content Ingestion Pipelines",
    category: "Architecture",
    difficulty: "Intermediate" as const,
    duration: "20 hours",
    price: 89,
    description: "URL frontier design, politeness policies, distributed deduplication with Bloom filters, and HTML parsing at scale.",
    modules: ["URL Frontier & Priority Queues", "Bloom Filters for Visited URLs", "Distributed Rate Limiting by Host", "Content Hash Deduplication"],
  },
  {
    title: "Designing URL Shorteners & Distributed Unique ID Generators",
    category: "Architecture",
    difficulty: "Beginner" as const,
    duration: "12 hours",
    price: 59,
    description: "Twitter Snowflake 64-bit ID generation, Base62 encoding, database partitioning, and 301 vs 302 redirect strategies.",
    modules: ["Twitter Snowflake Architecture", "Base62 Encoding Algorithms", "Relational vs NoSQL Storage", "Analytics & Click Tracking"],
  },

  // 81-90: UI/UX, Design Systems & Frontend Engineering
  {
    title: "Design Systems from Scratch: Tokens, Components & Accessibility",
    category: "Design",
    difficulty: "Intermediate" as const,
    duration: "20 hours",
    price: 89,
    description: "Architect Figma tokens, sync with Style Dictionary to CSS/React, enforce WCAG 2.2 AA accessibility standards.",
    modules: ["Design Token Taxonomies", "Figma to Code Pipeline", "WCAG 2.2 AA Contrast & Focus", "Storybook Component Documentation"],
  },
  {
    title: "Figma Masterclass: Auto-Layout, Variables & High-Fidelity Prototyping",
    category: "Design",
    difficulty: "Beginner" as const,
    duration: "18 hours",
    price: 79,
    description: "Master advanced auto-layout constraints, component variant properties, interactive component variables, and user testing.",
    modules: ["Auto-Layout 5 Mechanics", "Figma Variables & Modes", "Interactive Component States", "Creating Production Prototypes"],
  },
  {
    title: "Micro-Interactions & Fluid Motion Design with Framer Motion",
    category: "Design",
    difficulty: "Intermediate" as const,
    duration: "16 hours",
    price: 79,
    description: "Craft stunning UI animations: layout animations, spring physics, scroll progress triggers, and gesture drag interactions.",
    modules: ["Spring Physics vs Ease Curves", "Shared Layout Animations", "Scroll-Linked Effects", "Accessible Reduced Motion Queries"],
  },
  {
    title: "Web Accessibility (A11y) Certification: ARIA, Focus & Screen Readers",
    category: "Design",
    difficulty: "Intermediate" as const,
    duration: "15 hours",
    price: 69,
    description: "Build interfaces accessible to everyone: proper ARIA semantics, focus traps, keyboard navigation, and VoiceOver testing.",
    modules: ["Semantic HTML Foundation", "WAI-ARIA Roles & Attributes", "Keyboard Focus Management", "Testing with NVDA & VoiceOver"],
  },
  {
    title: "Three.js & React Three Fiber: Interactive 3D Web Experiences",
    category: "Design",
    difficulty: "Advanced" as const,
    duration: "26 hours",
    price: 129,
    description: "Create immersive 3D scenes in the browser: GLTF models, custom GLSL shaders, camera physics, and post-processing passes.",
    modules: ["3D Coordinates & Camera Types", "Lighting & GLTF Model Loading", "GLSL Shaders from Scratch", "React Three Fiber Component Trees"],
  },
  {
    title: "Data Visualization with D3.js: Interactive Charts & Geodata Maps",
    category: "Design",
    difficulty: "Advanced" as const,
    duration: "22 hours",
    price: 109,
    description: "Custom SVG charting, force-directed network graphs, geographic projections, and smooth animated data transitions.",
    modules: ["D3 Scales & Axes", "Data Join (Enter, Update, Exit)", "Force Simulation Graphs", "GeoJSON Maps & Zoom Behaviors"],
  },
  {
    title: "Creative Coding with Canvas & WebGL Shaders",
    category: "Design",
    difficulty: "Advanced" as const,
    duration: "20 hours",
    price: 99,
    description: "Particle systems, mathematical generative art, raymarching, and fragment shaders using raw WebGL2 contexts.",
    modules: ["2D Canvas Performance Tricks", "Fragment Shaders & UV Mapping", "Particle Swarms & Physics", "Audio-Reactive Visualizers"],
  },
  {
    title: "User Research & Product Usability Testing for Engineers",
    category: "Design",
    difficulty: "Beginner" as const,
    duration: "12 hours",
    price: 55,
    description: "Conduct actionable user interviews, usability testing sessions, heatmaps with PostHog, and synthesize UX insights.",
    modules: ["Formulating User Hypotheses", "Moderated Usability Sessions", "Analytics Heatmaps & Session Replays", "Feature Prioritization Frameworks"],
  },
  {
    title: "Typography, Grid Systems & Visual Hierarchy in Modern UI",
    category: "Design",
    difficulty: "Beginner" as const,
    duration: "14 hours",
    price: 59,
    description: "Font pairings, typographic scales, baseline grids, whitespace balance, and creating stunning editorial layouts.",
    modules: ["Type Scales & Modular Mathematics", "Baseline Grid Alignment", "Color Harmony & Contrast Rules", "Visual Rhythm & Space Balance"],
  },
  {
    title: "Responsive Web Design Masterclass: Container Queries & Subgrid",
    category: "Design",
    difficulty: "Beginner" as const,
    duration: "15 hours",
    price: 65,
    description: "Move beyond media queries: container queries (@container), CSS Grid subgrid, min/max/clamp calculations, and mobile parity.",
    modules: ["Container Query Selectors", "CSS Grid Subgrid Alignments", "Clamp() Responsive Scaling", "Touch Target Guidelines"],
  },

  // 91-100: Software Engineering Management & Emerging Technologies
  {
    title: "Staff Engineer Mindset: Technical Strategy, Influence & RFCs",
    category: "Architecture",
    difficulty: "Advanced" as const,
    duration: "18 hours",
    price: 99,
    description: "Transition from senior to staff engineer: write impactful technical proposals (RFCs), build consensus, and lead multi-team projects.",
    modules: ["Writing Compelling RFCs", "Navigating Architectural Disagreements", "Technical Debt Prioritization", "Measuring Engineering Health"],
  },
  {
    title: "Rust for Systems Programming: Memory Safety Without Garbage Collection",
    category: "Development",
    difficulty: "Advanced" as const,
    duration: "30 hours",
    price: 139,
    description: "Low-level memory management, pointers, unsafe Rust, foreign function interface (FFI), and writing operating system utilities.",
    modules: ["Raw Pointers & Unsafe Blocks", "Foreign Function Interface (FFI)", "Custom Memory Allocators", "Writing Command-Line Tools"],
  },
  {
    title: "Solidity & Smart Contract Security: Gas Optimization & Audits",
    category: "Development",
    difficulty: "Advanced" as const,
    duration: "24 hours",
    price: 129,
    description: "EVM bytecodes, reentrancy vulnerabilities, flash loan defenses, Foundry testing, and gas assembly optimization.",
    modules: ["EVM Execution Model & Storage", "Reentrancy & Flash Loans", "Foundry Fuzz Testing", "Yul / Assembly Gas Optimization"],
  },
  {
    title: "Quantum Computing Basics for Software Engineers with Qiskit",
    category: "AI & ML",
    difficulty: "Intermediate" as const,
    duration: "16 hours",
    price: 89,
    description: "Qubits, superposition, entanglement, quantum gates, and running quantum circuits on IBM Quantum hardware.",
    modules: ["Qubits & Bloch Sphere Math", "Hadamard & CNOT Quantum Gates", "Quantum Teleportation Circuit", "Grover's Search Algorithm"],
  },
  {
    title: "Writing Compilers & Interpreters in Go from Scratch",
    category: "Development",
    difficulty: "Advanced" as const,
    duration: "26 hours",
    price: 135,
    description: "Lexical analysis, Pratt parsing, Abstract Syntax Trees (AST), bytecode virtual machines, and garbage collectors.",
    modules: ["Lexer Token Streaming", "Pratt Parsing & AST Trees", "Evaluation State Machines", "Bytecode VM & Compilers"],
  },
  {
    title: "Real-Time Embedded Systems & IoT with C and FreeRTOS",
    category: "Development",
    difficulty: "Intermediate" as const,
    duration: "24 hours",
    price: 109,
    description: "Microcontrollers, GPIO interrupts, FreeRTOS task scheduling, I2C/SPI sensor communications, and power management.",
    modules: ["Microcontroller Architecture", "FreeRTOS Task Queues", "I2C & SPI Serial Protocols", "Low-Power Sleep Modes"],
  },
  {
    title: "Game Engine Architecture from Scratch in Modern C++",
    category: "Development",
    difficulty: "Advanced" as const,
    duration: "34 hours",
    price: 169,
    description: "Entity Component Systems (ECS), OpenGL/Vulkan rendering pipeline, spatial octrees, and audio mixing subsystems.",
    modules: ["Entity Component System (ECS)", "Vulkan Graphics Pipeline", "Physics Collision Octrees", "Asset Loading & Serialization"],
  },
  {
    title: "Post-Quantum Cryptography & Hardware Security Modules (HSM)",
    category: "Cybersecurity",
    difficulty: "Advanced" as const,
    duration: "18 hours",
    price: 129,
    description: "Lattice-based cryptography, NIST standards (Kyber/Dilithium), PKCS#11 interfaces, and key management inside HSMs.",
    modules: ["Lattice-Based Cryptography Math", "ML-KEM Key Encapsulation", "PKCS#11 API Programming", "Enterprise Key Lifecycle"],
  },
  {
    title: "Engineering Management: Team Topologies, 1-on-1s & Career Ladders",
    category: "Architecture",
    difficulty: "Beginner" as const,
    duration: "14 hours",
    price: 69,
    description: "Build high-performing engineering teams: team topologies, effective one-on-ones, sprint cadence, and hiring rubrics.",
    modules: ["Stream-Aligned Teams vs Platform", "Coaching & Effective 1-on-1s", "Structured Interview Rubrics", "Career Ladders & Promotions"],
  },
  {
    title: "Site Reliability Engineering (SRE): Incident Postmortems & Error Budgets",
    category: "DevOps",
    difficulty: "Intermediate" as const,
    duration: "16 hours",
    price: 85,
    description: "Establish SLIs, SLOs, and SLAs, calculate error budget burn rates, write blameless postmortems, and run on-call rotations.",
    modules: ["Defining SLIs & SLO Targets", "Error Budget Burn Rate Alerts", "Blameless Postmortem Culture", "Designing Sustainable On-Call Rotations"],
  },
];

export async function seedDatabase() {
  // Clear existing collections for a clean, deterministic seed
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  await Submission.deleteMany({});

  // 1. SEED INSTRUCTORS & USERS
  let elena = await User.findOne({ email: "elena@auspify.com" });
  if (!elena) {
    elena = await User.create({
      name: "Dr. Elena Rostova",
      email: "elena@auspify.com",
      password: "password123",
      role: "instructor",
      bio: "Principal Systems Architect, Ex-Confluent. Specializing in distributed consensus, low-latency stream engines, and mission-critical event storage.",
      phone: "+1 (555) 782-9012",
      skills: ["Apache Kafka", "Distributed Systems", "Rust", "Go", "Raft Consensus"],
    });
  }

  let sarah = await User.findOne({ email: "instructor@auspify.com" });
  if (!sarah) {
    sarah = await User.create({
      name: "Dr. Sarah Jenkins",
      email: "instructor@auspify.com",
      password: "password123",
      role: "instructor",
      bio: "Senior Full-Stack Architect with 12+ years building enterprise Node.js, Next.js & React cloud systems.",
      phone: "+1 (555) 234-5678",
      skills: ["Node.js", "React", "Next.js", "MongoDB", "System Architecture", "TypeScript"],
    });
  }

  let student = await User.findOne({ email: "student@auspify.com" });
  if (!student) {
    student = await User.create({
      name: "Alex Johnson",
      email: "student@auspify.com",
      password: "password123",
      role: "student",
      bio: "Software Engineering Fellow specializing in high-throughput distributed systems, real-time data pipelines, and full-stack web applications.",
      phone: "+1 (555) 876-5432",
      skills: ["TypeScript", "React", "Kafka", "Node.js", "Docker", "MongoDB"],
    });
  }

  let admin = await User.findOne({ email: "admin@auspify.com" });
  if (!admin) {
    admin = await User.create({
      name: "Platform Administrator",
      email: "admin@auspify.com",
      password: "password123",
      role: "admin",
      bio: "System administrator managing LMS infrastructure, user delegations, telemetry, and course quality.",
      phone: "+1 (555) 999-0000",
      skills: ["Administration", "Security", "DevOps", "Telemetry", "Compliance"],
    });
  }

  // 2. SEED THE CORE DETAILED FEATURED COURSES (Courses 1-5)
  const coreCourses = [
    {
      title: "CS-702: Advanced Distributed Systems & Event Streaming",
      slug: "cs-702-advanced-distributed-systems",
      description:
        "Architect high-throughput event streaming pipelines with Apache Kafka, Raft consensus quorums, consumer group rebalancing, and zero-data-loss ISR replication.",
      category: "Architecture",
      difficulty: "Advanced" as const,
      price: 149,
      duration: "28 hours",
      status: "Published" as const,
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
      instructor: elena._id,
      instructorName: elena.name,
      learningObjectives: [
        "Master Kafka commit log internals, topic partitions, and zero-copy transfer",
        "Configure strict durability with acks=all and min.insync.replicas=2",
        "Analyze high-watermark progression and leader election failovers",
        "Provision enterprise Kafka and Raft clusters with Docker Compose",
      ],
      requirements: [
        "Proficiency in modern TypeScript, Java, or Rust",
        "Understanding of TCP sockets, networking, and concurrent programming",
      ],
      modules: [
        {
          title: "Module 1: Event-Driven Fundamentals",
          lessons: [
            {
              title: "1.1 Introduction to Distributed Event Streams",
              duration: "14 min",
              content:
                "Event-driven architectures decouple producers from consumers through an immutable append-only log. Learn the mathematical foundations of continuous stream processing.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              resources: [
                "Whitepaper: The Log - What every software engineer should know",
                "Specification: Distributed Commit Log Mechanics",
              ],
            },
            {
              title: "1.2 Pub/Sub vs Message Queue Topologies",
              duration: "20 min",
              content:
                "Explore the architectural trade-offs between point-to-point queues (RabbitMQ/SQS) and distributed replayable stream logs (Kafka/Redpanda).",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              resources: ["Architecture Blueprint: Message Queues vs Event Streams"],
            },
            {
              title: "1.3 Schema Registry & Avro Evolution",
              duration: "18 min",
              content:
                "Enforce strict schema governance across producer and consumer boundaries using Confluent Schema Registry with backward and forward compatibility rules.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              resources: ["Schema Evolution Guide: Avro & Protobuf Compatibility Rules"],
            },
          ],
        },
        {
          title: "Module 2: Consensus & Raft Protocols",
          lessons: [
            {
              title: "2.1 Raft Leader Election & Term Heartbeats",
              duration: "22 min",
              content:
                "Deconstruct Raft state machines: Candidate states, randomized election timeouts, split vote resolutions, and term heartbeat propagation.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
              resources: ["Original Raft Paper: In Search of an Understandable Consensus Algorithm"],
            },
            {
              title: "2.2 Log Replication & Quorum Slices",
              duration: "25 min",
              content:
                "How the leader commits entries across follower replicas and enforces the state machine safety property across network partitions.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
              resources: ["Quorum Verification Interactive Simulator"],
            },
          ],
        },
        {
          title: "Module 3: Message Ordering & Delivery Guarantees",
          lessons: [
            {
              title: "3.1 Idempotent Producers & Sequence Numbers",
              duration: "24 min",
              content:
                "Eliminate duplicate message anomalies caused by TCP retransmissions using producer epoch IDs and monotonically increasing sequence numbers.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
              resources: ["RFC: Exactly-Once Processing Semantics in Distributed Logs"],
            },
          ],
        },
        {
          title: "Module 4: High-Throughput Partitioning & Replication",
          lessons: [
            {
              title: "Lesson 4.1: Topic Partitions, Log Segments & Indexes",
              duration: "18 min",
              content:
                "Dissect how partitions are stored as binary log segments (.log, .index, .timeindex) on NVMe storage with zero-copy OS sendfile syscalls.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
              resources: ["Storage Architecture: Page Cache & Zero-Copy Syscalls"],
            },
            {
              title: "Lesson 4.2: Broker Controllers & KRaft Metadata Quorum",
              duration: "21 min",
              content:
                "Transitioning from ZooKeeper to Kafka Raft (KRaft). How metadata partitions are replicated with sub-second controller failovers.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
              resources: ["KIP-500: Replace ZooKeeper with KRaft Metadata Mode"],
            },
            {
              title: "Lesson 4.3: Kafka Partitions, Consumer Groups & High-Throughput Replication",
              duration: "18 min",
              content:
                "In this lesson, we explore how distributed topics scale horizontally across broker nodes using deterministic hash key partitioning. We analyze leader replica assignment, in-sync replica (ISR) pools, and how high-watermark progression guarantees zero data loss during broker crashes.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              resources: [
                "Kafka Broker Topology Cheatsheet (PDF)",
                "Official Confluent Producer Benchmarking Guide",
                "Interactive Partition Quorum Visualizer",
                "Auspify Distributed Systems Architecture Reference",
              ],
            },
            {
              title: "Lesson 4.4: In-Sync Replica (ISR) Pools & Watermark Progression",
              duration: "16 min",
              content:
                "Detailed mathematical breakdown of replica lag metrics (replica.lag.time.max.ms), leader epoch checkpointing, and uncommitted log truncation.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              resources: ["Reference: Replica Lag Detection Algorithms"],
            },
          ],
        },
        {
          title: "Module 5: Resiliency, Failover & Production Chaos",
          lessons: [
            {
              title: "5.1 Controlled Leader Failover & Clean Shutdowns",
              duration: "20 min",
              content:
                "Graceful broker drain procedures, controlled leader migration, and minimizing producer p99 latency spikes during rolling restarts.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              resources: ["SRE Runbook: Safe Rolling Cluster Restarts"],
            },
          ],
        },
      ],
      quizzes: [
        {
          title: "Quiz 4: Fault Tolerance in Kafka",
          description: "Assess your mastery of partition failovers, in-sync replica (ISR) pools, and high-watermark guarantees.",
          timeLimitMinutes: 15,
          passingScore: 70,
          questions: [
            {
              questionText:
                "What occurs if min.insync.replicas is set to 2 and only 1 replica is in the ISR pool when a producer sends with acks=all?",
              options: [
                "The produce request is rejected with NotEnoughReplicasException",
                "The message is silently dropped",
                "The message is saved to local disk on the producer",
                "The consumer group auto-resets offsets",
              ],
              correctAnswerIndex: 0,
              points: 25,
            },
            {
              questionText:
                "Which component acts as the consensus metadata coordinator in modern KRaft-based Kafka clusters?",
              options: [
                "Apache ZooKeeper ensemble",
                "KRaft Quorum Controller with Raft metadata log",
                "Client-side producer pool",
                "OS Kernel page cache",
              ],
              correctAnswerIndex: 1,
              points: 25,
            },
            {
              questionText: "What does the High Watermark (HW) in a partition replica log represent?",
              options: [
                "The highest offset that has been replicated to all active ISR members",
                "The maximum number of consumer group threads",
                "The total size of the log segment on disk in MB",
                "The oldest unexpired retention offset",
              ],
              correctAnswerIndex: 0,
              points: 25,
            },
            {
              questionText: "How do idempotent producers in Kafka prevent duplicate messages on broker retries?",
              options: [
                "By calculating MD5 hashes of message payloads",
                "By assigning each producer a PID and monotonic sequence numbers per partition",
                "By locking the entire topic during send",
                "By dropping unacknowledged socket connections",
              ],
              correctAnswerIndex: 1,
              points: 25,
            },
          ],
        },
      ],
      assignments: [
        {
          title: "Lab 4.1: Hands-on Multi-Broker KRaft Cluster Deployment",
          instructions:
            "Deploy a 3-broker KRaft cluster using Docker Compose. Configure a topic with replication factor 3 and min.insync.replicas 2. Execute a kill -9 on the leader broker during an active producer benchmark and submit your repository URL with proof of zero message loss.",
          totalMarks: 100,
        },
      ],
    },
    {
      title: "Full-Stack Web Engineering with React, Node.js & TypeScript",
      slug: "full-stack-web-engineering-react-node",
      description:
        "Master modern enterprise full-stack engineering with Next.js, Express, TypeScript, and MongoDB from architecture to production containerization.",
      category: "Development",
      difficulty: "Beginner" as const,
      price: 89,
      duration: "24 hours",
      status: "Published" as const,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      instructor: sarah._id,
      instructorName: sarah.name,
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
            {
              title: "1.2 React 19 State Architecture & Hooks",
              duration: "25 min",
              content: "Deep dive into components, state management, props, and modern React hooks.",
              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            },
          ],
        },
      ],
      quizzes: [
        {
          title: "Full-Stack Web Foundations Quiz",
          description: "Assess your understanding of React and Express fundamentals.",
          timeLimitMinutes: 10,
          passingScore: 70,
          questions: [
            {
              questionText: "What HTTP method is typically used to create a new resource in a RESTful API?",
              options: ["GET", "POST", "PUT", "DELETE"],
              correctAnswerIndex: 1,
              points: 50,
            },
          ],
        },
      ],
      assignments: [
        {
          title: "Capstone Milestone: Full-Stack LMS Microservice API",
          instructions:
            "Create an Express API that implements CRUD endpoints for courses and validates request payloads using Mongoose.",
          totalMarks: 100,
        },
      ],
    },
  ];

  // 3. GENERATE 100 ADDITIONAL REALISTIC COURSES
  const additionalCourses = COURSE_CATALOG_BLUEPRINTS.map((blueprint, idx) => {
    const slug = blueprint.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const instructorUser = idx % 2 === 0 ? elena : sarah;

    // Curated high quality tech thumbnails
    const thumbnails = [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    ];
    const thumbnail = thumbnails[idx % thumbnails.length];

    // Build modules and lessons
    const modules = blueprint.modules.map((modName, mIdx) => ({
      title: `Module ${mIdx + 1}: ${modName}`,
      lessons: [
        {
          title: `${mIdx + 1}.1 Core Architecture & Principles`,
          duration: `${14 + (mIdx * 3) % 15} min`,
          content: `Comprehensive examination of ${modName}. Analyze performance trade-offs, configuration best practices, and enterprise production patterns.`,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          resources: [
            `${modName} Architectural Guide (PDF)`,
            "Production Checklist & SRE Runbook",
          ],
        },
        {
          title: `${mIdx + 1}.2 Hands-on Implementation & Lab Exercise`,
          duration: `${18 + (mIdx * 4) % 15} min`,
          content: `Step-by-step hands-on implementation of ${modName}. Write clean, idiomatic code with full test suites and benchmarking validations.`,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          resources: [
            "Source Code Repository & Docker Compose",
            "Benchmarking Harness & Validation Script",
          ],
        },
      ],
    }));

    return {
      title: blueprint.title,
      slug: `${slug}-${idx + 1}`,
      description: blueprint.description,
      category: blueprint.category,
      difficulty: blueprint.difficulty,
      price: blueprint.price,
      duration: blueprint.duration,
      status: "Published" as const,
      thumbnail,
      instructor: instructorUser._id,
      instructorName: instructorUser.name,
      enrolledStudentsCount: Math.floor(Math.random() * 250) + 15,
      learningObjectives: [
        `Master fundamental principles and production mechanics of ${blueprint.title.slice(0, 35)}`,
        "Implement robust architecture following industry standards and resilience patterns",
        "Diagnose latency bottlenecks, scale gracefully, and pass automated CI checks",
      ],
      requirements: ["Familiarity with modern software development", "Terminal and Git installed"],
      modules,
      quizzes: [
        {
          title: `${blueprint.title.slice(0, 30)} Assessment Quiz`,
          description: `Test your understanding of the core concepts presented in ${blueprint.title}.`,
          timeLimitMinutes: 15,
          passingScore: 70,
          questions: [
            {
              questionText: `What is the primary architectural goal of implementing ${blueprint.modules[0]}?`,
              options: [
                "Achieving high availability and system decoupling",
                "Minimizing database disk usage to zero",
                "Eliminating all network connections",
                "Running without an operating system",
              ],
              correctAnswerIndex: 0,
              points: 50,
            },
            {
              questionText: "Which metric is most crucial when evaluating production health for this architecture?",
              options: [
                "p99 latency and error rate",
                "Number of comments in the code",
                "Size of the desktop wallpaper",
                "Color of the terminal prompt",
              ],
              correctAnswerIndex: 0,
              points: 50,
            },
          ],
        },
      ],
      assignments: [
        {
          title: `Hands-on Project Milestone: ${blueprint.modules[0]}`,
          instructions: `Implement the hands-on milestone for ${blueprint.title}. Submit your GitHub repository URL along with architecture documentation.`,
          totalMarks: 100,
        },
      ],
    };
  });

  // Combine core courses and 100 blueprints
  const allCoursesData = [...coreCourses, ...additionalCourses];
  const createdCourses = await Course.insertMany(allCoursesData);

  const cs702Course = createdCourses[0];
  const fullstackCourse = createdCourses[1];
  const sampleCourse3 = createdCourses[2];
  const sampleCourse4 = createdCourses[3];
  const sampleCourse5 = createdCourses[4];

  // 4. SEED DETAILED ENROLLMENTS FOR REAL DEMO USER
  const allCs702Lessons: string[] = [];
  cs702Course.modules.forEach((mod: any) => {
    mod.lessons.forEach((les: any) => {
      if (les._id) allCs702Lessons.push(les._id.toString());
    });
  });

  // 11 of 16 lessons completed in CS-702 (Math: 11 / 16 = 68%)
  const completedCs702Lessons = allCs702Lessons.slice(0, 11);

  await Enrollment.create([
    {
      student: student._id,
      course: cs702Course._id,
      completedLessons: completedCs702Lessons,
      progressPercentage: 68,
      status: "In Progress",
      enrolledAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastAccessedAt: new Date(),
    },
    {
      student: student._id,
      course: fullstackCourse._id,
      completedLessons: fullstackCourse.modules.flatMap((m: any) => m.lessons.map((l: any) => l._id?.toString() || "")),
      progressPercentage: 100,
      status: "Completed",
      enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastAccessedAt: new Date(),
    },
    {
      student: student._id,
      course: sampleCourse3._id,
      completedLessons: (sampleCourse3.modules[0] as any).lessons.map((l: any) => l._id?.toString() || ""),
      progressPercentage: 50,
      status: "In Progress",
      enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastAccessedAt: new Date(),
    },
    {
      student: student._id,
      course: sampleCourse4._id,
      completedLessons: [],
      progressPercentage: 0,
      status: "Not Started",
      enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastAccessedAt: new Date(),
    },
    {
      student: student._id,
      course: sampleCourse5._id,
      completedLessons: (sampleCourse5.modules[0] as any).lessons.map((l: any) => l._id?.toString() || ""),
      progressPercentage: 25,
      status: "In Progress",
      enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastAccessedAt: new Date(),
    },
  ]);

  // 5. SEED DETAILED SUBMISSIONS FOR INSTRUCTOR REVIEWS
  await Submission.create([
    {
      student: student._id,
      course: cs702Course._id,
      type: "quiz",
      targetTitle: "Quiz 4: Fault Tolerance in Kafka",
      quizIndex: 0,
      score: 92,
      totalPoints: 100,
      percentage: 92,
      passingStatus: "Passed",
      answers: [0, 1, 0, 1],
      feedback: "Exceptional mastery of broker partition failovers, ISR quorums, and watermark progression!",
      status: "Graded",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      student: student._id,
      course: cs702Course._id,
      type: "assignment",
      targetTitle: "Lab 4.1: Hands-on Multi-Broker KRaft Cluster Deployment",
      assignmentIndex: 0,
      score: 96,
      totalPoints: 100,
      percentage: 96,
      submissionText:
        "Provisioned a 3-broker KRaft cluster using Docker Compose with automated leader broker failure simulation. Verified zero message drops using Kafkajs producer with acks=all.",
      githubUrl: "https://github.com/alex-johnson/kafka-kraft-cluster-demo",
      liveUrl: "https://kafka-demo.auspify.net",
      feedback:
        "Superb cluster architecture and thorough disaster recovery documentation. Outstanding attention to ISR lag metrics!",
      status: "Reviewed",
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      student: student._id,
      course: fullstackCourse._id,
      type: "assignment",
      targetTitle: "Capstone Milestone: Full-Stack LMS Microservice API",
      assignmentIndex: 0,
      score: 90,
      totalPoints: 100,
      percentage: 90,
      submissionText:
        "Built robust Express API with TypeScript, Mongoose models, Better Auth integration, and JWT authentication fallback.",
      githubUrl: "https://github.com/alex-johnson/lms-express-api",
      liveUrl: "https://api-demo.auspify.net",
      feedback: "Clean route structure, solid error handling middleware, and comprehensive test coverage.",
      status: "Reviewed",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      student: student._id,
      course: sampleCourse3._id,
      type: "assignment",
      targetTitle: `Hands-on Project Milestone: ${sampleCourse3.title.slice(0, 35)}`,
      assignmentIndex: 0,
      totalPoints: 100,
      submissionText: "Implemented the core service architecture and integration tests as requested.",
      githubUrl: "https://github.com/alex-johnson/distributed-consensus-demo",
      status: "Submitted",
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      student: student._id,
      course: sampleCourse4._id,
      type: "assignment",
      targetTitle: `Hands-on Project Milestone: ${sampleCourse4.title.slice(0, 35)}`,
      assignmentIndex: 0,
      totalPoints: 100,
      submissionText: "Production ready implementation with docker-compose stack and metrics exporter.",
      githubUrl: "https://github.com/alex-johnson/cqrs-event-sourcing-kafka",
      status: "Submitted",
      submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ]);

  return {
    coursesCreated: createdCourses.length,
    enrollmentsCreated: 5,
    submissionsCreated: 5,
    featuredCourse: cs702Course,
  };
}

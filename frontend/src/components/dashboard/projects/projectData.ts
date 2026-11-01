import { ProjectDefinition } from './types';

export const ALL_PROJECTS: ProjectDefinition[] = [
  // ========================================================
  // PHASE 1 — FOUNDATION PROJECTS
  // ========================================================
  {
    id: 'proj-mod-1-sql',
    phaseNumber: 1,
    moduleNumber: 1,
    type: 'minor',
    title: 'Module 1 — SQL Minor Project',
    shortDescription: 'Analyze e-commerce customer transaction histories, calculate month-over-month cohort retention, and identify high-value customer churn patterns using advanced SQL.',
    technologies: ['SQL'],
    submissionDeadline: '15 Nov 2026, 11:59 PM',
    objective: 'Build an end-to-end analytical SQL query pipeline to diagnose customer churn and evaluate multi-channel retention performance across 120,000+ transactional records.',
    businessContext: 'NexMart, a pan-India e-commerce retail platform, witnessed a 22.4% contraction in repeat buyer transactions during Q3. The Chief Commercial Officer requires actionable SQL cohort analysis to determine whether churn is driven by fulfillment delays, category-specific drop-offs, or discounting fatigue.',
    problemStatement: 'The raw database contains five disconnected tables with unindexed timestamps and duplicate payment logs. You need to write optimized SQL queries utilizing CTEs, multi-table joins, and analytical window functions to calculate 30-day, 60-day, and 90-day retention matrices, identify churn inflection points, and rank the top revenue-loss cohorts.',
    expectedOutcome: 'A modular, formatted SQL script file containing production-ready queries with zero cross-join performance penalties, alongside an executive 2-page summary analyzing customer retention cohorts.',
    skillsRequired: [
      { name: 'Multi-Table INNER/LEFT JOINs', category: 'SQL Querying' },
      { name: 'Common Table Expressions (WITH CTEs)', category: 'Data Architecture' },
      { name: 'Analytical Window Functions (ROW_NUMBER, DENSE_RANK, LAG)', category: 'Advanced SQL' },
      { name: 'Cohort Retention Matrices & Churn Math', category: 'Business Analytics' },
      { name: 'Query Optimization & Indexing', category: 'Database Performance' }
    ],
    resources: [
      {
        id: 'res-sql-1',
        name: 'nexmart_ecommerce_transactions_2026.csv',
        type: 'csv',
        size: '14.8 MB',
        url: '#download-sample-csv',
        description: 'Sanitized transactional dataset containing 124,500 orders, payment channels, delivery statuses, and SKU categories.',
        isDownloadable: true
      },
      {
        id: 'res-sql-2',
        name: 'database_schema_diagram_3nf.pdf',
        type: 'pdf',
        size: '1.2 MB',
        url: '#download-schema',
        description: 'Complete 3NF relational schema diagram with primary and foreign key mapping between tables.',
        isDownloadable: true
      },
      {
        id: 'res-sql-3',
        name: 'starter_cohort_query_template.sql',
        type: 'sql',
        size: '8 KB',
        url: '#download-sql-starter',
        description: 'SQL template with pre-built table creation scripts and verification test queries.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'Ingest and clean the 5 raw tables (orders, order_items, customers, payments, products).',
      'Compute Month-over-Month (MoM) Customer Acquisition Cost (CAC) recovery and Gross Merchandise Value (GMV).',
      'Construct a 12-month cohort retention grid using CTEs and the LAG() window function.',
      'Identify the top 3 product categories exhibiting the highest 30-day churn rate.',
      'Calculate customer lifetime value (LTV) deciles and formulate 3 strategic recommendations for the CRM marketing team.'
    ],
    deliverables: [
      'Fully documented SQL script (.sql) with clean indentation, comments, and CTE logic.',
      'Exported cohort retention query result (.csv or .xlsx).',
      'Executive Summary Presentation / Memo (PDF or slides link) highlighting root-cause churn findings.'
    ],
    evaluationCriteriaOverview: [
      'Query Accuracy & Logical Structure (25%)',
      'Effective Use of Advanced SQL Features: Window functions, CTEs (25%)',
      'Data Integrity & NULL Handling (25%)',
      'Actionable Business Insights & Clarity of Recommendations (25%)'
    ],
    submissionInstructions: [
      'Commit your SQL script and documentation to a GitHub repository or upload a zipped archive (.zip).',
      'Ensure all SQL queries are tested against PostgreSQL, MySQL 8+, or BigQuery standard dialect.',
      'Submit the repository link or attach the deliverable files below before the deadline.'
    ]
  },
  {
    id: 'proj-mod-2-excel',
    phaseNumber: 1,
    moduleNumber: 2,
    type: 'minor',
    title: 'Module 2 — Excel Minor Project',
    shortDescription: 'Diagnose store-level operating margins, labor efficiency, and recipe cost variance across 42 branches for a regional coffee chain using Power Query and financial models.',
    technologies: ['Excel'],
    submissionDeadline: '22 Nov 2026, 11:59 PM',
    objective: 'Build an automated financial model and executive KPI dashboard in Excel using Power Query, dynamic array formulas, and sensitivity matrices to evaluate store turnaround opportunities.',
    businessContext: 'BeanCraft Coffee operates 42 retail cafes. Despite a 14% increase in total customer footfall, operating margins have compressed by 680 basis points over the past 12 months. Leadership requires branch-level unit economics to identify loss-making locations and raw material cost leakage.',
    problemStatement: 'Store managers submit separate, inconsistent monthly workbooks. You must consolidate multi-branch extracts using Power Query, build automated XLOOKUP and dynamic spill tables, model food cost percentages against ideal recipe benchmarks, and create a two-variable sensitivity table testing rent and labor escalation.',
    expectedOutcome: 'A production-grade Excel workbook with an automated 1-click refresh pipeline, dynamic sensitivity analysis, and an executive KPI dashboard with slicers and conditional alerting.',
    skillsRequired: [
      { name: 'Power Query ETL Automation', category: 'Data Transformation' },
      { name: 'Modern Lookup Formulas (XLOOKUP, FILTER, UNIQUE)', category: 'Advanced Formulas' },
      { name: 'Dynamic Pivot Tables & Slicers', category: 'Reporting' },
      { name: 'Two-Variable Sensitivity Analysis & Goal Seek', category: 'Financial Modeling' },
      { name: 'Executive Dashboard UI & Data Visualization', category: 'Business Storytelling' }
    ],
    resources: [
      {
        id: 'res-excel-1',
        name: 'beancraft_multi_store_financials_raw.xlsx',
        type: 'xlsx',
        size: '8.4 MB',
        url: '#download-excel-raw',
        description: 'Raw financial statements, labor scheduling logs, and SKU sales across 42 branch locations.',
        isDownloadable: true
      },
      {
        id: 'res-excel-2',
        name: 'beancraft_recipe_cost_matrix.xlsx',
        type: 'xlsx',
        size: '1.5 MB',
        url: '#download-recipe-cost',
        description: 'Ideal recipe BOM (Bill of Materials) unit costs for coffee beverages, dairy, syrups, and pastries.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'Establish a Power Query ingestion flow that cleans null values, unpivots weekly shifts, and merges store metadata.',
      'Replace all legacy VLOOKUPs with XLOOKUP and dynamic FILTER/SORT formulas.',
      'Construct a Store Profitability Matrix ranking all 42 stores by Gross Margin % and EBITDA contribution.',
      'Build a two-variable Sensitivity Matrix evaluating the impact of a 5% to 15% increase in coffee bean prices against retail price adjustments.',
      'Design an interactive Executive Dashboard tab with store region slicers and conditional traffic-light formatting.'
    ],
    deliverables: [
      'Comprehensive, uncorrupted Excel workbook (.xlsx) with formulas intact (not hardcoded values).',
      'Executive Summary tab including key diagnostic findings and branch turnaround recommendations.'
    ],
    evaluationCriteriaOverview: [
      'Power Query ETL Pipeline Rigor & Repeatability (25%)',
      'Formula Precision & Use of Dynamic Arrays (25%)',
      'Financial Model Logic & Sensitivity Analysis (25%)',
      'Dashboard Ergonomics, Visual Hierarchy & Insights (25%)'
    ],
    submissionInstructions: [
      'Upload the completed .xlsx file directly or provide a shareable OneDrive/Google Drive link with view permissions.',
      'Ensure all pivot tables are refreshed and calculation options are set to Automatic.'
    ]
  },
  {
    id: 'proj-mod-3-tableau',
    phaseNumber: 1,
    moduleNumber: 3,
    type: 'minor',
    title: 'Module 3 — Tableau Minor Project',
    shortDescription: 'Design an interactive supply chain intelligence dashboard tracking maritime, air, and trucking freight bottlenecks, vendor reliability, and SLA penalties.',
    technologies: ['Tableau'],
    submissionDeadline: '30 Nov 2026, 11:59 PM',
    objective: 'Create an executive-level interactive business intelligence storyboard in Tableau using Level of Detail (LOD) calculations, dual-axis geospatial maps, and cross-filtering dashboard actions.',
    businessContext: 'Apex Global Logistics coordinates multi-modal freight shipments across 18 countries. Persistent port congestion and carrier SLA breaches have caused a 31% spike in client delay penalties. Operations leadership requires real-time BI visibility to identify chronically underperforming shipping lanes and renegotiate vendor contracts.',
    problemStatement: 'The operations dataset comprises shipping logs with multi-leg journey timestamps, weight categories, customs dwell times, and demurrage costs. You need to normalize the date grains, write FIXED and INCLUDE LOD expressions to compute lane-level on-time delivery percentages, and design an intuitive multi-tab storyboard with interactive drill-throughs.',
    expectedOutcome: 'A published Tableau Public dashboard URL or packaged workbook (.twbx) delivering an executive overview, carrier comparison matrix, and deep-dive root-cause delay analyzer.',
    skillsRequired: [
      { name: 'Level of Detail (LOD) Calculations: FIXED & INCLUDE', category: 'Tableau Calculations' },
      { name: 'Dual-Axis Geospatial Mapping', category: 'Geospatial Visuals' },
      { name: 'Interactive Filter, Highlight & URL Actions', category: 'Dashboard Ergonomics' },
      { name: 'Visual Best Practices & Color Theory', category: 'Data Visualization' },
      { name: 'Tableau Storyboarding & KPI Card Design', category: 'BI Storytelling' }
    ],
    resources: [
      {
        id: 'res-tab-1',
        name: 'apex_global_freight_shipments_2026.csv',
        type: 'csv',
        size: '12.1 MB',
        url: '#download-freight-csv',
        description: '86,000 international shipment records with port codes, departure/arrival timestamps, carrier names, and penalty charges.',
        isDownloadable: true
      },
      {
        id: 'res-tab-2',
        name: 'tableau_style_guide_and_palettes.pdf',
        type: 'pdf',
        size: '850 KB',
        url: '#download-style-guide',
        description: 'Brand color codes, typography standards, and layout templates for Apex Global BI reports.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'Connect to the freight dataset and define accurate date hierarchies and geographic roles for origin/destination ports.',
      'Write FIXED LOD calculations to calculate Carrier On-Time In-Full (OTIF) % independent of view filtering.',
      'Construct a Dual-Axis Flow Map displaying route volume thickness and average delay days.',
      'Develop a Carrier SLA Penalty Matrix sorting freight operators by aggregate chargebacks.',
      'Build an integrated 3-view storyboard with interactive dashboard actions and tooltips.'
    ],
    deliverables: [
      'Tableau Public Live URL OR packaged Tableau workbook (.twbx).',
      'Dashboard Walkthrough Document / Video (PDF summary or Loom link explaining analytical design decisions).'
    ],
    evaluationCriteriaOverview: [
      'LOD Calculation Complexity & Correctness (25%)',
      'Visual Encoding, Chart Selection & Layout (25%)',
      'Interactivity: Action filters, parameters & tooltips (25%)',
      'Actionable Operational Value for Freight Executives (25%)'
    ],
    submissionInstructions: [
      'Publish your dashboard to Tableau Public and paste the public link in the workspace.',
      'Alternatively, upload the packaged .twbx workbook file below.'
    ]
  },
  {
    id: 'proj-capstone-1',
    phaseNumber: 1,
    type: 'major',
    title: 'Phase 1 — Capstone / Major Project',
    shortDescription: 'Comprehensive end-to-end analytics platform: Extract transactional cohorts in SQL, build unit economics models in Excel, and deploy an executive Tableau early-warning churn dashboard.',
    technologies: ['SQL', 'Excel', 'Tableau'],
    submissionDeadline: '10 Dec 2026, 11:59 PM',
    objective: 'Synthesize all Phase 1 capabilities (SQL data extraction, Excel financial sensitivity, and Tableau BI visualization) into an integrated enterprise analytics project presented to a mock executive board.',
    businessContext: 'PulseFlow SaaS is a high-growth subscription software company generating $48M in Annual Recurring Revenue (ARR). Over the past three quarters, Net Revenue Retention (NRR) declined from 118% to 94%, primarily driven by small-and-medium business (SMB) license contractions and tier cancellations. The Board has commissioned an exhaustive analytical review to identify churn drivers, calculate revenue-at-risk, and present a data-backed turnaround roadmap.',
    problemStatement: 'This integrated capstone requires students to operate like lead business analysts: ingest raw production databases in SQL, model financial scenarios and customer payback periods in Excel, design an interactive executive Tableau dashboard, and defend their turnaround strategy before senior mentor reviewers.',
    expectedOutcome: 'An enterprise-grade portfolio capstone featuring a SQL data transformation pipeline, a financial Excel model with scenario simulations, a published Tableau executive dashboard, and a professional strategic presentation deck.',
    skillsRequired: [
      { name: 'End-to-End Analytics Workflow', category: 'Cross-Functional' },
      { name: 'Complex SQL Pipeline & Cohort Extraction', category: 'Data Engineering' },
      { name: 'Unit Economics (CAC, LTV, NRR, GRR) Modeling', category: 'Financial Strategy' },
      { name: 'Enterprise Tableau BI Dashboard Architecture', category: 'Executive Reporting' },
      { name: 'Executive Presentation & Data Storytelling', category: 'Leadership Communication' }
    ],
    resources: [
      {
        id: 'res-cap1-1',
        name: 'pulseflow_saas_full_database_dump.sql',
        type: 'sql',
        size: '28.5 MB',
        url: '#download-saas-sql',
        description: 'Complete relational database dump containing customer accounts, subscription events, feature usage telemetry, and support tickets.',
        isDownloadable: true
      },
      {
        id: 'res-cap1-2',
        name: 'pulseflow_financial_plan_and_cac_data.xlsx',
        type: 'xlsx',
        size: '4.8 MB',
        url: '#download-saas-excel',
        description: 'Historical marketing spend by channel, sales commission structures, and COGS benchmarks.',
        isDownloadable: true
      },
      {
        id: 'res-cap1-3',
        name: 'capstone_board_presentation_template.pdf',
        type: 'pdf',
        size: '2.1 MB',
        url: '#download-presentation-template',
        description: 'C-Suite presentation slide structure with required milestone exhibits and financial disclosure rubrics.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'Milestone 1 (SQL): Design schema queries extracting Monthly Active Users, feature engagement scores, and cohort renewal rates.',
      'Milestone 2 (Excel): Build an automated financial model calculating Net Revenue Retention (NRR), Gross Revenue Retention (GRR), and CAC payback across acquisition channels.',
      'Milestone 3 (Tableau): Build an executive C-suite dashboard tracking Revenue-at-Risk, early-warning health scores, and regional sales performance.',
      'Milestone 4 (Defense): Assemble a 10-slide executive board deck and deliver actionable pricing/retention recommendations.'
    ],
    deliverables: [
      'SQL Pipeline Repository with clean ETL scripts (.sql).',
      'Dynamic Financial Model Workbook with sensitivity scenarios (.xlsx).',
      'Published Tableau Public Dashboard URL with interactive drilldowns.',
      'Final Executive Strategic Deck (.pdf / slides URL) and 5-minute video walkthrough.'
    ],
    evaluationCriteriaOverview: [
      'SQL Data Pipeline Rigor & Modeling Correctness (25%)',
      'Excel Financial Accuracy & Sensitivity Mechanics (25%)',
      'Tableau Visual Excellence & Executive Usability (25%)',
      'Strategic Business Recommendations & Board Defense (25%)'
    ],
    submissionInstructions: [
      'Complete and verify all three project components.',
      'Submit the consolidated GitHub repository containing SQL scripts, Excel workbook, Tableau Public link, and board presentation deck below.',
      'After submission, schedule your Capstone Mock Defense with your assigned senior industry mentor.'
    ],
    milestones: [
      {
        id: 'ms-1-1',
        milestoneNumber: 1,
        title: 'SQL Data Modeling & Cohort Extraction',
        description: 'Extract customer subscription events, clean telemetry logs, and compute NRR/GRR cohort matrices.',
        deliverables: ['SQL scripts (.sql)', 'Exported cohort data (.csv)'],
        status: 'Completed',
        completionDate: '28 Oct 2026',
        mentorRemarks: 'Excellent query optimization using CTEs and window partitions. Zero Cartesian products.'
      },
      {
        id: 'ms-1-2',
        milestoneNumber: 2,
        title: 'Excel Financial Sensitivity & Margin Modeling',
        description: 'Construct unit economics models evaluating CAC payback periods and revenue loss scenarios.',
        deliverables: ['Financial model (.xlsx)', 'Two-variable data tables'],
        status: 'Completed',
        completionDate: '30 Oct 2026',
        mentorRemarks: 'Solid sensitivity matrix. Accurate LTV/CAC formulations across customer tiers.'
      },
      {
        id: 'ms-1-3',
        milestoneNumber: 3,
        title: 'Tableau Interactive Executive Dashboard & Board Presentation',
        description: 'Publish executive storyboard and assemble the strategic turnaround presentation.',
        deliverables: ['Tableau Public Live URL', 'Board-level presentation deck (.pdf)'],
        status: 'In Progress'
      }
    ]
  },

  // ========================================================
  // PHASE 2 — ADVANCED PROJECTS
  // ========================================================
  {
    id: 'proj-mod-5-python',
    phaseNumber: 2,
    moduleNumber: 5,
    type: 'minor',
    title: 'Module 5 — Core Python Minor Project',
    shortDescription: 'Build an algorithmic order matching engine and real-time financial ledger in pure Core Python using custom data structures, OOP classes, and generator pipelines.',
    technologies: ['Python'],
    submissionDeadline: '18 Dec 2026, 11:59 PM',
    objective: 'Demonstrate mastery of Core Python language fundamentals, object-oriented programming, exception architectures, and algorithmic efficiency without relying on third-party libraries.',
    businessContext: 'A fintech trading venue requires a lightweight simulated order book matching engine to test limit orders, market orders, and account debit/credit ledgers for cryptocurrency and equity transactions with zero latency degradation.',
    problemStatement: 'You must implement a high-performance order book from scratch. Using Python classes, custom doubly linked lists or priority queues, generators, and context managers, build an engine that processes streaming trade orders, validates double-entry ledger balance conservation, and logs trade execution receipts.',
    expectedOutcome: 'A clean, PEP-8 compliant Python package with modular classes, comprehensive unit test suites (95%+ code coverage), and asymptotic time complexity documentation.',
    skillsRequired: [
      { name: 'Object-Oriented Programming (OOP) & Inheritance', category: 'Core Python' },
      { name: 'Custom Data Structures (Heaps, Linked Lists)', category: 'Algorithms' },
      { name: 'Generators, Iterators & Memory Optimization', category: 'Advanced Python' },
      { name: 'Custom Exception Handling & Context Managers', category: 'Software Design' },
      { name: 'Unit Testing with unittest / pytest', category: 'Quality Assurance' }
    ],
    resources: [
      {
        id: 'res-py-1',
        name: 'trade_orders_sample_stream.jsonl',
        type: 'doc',
        size: '5.2 MB',
        url: '#download-orders-stream',
        description: 'Synthetic high-frequency streaming order feed with buy/sell timestamps, limit prices, and volume quantities.',
        isDownloadable: true
      },
      {
        id: 'res-py-2',
        name: 'order_matching_engine_spec.pdf',
        type: 'pdf',
        size: '1.1 MB',
        url: '#download-spec-pdf',
        description: 'Full architectural specification defining price-time priority (FIFO matching) and error codes.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'Implement `Order`, `OrderBook`, `MatchingEngine`, and `AccountLedger` classes in modular `.py` files.',
      'Support both `LIMIT` orders and `MARKET` orders with price-time priority execution.',
      'Ensure account balances are updated atomically using Python context managers (`with` blocks).',
      'Handle edge cases: partial order fills, cancellations, and insufficient funds exceptions.',
      'Write automated unit tests verifying that all test orders execute correctly with zero ledger imbalance.'
    ],
    deliverables: [
      'GitHub Repository link containing the clean Python package.',
      'Comprehensive `test_matching_engine.py` suite with passing unit tests.',
      'README.md documentation explaining class architecture and Big-O runtime analysis.'
    ],
    evaluationCriteriaOverview: [
      'Object-Oriented Design & Clean Architecture (25%)',
      'Algorithmic Correctness & Edge Case Handling (25%)',
      'Code Quality, PEP-8 Style & Docstrings (25%)',
      'Unit Test Coverage & Assertions (25%)'
    ],
    submissionInstructions: [
      'Push your clean code to a public or private GitHub repository.',
      'Paste your repository URL and write a brief summary of your architecture in the submission box below.'
    ]
  },
  {
    id: 'proj-mod-6-libraries',
    phaseNumber: 2,
    moduleNumber: 6,
    type: 'minor',
    title: 'Module 6 — Python Libraries Minor Project',
    shortDescription: 'Conduct exploratory data analysis on 85,000 credit risk records using NumPy, Pandas, Matplotlib, and Seaborn to uncover default indicators and borrower profiles.',
    technologies: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn'],
    submissionDeadline: '28 Dec 2026, 11:59 PM',
    objective: 'Apply the scientific Python stack (NumPy, Pandas, Matplotlib, Seaborn) to clean messy fintech datasets, impute missing observations, engineer credit features, and generate publication-quality visual insights.',
    businessContext: 'CreditWise, a peer-to-peer lending startup, has suffered an unexpected 4.8% increase in 90-day non-performing loans (NPLs). The risk underwriting committee needs an in-depth exploratory analysis to calibrate risk weightings, uncover credit score anomalies, and determine the predictive strength of debt-to-income (DTI) ratios.',
    problemStatement: 'The credit dataset has 85,000 rows across 32 numerical and categorical variables, riddled with missing income observations, skewed loan amounts, and erroneous employment tenure entries. You must engineer vector-accelerated transformations in NumPy and Pandas, remove anomalies, and generate informative Seaborn visualizations.',
    expectedOutcome: 'A fully executable Jupyter Notebook (.ipynb) with clean markdown commentary, publication-ready statistical visualizations, and an exportable cleaned dataset.',
    skillsRequired: [
      { name: 'NumPy Vectorized Calculations & Masking', category: 'Scientific Computing' },
      { name: 'Pandas Data Cleaning, Groupby & Pivots', category: 'Data Manipulation' },
      { name: 'Outlier Detection (IQR & Z-Score)', category: 'Data Preprocessing' },
      { name: 'Seaborn & Matplotlib Statistical Graphics', category: 'Visual Analytics' },
      { name: 'Exploratory Data Analysis (EDA) Best Practices', category: 'Data Science' }
    ],
    resources: [
      {
        id: 'res-lib-1',
        name: 'creditwise_loan_applicants_2026_raw.csv',
        type: 'csv',
        size: '18.6 MB',
        url: '#download-credit-csv',
        description: '85,000 loan applicant records including FICO scores, annual income, loan grade, inquiries, and default outcomes.',
        isDownloadable: true
      },
      {
        id: 'res-lib-2',
        name: 'eda_starter_notebook_template.ipynb',
        type: 'doc',
        size: '450 KB',
        url: '#download-notebook-template',
        description: 'Jupyter notebook template with required section headers, dataset schema dictionary, and plotting themes.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'Load the dataset with appropriate datatypes and perform automated missing-value audits.',
      'Impute missing values using median/mode strategy grouped by employment title and loan grade.',
      'Detect and treat extreme outliers in annual income and revolving line utilization.',
      'Construct correlation heatmaps, distribution plots (KDE), and multi-panel boxplots exploring default correlations.',
      'Synthesize 5 concrete credit underwriting rules based on your empirical statistical findings.'
    ],
    deliverables: [
      'Executed Jupyter Notebook (.ipynb) with all cell outputs visible.',
      'GitHub repository link with requirements.txt and project documentation.',
      'Exported cleaned dataset (.csv or .parquet).'
    ],
    evaluationCriteriaOverview: [
      'Data Cleaning Rigor & Handling of Missing/Invalid Values (25%)',
      'Pandas/NumPy Code Vectorization & Elegance (25%)',
      'Visual Clarity, Chart Annotations & Color Choices (25%)',
      'Depth of Credit Risk Insights & Business Sense (25%)'
    ],
    submissionInstructions: [
      'Ensure all Jupyter Notebook cells are executed sequentially before saving.',
      'Upload the .ipynb notebook file or provide a GitHub repository link below.'
    ]
  },
  {
    id: 'proj-mod-7-stats',
    phaseNumber: 2,
    moduleNumber: 7,
    type: 'minor',
    title: 'Module 7 — Statistics & Probability Minor Project',
    shortDescription: 'Design, evaluate, and statistically validate a high-traffic A/B checkout experiment using hypothesis testing, Z-tests, Welch’s t-tests, and statistical power calculations.',
    technologies: ['Statistics and Probability'],
    submissionDeadline: '10 Jan 2027, 11:59 PM',
    objective: 'Apply classical statistical theory and probabilistic thinking to evaluate conversion lifts, verify sample ratio mismatch (SRM), compute p-values and confidence intervals, and recommend business launch decisions.',
    businessContext: 'QuickCart, an on-demand grocery delivery platform with 2.8M monthly orders, redesigned its checkout interface to introduce a 1-click Apple Pay/UPI express lane. A randomized controlled trial (A/B test) was executed across 65,000 visitors over 14 days. The Product VP needs statistical confirmation whether the observed conversion lift is statistically significant or merely sampling noise.',
    problemStatement: 'Students must verify experiment integrity: test for Sample Ratio Mismatch (SRM) using Chi-Square goodness-of-fit, conduct two-tailed two-sample Z-tests on proportion conversions, compute Welch’s t-test on Average Order Value (AOV), evaluate statistical power (1-beta) at alpha=0.05, and calculate 95% confidence intervals.',
    expectedOutcome: 'A comprehensive statistical experimentation report in Python with mathematical proofs, distribution curve visualizations, and an executive go/no-go product launch recommendation memo.',
    skillsRequired: [
      { name: 'Hypothesis Testing (Null & Alternative Formulations)', category: 'Inferential Stats' },
      { name: 'Two-Sample Z-Test & Student/Welch T-Test', category: 'Parametric Tests' },
      { name: 'Sample Ratio Mismatch (Chi-Square Goodness-of-Fit)', category: 'Experiment Integrity' },
      { name: 'Statistical Power & Minimum Detectable Effect (MDE)', category: 'Experimentation' },
      { name: 'Confidence Intervals & Business Decision Frameworks', category: 'Decision Sciences' }
    ],
    resources: [
      {
        id: 'res-stat-1',
        name: 'quickcart_ab_test_checkout_sessions.csv',
        type: 'csv',
        size: '9.8 MB',
        url: '#download-abtest-csv',
        description: '65,000 session logs with user IDs, experiment group assignment (Control vs Variant), checkout timestamps, conversions, and basket revenue.',
        isDownloadable: true
      },
      {
        id: 'res-stat-2',
        name: 'statistical_testing_formulations_reference.pdf',
        type: 'pdf',
        size: '1.4 MB',
        url: '#download-stats-formulas',
        description: 'Statistical equations, critical value tables, and step-by-step hypothesis verification checklists.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'State null and alternative hypotheses formally for both Conversion Rate and Average Order Value.',
      'Check for Sample Ratio Mismatch (SRM) using a Chi-Square test at alpha = 0.01.',
      'Compute point estimates, standard errors, pooled variance, test statistics (Z and t), and p-values.',
      'Construct and visualize 95% confidence intervals for absolute and relative lifts.',
      'Deliver an unambiguous Go/No-Go launch recommendation addressing trade-offs, revenue projections, and risk.'
    ],
    deliverables: [
      'Python Analysis Script or Jupyter Notebook (.py or .ipynb).',
      'Executive Experiment Decision Memo (2-3 page PDF) tailored for product executives.'
    ],
    evaluationCriteriaOverview: [
      'Mathematical & Statistical Accuracy (25%)',
      'Experiment Diagnostics: SRM, Power & Alpha control (25%)',
      'Visualization of Test Distributions & Confidence Intervals (25%)',
      'Clarity and Prudence of Business Launch Decision (25%)'
    ],
    submissionInstructions: [
      'Submit your completed Python statistical analysis notebook and executive decision memo below.'
    ]
  },
  {
    id: 'proj-capstone-2',
    phaseNumber: 2,
    type: 'major',
    title: 'Phase 2 — Capstone / Major Project',
    shortDescription: 'Enterprise Autonomous Customer Intelligence & Churn AI Agent: Train predictive machine learning models and deploy a multimodal GenAI conversational analytics agent for executives.',
    technologies: ['Python', 'Scikit-Learn', 'GenAI', 'Cloud APIs'],
    submissionDeadline: '25 Jan 2027, 11:59 PM',
    objective: 'Build, deploy, and defend an end-to-end production-grade AI system that pairs predictive machine learning with an autonomous generative AI data agent that explains churn risks, queries databases via function calling, and generates executive retention playbooks.',
    businessContext: 'FinStream Global operates a digital banking and wealth platform serving 450,000 retail accounts. Facing competitive fintech pressures, the executive board requires a next-generation Customer Intelligence System. Rather than passive static dashboards, they want a predictive churn early-warning engine integrated with a 24/7 autonomous GenAI assistant capable of answering complex ad-hoc business questions and generating custom customer retention letters.',
    problemStatement: 'This premier capstone tests full-stack data science: feature engineering on high-dimensional banking data, training and tuning predictive classification algorithms (LightGBM/XGBoost/RandomForest), evaluating with ROC-AUC and precision-recall trade-offs, and building an autonomous AI agent with function calling, structured JSON output, and an interactive Streamlit or web interface.',
    expectedOutcome: 'A production-grade AI portfolio capstone with a tested ML model pipeline, an interactive GenAI agent web app, live demo deployment, GitHub repository with CI/CD, and a recorded 10-minute capstone presentation.',
    skillsRequired: [
      { name: 'Machine Learning Classification & Feature Engineering', category: 'Predictive Modeling' },
      { name: 'Model Evaluation: ROC-AUC, Precision, Recall, PR-Curves', category: 'Model Diagnostics' },
      { name: 'Generative AI & LLM Tool Use / Function Calling', category: 'GenAI & Agents' },
      { name: 'Web App Prototyping (Streamlit / FastHTML / Next.js)', category: 'Full-Stack Data' },
      { name: 'Live Defense & Executive Stakeholder Pitching', category: 'Executive Presence' }
    ],
    resources: [
      {
        id: 'res-cap2-1',
        name: 'finstream_customer_behavior_features.parquet',
        type: 'doc',
        size: '34.2 MB',
        url: '#download-finstream-data',
        description: 'Multi-year banking records with 450,000 customers, 48 features, transaction frequency, debit card usage, and churn status.',
        isDownloadable: true
      },
      {
        id: 'res-cap2-2',
        name: 'genai_agent_starter_architecture.zip',
        type: 'sql',
        size: '3.8 MB',
        url: '#download-genai-starter',
        description: 'Starter code scaffolding for function calling, prompt templates, and Streamlit user interface.',
        isDownloadable: true
      },
      {
        id: 'res-cap2-3',
        name: 'phase_2_capstone_defense_rubric.pdf',
        type: 'pdf',
        size: '1.2 MB',
        url: '#download-defense-rubric',
        description: 'Evaluation criteria used by the senior hiring manager panel during live capstone defense.',
        isDownloadable: true
      }
    ],
    taskRequirements: [
      'Milestone 1: Clean raw banking telemetry, engineer 15+ behavioral risk signals, and handle class imbalance (SMOTE / class weighting).',
      'Milestone 2: Train, tune, and cross-validate multiple ML models (XGBoost, Random Forest, Logistic Regression) targeting ROC-AUC > 0.86.',
      'Milestone 3: Develop the GenAI Autonomous Analyst Agent capable of tool use (querying customer profile database and calculating retention risk).',
      'Milestone 4: Deploy the interactive web demo and assemble the technical architecture documentation and video defense.'
    ],
    deliverables: [
      'Production GitHub Repository with modular code, virtual environment specs, and documentation.',
      'Serialized trained ML model artifact and inference pipeline.',
      'Live deployed interactive application URL (Streamlit Cloud, HuggingFace Spaces, or Vercel).',
      '10-Minute Video Walkthrough & Presentation Deck (.pdf).'
    ],
    evaluationCriteriaOverview: [
      'Predictive Modeling Rigor, Feature Engineering & Validation (25%)',
      'GenAI Agent Architecture, Tool Use & Reliability (25%)',
      'Interactive User Experience & Deployment Polish (25%)',
      'Technical Communication & Live Defense Quality (25%)'
    ],
    submissionInstructions: [
      'Submit your consolidated GitHub repository link, live application demo URL, and presentation video link below.',
      'Once submitted, the system will open booking slots for your Live Capstone Panel Defense with senior data scientists.'
    ],
    milestones: [
      {
        id: 'ms-2-1',
        milestoneNumber: 1,
        title: 'Feature Engineering & Predictive ML Pipeline',
        description: 'Build robust data pre-processing, engineer behavioral churn predictors, and train benchmark classification models.',
        deliverables: ['Jupyter notebook', 'Serialized ML model (.pkl / .joblib)'],
        status: 'Upcoming'
      },
      {
        id: 'ms-2-2',
        milestoneNumber: 2,
        title: 'GenAI Autonomous Analyst Agent Implementation',
        description: 'Integrate LLM function calling to query predictions, explain churn risk factors, and draft retention offers.',
        deliverables: ['Agent Python scripts', 'Tool integration tests'],
        status: 'Upcoming'
      },
      {
        id: 'ms-2-3',
        milestoneNumber: 3,
        title: 'Web Deployment & Technical Capstone Defense',
        description: 'Deploy interactive application and defend the system before the industry evaluator committee.',
        deliverables: ['Live App URL', '10-min Video Defense'],
        status: 'Upcoming'
      }
    ]
  }
];

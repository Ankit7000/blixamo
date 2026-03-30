import { getCategoryMeta } from './categories'
import type { Post } from './posts'

export const PILLAR_BASE_PATH = '/guides'
export const PILLAR_RESOURCE_HUB_PATH = '/tag/deployment'

type PillarFaq = {
  question: string
  answer: string
}

type PillarHeroEntry = {
  heading: string
  label?: string
  href?: string
  text: string
}

type PillarPostGroupDefinition = {
  title: string
  description: string
  slugs: readonly string[]
}

type PillarPostGroup = {
  title: string
  description: string
  posts: Post[]
}

type PillarResourceLinkDefinition = {
  label: string
  href: string
  description: string
}

type PillarCategoryLink = {
  slug: string
  label: string
  href: string
  description: string
  icon: string
  color: string
}

type PillarDefinition = {
  slug: string
  title: string
  description: string
  eyebrow: string
  primaryCategory: string
  supportingCategories: readonly string[]
  intro: string
  whatIs: string
  whyItMatters: string
  heroEntry: PillarHeroEntry
  startHere: string
  notFor: string
  whenToUse: readonly string[]
  bestToolsIntro: string
  guidesIntro: string
  comparisonsIntro: string
  recommendedSetupIntro: string
  recommendedSetup: readonly string[]
  learningPathIntro: string
  topicArticlesIntro: string
  relatedArticlesIntro: string
  conclusion: string
  faq: readonly PillarFaq[]
  guideSlugs: readonly string[]
  comparisonSlugs: readonly string[]
  toolSlugs: readonly string[]
  learningPathSlugs: readonly string[]
  comparisonGroups?: readonly PillarPostGroupDefinition[]
  relatedResourceLinks: readonly PillarResourceLinkDefinition[]
}

export type PillarPage = {
  slug: string
  title: string
  description: string
  eyebrow: string
  href: string
  primaryCategory: PillarCategoryLink
  supportingCategories: PillarCategoryLink[]
  intro: string
  whatIs: string
  whyItMatters: string
  heroEntry: PillarHeroEntry
  startHere: string
  notFor: string
  whenToUse: string[]
  bestToolsIntro: string
  guidesIntro: string
  comparisonsIntro: string
  recommendedSetupIntro: string
  recommendedSetup: string[]
  learningPathIntro: string
  topicArticlesIntro: string
  relatedArticlesIntro: string
  conclusion: string
  faq: PillarFaq[]
  primaryArticles: Post[]
  guides: Post[]
  comparisons: Post[]
  comparisonGroups: PillarPostGroup[]
  tools: Post[]
  learningPath: Post[]
  topicArticles: Post[]
  relatedArticles: Post[]
  relatedResources: PillarResourceLinkDefinition[]
  articleCount: number
}

const COMPARISON_SLUGS = [
  'claude-api-vs-openai-cost-india',
  'claude-api-vs-openai-gpt4-2026',
  'claude-vs-chatgpt-developers',
  'coolify-vs-caprover-2026',
  'hetzner-vs-aws-2026',
  'hetzner-vs-aws-lightsail-2026',
  'hetzner-vs-digitalocean-vs-vultr-india',
  'hetzner-vs-vultr-vs-linode-2026',
  'n8n-vs-make-vs-zapier-indie-dev',
  'oracle-cloud-free-vs-hetzner-2026',
  'tailwind-css-vs-css-modules',
  'wise-vs-payoneer-india-freelancer',
] as const

const PRIMARY_PILLAR_BY_ARTICLE: Record<string, string> = {
  'best-ai-tools-2026': 'developer-tools-directory',
  'best-free-api-testing-tools-2026': 'free-tools-for-developers',
  'best-free-diagram-tools-2026': 'free-tools-for-developers',
  'best-free-documentation-tools-2026': 'free-tools-for-developers',
  'best-free-developer-tools-2026': 'developer-tools-directory',
  'best-free-git-tools-2026': 'free-tools-for-developers',
  'best-postgresql-gui-free': 'developer-tools-directory',
  'best-vpn-for-developers-2026': 'developer-tools-directory',
  'build-saas-mvp-zero-budget-2026': 'free-tools-for-developers',
  'build-telegram-bot-claude-api-python': 'automation-guide-for-developers',
  'claude-ai-guide': 'developer-tools-directory',
  'claude-api-content-automation-nodejs': 'automation-guide-for-developers',
  'claude-api-vs-openai-cost-india': 'comparisons-hub',
  'claude-api-vs-openai-gpt4-2026': 'comparisons-hub',
  'claude-vs-chatgpt-developers': 'comparisons-hub',
  'compromised-vps-recovery-2026': 'vps-cloud-for-developers-guide',
  'coolify-complete-guide-2026': 'self-hosting-complete-guide',
  'coolify-vs-caprover-2026': 'comparisons-hub',
  'deploy-nextjs-coolify-hetzner': 'deploy-apps-on-vps-complete-guide',
  'docker-compose-production-vps-2026': 'deploy-apps-on-vps-complete-guide',
  'free-tools-indian-indie-developer': 'free-tools-for-developers',
  'free-vps-hosting-2026': 'vps-cloud-for-developers-guide',
  'getting-started-with-nextjs': 'developer-tools-directory',
  'google-search-console-self-hosted-nextjs': 'deploy-apps-on-vps-complete-guide',
  'hetzner-alternatives-cheap-vps-2026': 'vps-cloud-for-developers-guide',
  'hetzner-payment-methods-2026': 'vps-cloud-for-developers-guide',
  'hetzner-vs-aws-2026': 'vps-cloud-for-developers-guide',
  'hetzner-vs-aws-lightsail-2026': 'vps-cloud-for-developers-guide',
  'hetzner-vs-digitalocean-vs-vultr-india': 'vps-cloud-for-developers-guide',
  'hetzner-vs-vultr-vs-linode-2026': 'vps-cloud-for-developers-guide',
  'how-to-self-host-nextjs-on-vps': 'deploy-apps-on-vps-complete-guide',
  'indian-debit-cards-dev-tools': 'free-tools-for-developers',
  'multiple-projects-single-vps': 'deploy-apps-on-vps-complete-guide',
  'n8n-fastapi-hetzner-vps': 'automation-guide-for-developers',
  'n8n-complete-guide-2026': 'automation-guide-for-developers',
  'n8n-vs-make-vs-zapier-indie-dev': 'automation-guide-for-developers',
  'nextjs-mdx-blog-2026': 'developer-tools-directory',
  'nextjs-mdx-remote-rsc-edge-runtime-fix': 'developer-tools-directory',
  'nextjs-performance-optimization-2026': 'developer-tools-directory',
  'nginx-reverse-proxy-guide-2026': 'deploy-apps-on-vps-complete-guide',
  'open-source-tools-2026': 'free-tools-for-developers',
  'oracle-cloud-free-vs-hetzner-2026': 'vps-cloud-for-developers-guide',
  'pay-hetzner-from-india': 'vps-cloud-for-developers-guide',
  'razorpay-integration-nextjs-india': 'free-tools-for-developers',
  'self-healing-vps-monitor-nodejs': 'self-hosting-complete-guide',
  'self-host-plausible-analytics-2026': 'self-hosting-complete-guide',
  'self-hosting-n8n-hetzner-vps': 'self-hosting-complete-guide',
  'self-hosting-resources': 'self-hosting-complete-guide',
  'ssh-security-hardening-vps-2026': 'vps-cloud-for-developers-guide',
  'tailwind-css-tips': 'developer-tools-directory',
  'tailwind-css-vs-css-modules': 'developer-tools-directory',
  'ubuntu-vps-hardening-checklist': 'vps-cloud-for-developers-guide',
  'best-vps-monitoring-tools-2026': 'vps-cloud-for-developers-guide',
  'vps-security-harden-ubuntu-2026': 'vps-cloud-for-developers-guide',
  'vps-setup-guide': 'deploy-apps-on-vps-complete-guide',
  'whatsapp-ai-assistant-n8n-claude-api': 'automation-guide-for-developers',
  'wise-vs-payoneer-india-freelancer': 'comparisons-hub',
}

const PILLAR_DEFINITIONS: readonly PillarDefinition[] = [
  {
    slug: 'self-hosting-complete-guide',
    title: 'Self Hosting Complete Guide',
    description: 'The main pillar page for self-hosting apps, analytics, automation, and supporting services.',
    eyebrow: 'Self Hosting',
    primaryCategory: 'self-hosting',
    supportingCategories: ['how-to', 'vps-cloud', 'automation'],
    intro: 'Start here if you want to run useful apps and services on your own VPS without turning one cheap server into a messy side project. The goal is a small self-hosted stack you can understand, recover, and keep online.',
    whatIs: 'Self-hosting here means running real app workloads, automation, analytics, and supporting services on infrastructure you control instead of outsourcing every layer to SaaS.',
    whyItMatters: 'Self-hosting pays off when it lowers recurring cost, gives you better control over data and deploy flow, and keeps the stack small enough that one developer can still operate it calmly.',
    heroEntry: {
      heading: 'Best first read:',
      label: 'Self Hosting Resources',
      href: '/blog/self-hosting-resources',
      text: 'Use it if you are still deciding what belongs on the server before you add platforms, analytics, automation, and recovery layers.',
    },
    startHere: 'If you are new, start with one practical service that is worth owning now, usually app deployment, analytics, or an automation workflow. Add monitoring, recovery, and extra services only after the first workload is stable.',
    notFor: 'Do not start here if you only need to ship one app quickly and do not want to operate supporting services yet. In that case, open the deployment pillar first and keep the stack minimal.',
    whenToUse: [
      'Use it when hosted tools are getting expensive and you want more control without jumping straight into a complex home-lab setup.',
      'Use it when you need a clear path from first app to supporting services such as analytics, automation, and monitoring.',
      'Use it when you want production discipline around a self-hosted stack instead of adding random containers whenever a new tool looks interesting.',
    ],
    bestToolsIntro: 'Use these support pages when you are narrowing the platform, low-cost tooling, and surrounding stack choices that sit around the services you host yourself. They matter most after you know what the first self-hosted workload should be.',
    guidesIntro: 'Open these reads when you are ready to run something real. Beginners should start with the broad self-hosting setup article, then pick one concrete workload such as Coolify, n8n, or Plausible before adding recovery and monitoring layers.',
    comparisonsIntro: 'Comparison pages matter once the first service is clear and you are deciding between platforms or providers. Skip them for now if you are still figuring out whether to self-host at all or what belongs on the server first.',
    recommendedSetupIntro: 'The best self-hosted stack for most developers is boring on purpose: one VPS, one deployment path, a few services that earn their place, and an exit plan if something breaks.',
    recommendedSetup: [
      'Secure the VPS first, then choose the first app or service that saves money or removes the most vendor friction.',
      'Add core services one layer at a time: deployment, then analytics or automation, then recovery and monitoring.',
      'Do not self-host critical email, complex databases, or too many dashboards first. Earn the operational complexity slowly.',
      'Use comparison pages only when the platform choice changes how much work you will carry every week.',
    ],
    learningPathIntro: 'Follow this path if you want to move from broad self-hosting context into a working stack with a sane progression: first workload, repeatable deploy path, then operations discipline.',
    topicArticlesIntro: 'This is the full self-hosting cluster. Use it when you already know the subtopic you need or when you want to see how app hosting, automation, analytics, monitoring, and recovery fit together under one operating model.',
    relatedArticlesIntro: 'These are the strongest next reads if you want a faster path without browsing the entire cluster. They work well for developers who already know the first service they want to self-host.',
    conclusion: 'Use this page as the self-hosting entry point when the question is what to host yourself, what to delay, and how to keep the stack from getting sloppy. Start with one service that clearly earns the extra control, then move into deployment or infrastructure only when the next decision actually demands it.',
    faq: [
      { question: 'What should I self-host first as a developer?', answer: 'Start with the workload that saves money or removes the most vendor friction right away, usually app deployment, analytics, or one automation workflow. That gives you a quick win without forcing you to operate a full platform on day 1.' },
      { question: 'What should I avoid self-hosting first?', answer: 'Avoid the services that create the most operational pain if they fail, especially email, large databases you do not fully understand yet, and a pile of admin dashboards you will not maintain. Get one simple service stable first.' },
      { question: 'Is self-hosting actually cheaper than SaaS?', answer: 'Often yes when the stack stays lean and the VPS already covers more than one useful workload. The savings disappear when you add services just because they are open source and not because they solve a real cost or control problem.' },
      { question: 'Do I need Docker for self-hosting?', answer: 'Not always. Docker becomes useful once you are running more than one service or you want cleaner repeatability across deploys. If you are still learning the basics, a simpler path can be easier to debug.' },
      { question: 'When should I read comparisons instead of setup guides?', answer: 'Read setup guides first when you are still proving that the workload belongs on your server. Read comparisons once the workload is fixed and the open question is which platform or provider should carry it.' },
      { question: 'Where should I go after this page?', answer: 'Open the self-hosting setup reads first, then jump to the deployment pillar if the next task is shipping an app, or the VPS pillar if the next decision is about hosting and hardening.' },
    ],
    guideSlugs: ['self-hosting-resources', 'coolify-complete-guide-2026', 'self-hosting-n8n-hetzner-vps', 'self-host-plausible-analytics-2026', 'self-healing-vps-monitor-nodejs'],
    comparisonSlugs: ['coolify-vs-caprover-2026', 'oracle-cloud-free-vs-hetzner-2026', 'hetzner-vs-aws-lightsail-2026'],
    toolSlugs: ['open-source-tools-2026', 'best-free-developer-tools-2026', 'best-vpn-for-developers-2026'],
    learningPathSlugs: ['self-hosting-resources', 'vps-setup-guide', 'coolify-complete-guide-2026', 'self-hosting-n8n-hetzner-vps', 'self-healing-vps-monitor-nodejs'],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the main hub if you want to switch topics.' },
      { label: 'Deployment Guides', href: `${PILLAR_RESOURCE_HUB_PATH}#deployment-guides`, description: 'Move into the deployment lane once the self-hosted stack needs a live app path.' },
      { label: 'VPS and Cloud Category', href: '/category/vps-cloud', description: 'Open the infrastructure category for host selection and hardening reads.' },
    ],
  },
  {
    slug: 'deploy-apps-on-vps-complete-guide',
    title: 'Deploy Apps on VPS Complete Guide',
    description: 'The deployment pillar page for getting apps live on a VPS with setup, proxy, and production checks connected in one place.',
    eyebrow: 'Deployment',
    primaryCategory: 'how-to',
    supportingCategories: ['self-hosting', 'vps-cloud', 'web-dev'],
    intro: 'Start here if you need the fastest safe path from localhost to a production VPS. This guide is for developers who want a reliable sequence, not another pile of half-remembered shell commands.',
    whatIs: 'Deploying apps on a VPS is the layer between buying a server and running a dependable live product. It includes server prep, runtime choice, proxy setup, SSL, domain wiring, and production checks.',
    whyItMatters: 'Most deployment pain comes from sequencing mistakes rather than from one broken command. Skip server prep, proxy rules, or final checks and the stack becomes fragile fast.',
    heroEntry: {
      heading: 'Best first read:',
      label: 'VPS Setup Guide',
      href: '/blog/vps-setup-guide',
      text: 'Start there if the server is not fully prepared yet. If the box is already live and hardened, use the deploy-path guidance below instead of restarting from scratch.',
    },
    startHere: 'If the server does not exist yet, open the VPS setup guide first. If the box is ready, choose the deploy path that matches your stack: raw Node and PM2 for minimal apps, Docker Compose for multi-service setups, or a platform-style workflow if you want a friendlier control layer.',
    notFor: 'This is not the best first stop if you are still choosing a provider or comparing clouds. Pick the server first in the VPS and cloud pillar, then come back here when the deployment path is the real decision.',
    whenToUse: [
      'Use it when you are moving from localhost to a real VPS and want one sequence you can repeat later.',
      'Use it when you need to choose between a minimal manual deploy, Docker Compose, or a platform-style workflow.',
      'Use it when the next problem is production setup, proxying, SSL, domains, or post-deploy verification rather than app code.',
    ],
    bestToolsIntro: 'These supporting reads help once you are choosing the software around the deploy itself, from platform layers to database tooling and workflow helpers. They matter after the basic deploy sequence is clear.',
    guidesIntro: 'Read these in order if you want the safest path: prepare the server, pick the runtime or platform, add reverse proxy and SSL, then run the checks that prove the app is actually production ready. This section is for builders who want implementation first, not more theory.',
    comparisonsIntro: 'Use the comparison pages when the deploy path is still open and you need to pick a platform or hosting shape. Skip them if you already know the stack and just need the step-by-step execution.',
    recommendedSetupIntro: 'A good VPS deployment flow is boring and rerunnable. You should be able to explain it from server prep to production checks without opening five random terminal history snippets.',
    recommendedSetup: [
      'Provision and secure the VPS before touching app tooling, domains, or SSL.',
      'Pick one deploy method for the current app: raw Node and PM2, Docker Compose, or a platform-style workflow. Do not mix all 3 unless you have a real reason.',
      'Get the app running first, then add reverse proxy, domain, and SSL in that order so troubleshooting stays simple.',
      'Finish with production checks such as restart behavior, logs, health verification, and indexing or monitoring only after the site is truly live.',
    ],
    learningPathIntro: 'If you want the shortest route to a live deployment, follow these guides in order and do not skip setup, proxy, or verification. That is where most avoidable deployment mistakes happen.',
    topicArticlesIntro: 'This full deployment cluster is useful when you already know the specific step you need: server prep, reverse proxy, app shipping, Compose, Coolify, or post-launch checks. It is the quickest way to stay inside one production path without drifting across unrelated topics.',
    relatedArticlesIntro: 'These are the core deployment reads worth opening first if you do not want to scan the entire topic map. They cover the setup, runtime, and verification decisions that break most first VPS launches.',
    conclusion: 'Treat this page as the fastest reliable route from local app to production VPS. Start with the server state you actually have, choose one deployment path, and only open comparisons when the tool choice is still unresolved.',
    faq: [
      { question: 'What is the best first article to read before deploying on a VPS?', answer: 'Start with the VPS setup guide if the server is not ready yet. If the server already exists and is reachable, jump to the deployment article that matches your runtime or platform choice.' },
      { question: 'How do I choose between PM2, Docker Compose, and a platform workflow?', answer: 'Use PM2 for the simplest single-app Node deployments, Docker Compose for multi-service stacks you want to define clearly, and a platform workflow when you value a friendlier UI more than maximum manual control.' },
      { question: 'What are the most common VPS deployment mistakes?', answer: 'The usual failures are skipping server hardening, mixing too many deploy methods, adding SSL before the app actually works, and never testing what happens after a reboot or crash. The safest fix is to keep the sequence simple.' },
      { question: 'Where do reverse proxy and SSL fit in the sequence?', answer: 'They come after the app runs cleanly on the server and before you call the stack production ready. Proxy first, domain next, SSL after that, then production checks.' },
      { question: 'Do I need Coolify to deploy on a VPS?', answer: 'No. Coolify is one path, not the default answer for every app. This pillar keeps manual, Compose-based, and platform-style routes separate so you can choose the level of abstraction you actually want.' },
      { question: 'What should I read after the deployment guides?', answer: 'Move into the VPS pillar for provider or security decisions, or into the self-hosting pillar if the next step is adding the services around the deployed app.' },
    ],
    guideSlugs: ['vps-setup-guide', 'deploy-nextjs-coolify-hetzner', 'docker-compose-production-vps-2026', 'how-to-self-host-nextjs-on-vps', 'nginx-reverse-proxy-guide-2026', 'google-search-console-self-hosted-nextjs'],
    comparisonSlugs: ['coolify-vs-caprover-2026', 'hetzner-vs-aws-lightsail-2026', 'oracle-cloud-free-vs-hetzner-2026'],
    toolSlugs: ['coolify-complete-guide-2026', 'best-free-developer-tools-2026', 'best-postgresql-gui-free'],
    learningPathSlugs: ['vps-setup-guide', 'deploy-nextjs-coolify-hetzner', 'nginx-reverse-proxy-guide-2026', 'docker-compose-production-vps-2026', 'google-search-console-self-hosted-nextjs'],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the main hub for all topic lanes and start-here paths.' },
      { label: 'Self Hosting Category', href: '/category/self-hosting', description: 'Open the self-hosting category if you want the services around the deployment itself.' },
      { label: 'VPS and Cloud Pillar', href: `${PILLAR_BASE_PATH}/vps-cloud-for-developers-guide`, description: 'Use the VPS pillar if you are still choosing the right infrastructure before you deploy.' },
    ],
  },
  {
    slug: 'vps-cloud-for-developers-guide',
    title: 'VPS & Cloud for Developers Guide',
    description: 'The infrastructure pillar page for developers choosing hosts, comparing providers, and hardening production servers.',
    eyebrow: 'VPS & Cloud',
    primaryCategory: 'vps-cloud',
    supportingCategories: ['self-hosting', 'how-to', 'developer-tools'],
    intro: 'Start here if you are deciding what kind of server to buy, which provider deserves your money, and what to lock down before the first deploy. This is the infrastructure decision page, not a generic cloud glossary.',
    whatIs: 'VPS and cloud choices are the foundation under the rest of the stack. The topic covers provider selection, price-to-performance tradeoffs, basic server setup, hardening, monitoring, and recovery.',
    whyItMatters: 'A weak infrastructure choice creates pain that no deployment tool can hide later. Cheap is fine when the workload is honest. Cheap and careless is where the real trouble starts.',
    heroEntry: {
      heading: 'Choose your lane:',
      text: 'New buyer: start with cheap-first VPS and provider comparisons. Already own a server: skip to hardening and recovery. Ready to ship: use this page to settle hosting first, then move into deployment.',
    },
    startHere: 'If you have never bought a VPS before, start with the cheapest practical hosting read or the broadest provider comparison. If you already have a server and the concern is security, skip straight to hardening and recovery.',
    notFor: 'Do not start here if your provider is already chosen and your only problem is getting the app live. In that case, the deployment pillar is the faster first click.',
    whenToUse: [
      'Use it before you buy a first VPS, switch providers, or move away from a more expensive cloud default.',
      'Use it when you need real provider framing: cheap first VPS, production VPS, comparison-first buying, or security-first operation.',
      'Use it when the next problem is server cost, hardening, backup thinking, monitoring, or recovery rather than application code.',
    ],
    bestToolsIntro: 'Use these supporting pages for the operational software around infrastructure after the provider decision is made. They help with visibility, safety, and practical day-to-day server management.',
    guidesIntro: 'These guides are the execution path after you narrow the provider decision. Read them in a simple order: cheap hosting context or provider choice first, hardening second, recovery thinking third, deployment only after the server base is trustworthy.',
    comparisonsIntro: 'Open these comparison pages when you are actively choosing where the app should live. They are best for decision-ready readers, not for people who still need basic VPS concepts explained first.',
    recommendedSetupIntro: 'Most developers do not need an elaborate cloud architecture. They need a provider they can afford, a server they can secure, and a clear handoff into deployment.',
    recommendedSetup: [
      'Decide the workload first: cheap first VPS, production app server, or platform host. Provider choice gets easier once the job is clear.',
      'Compare providers before you commit to a deployment platform so tool preference does not hide infrastructure cost and reliability tradeoffs.',
      'Treat hardening, backups, and monitoring as part of setup from day 1, not as cleanup work for later.',
      'Once the provider choice is settled, move into the deployment pillar and stop reopening the infrastructure decision unless the workload changes.',
    ],
    learningPathIntro: 'If you are still undecided, follow this path from host selection into hardening and then deployment. That keeps the decision grounded in cost, security, and what you actually plan to run.',
    topicArticlesIntro: 'Use the full cluster below when you already know the subtopic you need: free hosting options, provider comparisons, security hardening, monitoring, recovery, or the bridge into deployment. It is the complete infrastructure lane for the site.',
    relatedArticlesIntro: 'These are the strongest infrastructure reads to open first if you do not want the entire map. They cover buying, securing, and stabilizing a VPS before the stack grows.',
    conclusion: 'Use this page as the main infrastructure decision point on Blixamo. Start with the provider and workload framing, lock in the minimum security discipline, then move into deployment once the server choice actually makes sense.',
    faq: [
      { question: 'What should I decide before buying a VPS?', answer: 'Decide the workload, budget ceiling, region needs, and how much operational work you are willing to carry. Those 4 answers matter more than any provider landing page feature list.' },
      { question: 'Is a cheap VPS enough for production?', answer: 'Often yes for lean apps and modest traffic. The key is being honest about the workload and pairing the cheap server with hardening, backups, and realistic expectations instead of magical thinking.' },
      { question: 'Which VPS comparison should I read first?', answer: 'Read the comparison closest to the providers you are seriously considering now. If you have no shortlist at all, start with the broadest Hetzner and alternatives comparisons before drilling down.' },
      { question: 'Should I read hardening guides before or after I buy the server?', answer: 'Read at least one hardening guide before buying so you understand the responsibility you are taking on. Apply the hardening steps immediately after setup and before the app is public.' },
      { question: 'What matters more: low price or ease of use?', answer: 'The better question is which provider gives you the lowest operational drag for the workload you actually have. The cheapest provider is not the best choice if it creates avoidable friction every week.' },
      { question: 'Where should I go after choosing a provider?', answer: 'Move into the deployment pillar if you are ready to ship an app, or into the self-hosting pillar if you are building a broader stack of services on top of that server.' },
    ],
    guideSlugs: [
      'free-vps-hosting-2026',
      'ssh-security-hardening-vps-2026',
      'vps-security-harden-ubuntu-2026',
      'compromised-vps-recovery-2026',
      'vps-setup-guide',
      'deploy-nextjs-coolify-hetzner',
    ],
    comparisonSlugs: ['hetzner-vs-aws-2026', 'hetzner-vs-aws-lightsail-2026', 'hetzner-vs-digitalocean-vs-vultr-india', 'hetzner-vs-vultr-vs-linode-2026', 'oracle-cloud-free-vs-hetzner-2026'],
    toolSlugs: ['free-vps-hosting-2026', 'best-vpn-for-developers-2026', 'best-free-developer-tools-2026'],
    learningPathSlugs: [
      'free-vps-hosting-2026',
      'hetzner-vs-aws-lightsail-2026',
      'ssh-security-hardening-vps-2026',
      'vps-security-harden-ubuntu-2026',
      'compromised-vps-recovery-2026',
      'vps-setup-guide',
      'deploy-nextjs-coolify-hetzner',
    ],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the full hub if you want to switch from infrastructure into tools, automation, or free resources.' },
      { label: 'Deployment Pillar', href: `${PILLAR_BASE_PATH}/deploy-apps-on-vps-complete-guide`, description: 'Open the deployment pillar once you are ready to turn the chosen server into a live application stack.' },
      { label: 'Comparisons Hub', href: `${PILLAR_BASE_PATH}/comparisons-hub`, description: 'Use the comparisons hub if you want every head-to-head decision page grouped in one place.' },
    ],
  },
  {
    slug: 'developer-tools-directory',
    title: 'Developer Tools Directory',
    description: 'The pillar page for developer tools, workflow upgrades, practical software picks, and the strongest setup reads around them.',
    eyebrow: 'Developer Tools',
    primaryCategory: 'developer-tools',
    supportingCategories: ['ai', 'web-dev', 'free-tools'],
    intro: 'Start here when the bottleneck is in your workflow rather than your hosting: coding, debugging, database work, AI assistance, frontend velocity, or daily developer ergonomics. This page is a curated software map, not a generic tools archive.',
    whatIs: 'A useful developer tools directory helps you narrow choices by job to be done. This one connects broad roundups, practical implementation reads, and the comparison pages that matter once the shortlist gets small.',
    whyItMatters: 'Tooling decisions quietly shape how fast you ship and how much friction you carry. A good tool earns back time. A bad one keeps taxing the same workflow every day.',
    heroEntry: {
      heading: 'Start with this bottleneck:',
      text: 'Coding speed: use the AI and frontend reads. Database or API pain: jump straight to the data-tool pages. Broad workflow cleanup: start with the main roundup and narrow fast.',
    },
    startHere: 'If you feel overwhelmed, start with the broad developer-tools roundup, then jump to the workflow that is actually painful right now: coding speed, API work, database clients, frontend workflow, or performance. Do not browse this like a directory of everything you could install.',
    notFor: 'Do not start here if your real problem is hosting, server hardening, or deployment sequence. Those questions belong in the VPS and deployment pillars before you optimize the software around them.',
    whenToUse: [
      'Use it when you want practical software picks instead of another giant list of tools you will never install.',
      'Use it when the current bottleneck is coding, debugging, docs, database work, API exploration, or frontend workflow rather than infrastructure.',
      'Use it when you need both a recommendation and the next article that shows how that tool fits into real work.',
    ],
    bestToolsIntro: 'These are the strongest software shortlists in the cluster. Start with the one that matches the bottleneck in front of you right now, not the one with the broadest title. This page works best when you treat tools as jobs to be done, not as a shopping list.',
    guidesIntro: 'Use these reads when you already know the job to be done and want the applied context around it. Coding and frontend bottlenecks belong in the Next.js, Tailwind, and performance reads. Data or workflow questions belong in the tool roundups and adjacent comparison pages.',
    comparisonsIntro: 'Comparison pages help once the shortlist is narrow and 2 tools genuinely compete for the same slot. If the problem is still broad, stay in the directory and use the roundups first.',
    recommendedSetupIntro: 'A good developer tool stack is smaller and more opinionated than people expect. Pick one strong option per workflow job, prove it improves the work, and resist stacking tools that solve the same problem slightly differently.',
    recommendedSetup: [
      'Start with one broad tools list, then narrow into the specific workflow job that is hurting most right now.',
      'Use best overall, best free, and best underrated logic to cut the shortlist before you open direct comparisons.',
      'Pair recommendation pages with one implementation article so the tool choice stays grounded in real usage.',
      'Keep free and open source alternatives in scope whenever the paid default is not clearly better.',
    ],
    learningPathIntro: 'Follow this path if you want to move from broad tooling picks into specific database, AI, frontend, and workflow decisions without getting buried in tabs.',
    topicArticlesIntro: 'This is the full tools cluster for developers. Use it when you want to browse by job to be done instead of by category label, or when you need to connect roundups, comparisons, and implementation reads inside one workflow lane.',
    relatedArticlesIntro: 'These are the fastest high-signal reads if you do not want the whole directory at once. They are a good entry point for developers who already know what kind of tool decision they need to make.',
    conclusion: 'Use this directory as the main software map for your developer workflow. Start with the job that is currently slowing you down, narrow quickly, and only move into head-to-head comparisons when 2 options are truly competing.',
    faq: [
      { question: 'What should I read first in the tools cluster?', answer: 'Start with the broad developer-tools roundup if your choices are still wide open. If the problem is already narrow, such as database clients or AI coding tools, jump straight to the matching workflow page.' },
      { question: 'Is this page for coding tools only?', answer: 'No. It covers the wider developer workflow: coding, AI assistance, API work, database tooling, docs, frontend workflow, and the implementation reads that show where those tools fit.' },
      { question: 'Does this page include AI tools too?', answer: 'Yes. AI tools are part of the developer workflow, so they belong here when the search intent is about software choice and day-to-day usefulness rather than pure model comparison.' },
      { question: 'Why are implementation guides included in a tools directory?', answer: 'Because a tool recommendation without applied context is weak. The implementation reads show what the tool is good for, what kind of project it fits, and when you are overcomplicating the choice.' },
      { question: 'When should I open the comparisons hub instead?', answer: 'Open comparisons when the shortlist is already tight and you are trying to decide between 2 competing options. Stay here when you still need orientation and a broader software map.' },
      { question: 'Where should I go if budget is the main filter?', answer: 'Open the free-tools pillar if the main question is how to reduce software spend without hurting workflow quality. That page is built around cost-saving and open source decisions first.' },
    ],
    guideSlugs: ['getting-started-with-nextjs', 'nextjs-mdx-blog-2026', 'nextjs-mdx-remote-rsc-edge-runtime-fix', 'nextjs-performance-optimization-2026', 'tailwind-css-tips', 'claude-ai-guide'],
    comparisonSlugs: ['tailwind-css-vs-css-modules', 'claude-vs-chatgpt-developers', 'claude-api-vs-openai-gpt4-2026', 'coolify-vs-caprover-2026'],
    toolSlugs: ['best-free-developer-tools-2026', 'best-postgresql-gui-free', 'best-vpn-for-developers-2026', 'best-ai-tools-2026'],
    learningPathSlugs: ['best-free-developer-tools-2026', 'best-postgresql-gui-free', 'best-ai-tools-2026', 'nextjs-mdx-blog-2026', 'nextjs-performance-optimization-2026'],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the main hub if you want to switch from tools into deployment, VPS, or automation topics.' },
      { label: 'Free Tools Pillar', href: `${PILLAR_BASE_PATH}/free-tools-for-developers`, description: 'Open the free-tools pillar if cost reduction is the main filter for the software you choose.' },
      { label: 'Comparisons Hub', href: `${PILLAR_BASE_PATH}/comparisons-hub`, description: 'Use the comparisons hub when the decision is between competing tools instead of browsing a directory.' },
    ],
  },
  {
    slug: 'automation-guide-for-developers',
    title: 'Automation Guide for Developers',
    description: 'The automation pillar page for n8n, bot workflows, AI-assisted processes, and developer-facing automation systems.',
    eyebrow: 'Automation',
    primaryCategory: 'automation',
    supportingCategories: ['ai', 'self-hosting', 'developer-tools'],
    intro: 'Start here if you want automation that actually removes work instead of creating a second job. This page is built for developers choosing what to automate first, which platform to use, and when AI belongs in the workflow.',
    whatIs: 'Developer automation is where scripts, workflow tools, APIs, bots, and AI-assisted steps turn repeated tasks into reusable systems. The useful question is not whether to automate. It is what to automate first and how much orchestration the task really needs.',
    whyItMatters: 'Automation compounds when it targets a real bottleneck. One good workflow saves time every week. One overbuilt workflow becomes another system you have to babysit.',
    heroEntry: {
      heading: 'Start with this lane:',
      text: 'Solo builders should start with one simple workflow that removes a weekly task. If you already run workflows, skip to platform comparisons, AI-enriched flows, or the self-hosted stack reads below.',
    },
    startHere: 'If you are new, start with one repeatable workflow that already hurts: lead routing, content enrichment, notifications, or an internal bot. Solo builders should learn the n8n basics first. More advanced users can jump straight to platform or AI-workflow decisions.',
    notFor: 'Do not start here if you are just curious about automation with no repeated task in mind. You will end up building a clever workflow that solves nothing and still needs maintenance.',
    whenToUse: [
      'Use it when repeated manual tasks are slowing down development, support, content ops, or internal tooling work.',
      'Use it when you need a practical path into n8n, bot workflows, API integrations, or AI-assisted automation.',
      'Use it when you want one clear first workflow instead of a vague plan to automate everything later.',
    ],
    bestToolsIntro: 'Use these supporting reads when you are choosing the platform and surrounding AI tools that will carry the workflow. They are most useful after you identify the real bottleneck you want to remove.',
    guidesIntro: 'These are the implementation reads for builders who want outcome first. Solo builders should start with the n8n foundation and one concrete workflow. If you already run workflows in production, jump to the applied bot, messaging, or self-hosted orchestration reads that match the system you are extending.',
    comparisonsIntro: 'Comparison pages matter when you are choosing a workflow platform or AI model path. Skip them until you know whether the job is orchestration, messaging, AI enrichment, or a simple script that does not need a visual workflow tool.',
    recommendedSetupIntro: 'A strong automation stack begins with one bottleneck, one platform, and one workflow that saves time immediately. Anything beyond that is optional until the first automation proves itself.',
    recommendedSetup: [
      'Start with one platform and one workflow that saves time this week, not a roadmap of 12 automations you might build someday.',
      'Choose between n8n basics, AI workflows, bots, or self-hosted automation based on the job, not on which tool feels trendy.',
      'Use comparison reads before switching platforms, not after you already committed time to the wrong one.',
      'Bring AI into the workflow only where it improves the result enough to justify added cost, latency, or failure points.',
    ],
    learningPathIntro: 'If you are starting from scratch, follow this path from platform understanding into one practical workflow. That gives you the fastest path to a useful automation without drowning in options.',
    topicArticlesIntro: 'This full automation cluster is for readers who already know the lane they need: n8n basics, AI-assisted flows, bots, integrations, or self-hosted orchestration. It is the complete topic map once you are ready to go deeper.',
    relatedArticlesIntro: 'These are the best next reads if you want a practical first automation path without browsing every post in the cluster.',
    conclusion: 'Use this page as the automation entry point when you want one outcome-led workflow path instead of an abstract productivity rabbit hole. Start with the bottleneck, pick the lightest tool that fits it, and expand only after the first automation earns trust.',
    faq: [
      { question: 'What should developers automate first?', answer: 'Automate the repeated task that already wastes time every week, such as notifications, lead routing, content enrichment, internal reports, or support handoffs. Do not start with a workflow that only looks impressive in a demo.' },
      { question: 'Should I start with n8n or with custom code?', answer: 'Start with the one that matches the job. Use n8n when visible orchestration, connectors, and quick iteration matter. Use custom code when the workflow is simple, heavily custom, or better expressed directly in your application.' },
      { question: 'What should I avoid automating too early?', answer: 'Avoid workflows with messy business rules, poor source data, or unclear ownership. Automation multiplies confusion just as easily as it multiplies speed.' },
      { question: 'Does automation here include AI workflows?', answer: 'Yes. The cluster includes AI-assisted automations where models are one step inside a broader system, not a separate chat tool pretending to be a workflow.' },
      { question: 'Can I self-host these automations cheaply?', answer: 'Often yes. Several articles in this cluster are built around low-cost VPS hosting and practical self-hosted automation stacks, especially when control and recurring cost matter.' },
      { question: 'What should I read after the main automation guide?', answer: 'Open the comparison pages if you are still choosing a platform, or move into the self-hosting and deployment pillars if the next question is how to run the workflow reliably.' },
    ],
    guideSlugs: ['n8n-complete-guide-2026', 'claude-api-content-automation-nodejs', 'build-telegram-bot-claude-api-python', 'whatsapp-ai-assistant-n8n-claude-api', 'self-hosting-n8n-hetzner-vps'],
    comparisonSlugs: ['n8n-vs-make-vs-zapier-indie-dev', 'claude-api-vs-openai-gpt4-2026', 'claude-api-vs-openai-cost-india'],
    toolSlugs: ['best-ai-tools-2026', 'open-source-tools-2026', 'best-free-developer-tools-2026'],
    learningPathSlugs: ['n8n-complete-guide-2026', 'n8n-vs-make-vs-zapier-indie-dev', 'claude-api-content-automation-nodejs', 'whatsapp-ai-assistant-n8n-claude-api'],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the main hub to move from automation into tools, deployment, or free resources.' },
      { label: 'Self Hosting Pillar', href: `${PILLAR_BASE_PATH}/self-hosting-complete-guide`, description: 'Open the self-hosting pillar if you want to run the automation stack on infrastructure you control.' },
      { label: 'Comparisons Hub', href: `${PILLAR_BASE_PATH}/comparisons-hub`, description: 'Use the comparisons hub if the main question is which automation platform or model path to choose.' },
    ],
  },
  {
    slug: 'free-tools-for-developers',
    title: 'Free Tools for Developers',
    description: 'The pillar page for free tools, open source replacements, and budget-friendly software decisions for developers.',
    eyebrow: 'Free Tools',
    primaryCategory: 'free-tools',
    supportingCategories: ['developer-tools', 'indie-hacking', 'self-hosting'],
    intro: 'Start here when budget is near zero and you still need a stack that can ship real work. This pillar is for cutting software spend without turning the free-tools category into a catch-all for every article that happens to mention price.',
    whatIs: 'Free tools content here is about usable software first: open source replacements, budget-first developer tooling, and no-cost workflow picks that earn their place in a working stack.',
    whyItMatters: 'Software spend grows quietly. A deliberate free-tool stack cuts recurring cost, protects runway, and proves where the paid option actually matters instead of assuming every default SaaS deserves your money.',
    heroEntry: {
      heading: 'Best first read:',
      label: 'Open Source Tools in 2026',
      href: '/blog/open-source-tools-2026',
      text: 'Start there if you need a broad budget-first snapshot before you narrow into API testing, documentation, Git, diagrams, or wider developer-tool spend.',
    },
    startHere: 'If your budget is near zero, start with the broad free-tool and open source roundups, then move into the workflow closest to your bottleneck: API work, documentation, Git, diagrams, or broader developer-stack spend.',
    notFor: 'Do not use this as the first stop for VPS buying, uptime monitoring, deployment platforms, PostgreSQL GUI decisions, or Docker management roundups when cost is only secondary. Those belong in their primary topic clusters.',
    whenToUse: [
      'Use it when the main constraint is budget rather than maximum feature breadth.',
      'Use it when you want open source or free alternatives before committing to paid SaaS.',
      'Use it when every software decision needs to justify its recurring cost to a lean team, side project, or solo business.',
    ],
    bestToolsIntro: 'These are the strongest budget-first software pages on the site, covering open source replacements, API testing, docs tools, Git workflow picks, diagram tools, and broader free developer-tool roundups.',
    guidesIntro: 'Open these if you want to build a free stack by workflow rather than by category label. Start broad, then move into the one tool lane that is draining money right now instead of trying to replace every paid product at once.',
    comparisonsIntro: 'The comparison pages here are supportive, not the center of the taxonomy. Use them only when they naturally reinforce the cost decision. If the main search intent is infrastructure, deployment, or provider choice, stay in those primary clusters instead.',
    recommendedSetupIntro: 'The best free-tool setup is a deliberate mix of no-cost software, one or two paid tools that clearly earn their place, and a workflow that stays simple enough to defend.',
    recommendedSetup: [
      'Start with broad free-tool roundups before choosing workflow-specific tools.',
      'Use open source alternatives where they remove real monthly spend without creating fragile maintenance work.',
      'Pick one tool per workflow layer first: API work, documentation, Git, diagrams, and broader developer tooling.',
      'Pay for software only where the paid option clearly saves enough time or risk to justify the recurring cost.',
    ],
    learningPathIntro: 'Follow this path if your goal is to lower software spend without ending up with a weak stack. It starts broad, then narrows into the workflows where free options matter most.',
    topicArticlesIntro: 'This full cluster is for readers building a budget-first stack. Use it when you want to browse every relevant free-tools article by problem solved, not just by category label or whatever page mentions the word free.',
    relatedArticlesIntro: 'These are the best next reads if you want a cost-saving win quickly without opening the entire cluster. They are especially useful for developers tightening software spend right now.',
    conclusion: 'Use this page when budget is the first filter and software quality still matters. Start with the broad stack-level roundups, then move into the exact workflow that is costing you money, and keep infrastructure or deployment decisions in their proper clusters.',
    faq: [
      { question: 'Are free tools good enough for production work?', answer: 'Often yes when the choice is deliberate and the tool fits a lean workflow. Free does not mean weak. It only becomes a problem when the tool is free but badly aligned with the job.' },
      { question: 'When is the free option enough?', answer: 'The free option is enough when it covers the core workflow cleanly and the missing paid features would not save meaningful time or reduce meaningful risk. That is the threshold this pillar is built around.' },
      { question: 'Should I avoid paid tools completely?', answer: 'No. The goal is not zero spend at all costs. The goal is to pay only where the paid option clearly earns its place through speed, reliability, or reduced maintenance.' },
      { question: 'Why are some non-free-tools pages linked from this pillar?', answer: 'Because a few supporting pages help explain the surrounding workflow or business tradeoff. They are included only when they reinforce a budget-first software decision, not when they belong in another taxonomy lane.' },
      { question: 'Does this cluster only include articles with the word free in the title?', answer: 'No. The filter is search intent, not wording. Pages belong here when free, open source, or cost-saving software is the main decision lens.' },
      { question: 'What is the next step after this page?', answer: 'Start with the broad lists, then move into the one article closest to your current workflow bottleneck, whether that is API work, docs, Git, diagrams, or broader software spend.' },
    ],
    guideSlugs: [
      'open-source-tools-2026',
      'best-free-api-testing-tools-2026',
      'best-free-documentation-tools-2026',
      'best-free-git-tools-2026',
      'best-free-diagram-tools-2026',
      'free-tools-indian-indie-developer',
    ],
    comparisonSlugs: ['wise-vs-payoneer-india-freelancer', 'oracle-cloud-free-vs-hetzner-2026', 'hetzner-vs-aws-lightsail-2026'],
    toolSlugs: [
      'best-free-developer-tools-2026',
      'open-source-tools-2026',
      'best-free-api-testing-tools-2026',
      'best-free-documentation-tools-2026',
      'best-free-git-tools-2026',
      'best-free-diagram-tools-2026',
    ],
    learningPathSlugs: [
      'best-free-developer-tools-2026',
      'open-source-tools-2026',
      'best-free-api-testing-tools-2026',
      'best-free-documentation-tools-2026',
      'best-free-git-tools-2026',
      'best-free-diagram-tools-2026',
    ],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the main hub if you want to switch from budget-focused reads into another topic lane.' },
      { label: 'Developer Tools Pillar', href: `${PILLAR_BASE_PATH}/developer-tools-directory`, description: 'Open the developer-tools pillar if the main question is software quality rather than cost.' },
      { label: 'Community Hub', href: '/community', description: 'Use the community hub if you want another discovery layer into category pages, current reads, and adjacent topics.' },
    ],
  },
  {
    slug: 'comparisons-hub',
    title: 'Comparisons Hub',
    description: 'The main comparison pillar page for hosting, deployment platforms, automation tools, AI tools, and other high-intent choices.',
    eyebrow: 'Comparisons',
    primaryCategory: 'developer-tools',
    supportingCategories: ['vps-cloud', 'automation', 'ai', 'free-tools'],
    intro: 'Start here when you already know the options and need a verdict, tradeoff breakdown, and next step. This is the decision-ready hub for readers who are done browsing and want to close one choice at a time.',
    whatIs: 'A comparisons hub is the verdict layer of the site. It groups the pages where tools, platforms, providers, and workflow options compete for the same job inside a real developer stack.',
    whyItMatters: 'Comparison traffic is high intent. Readers are usually close to spending money, committing to a workflow, or locking in a platform, so the next click matters more than a generic archive ever will.',
    heroEntry: {
      heading: 'Choose your comparison lane:',
      text: 'Hosting if you are still buying infrastructure, deployment if the server is already settled, automation if you are replacing repeated work, AI if the model workflow is the decision, and developer tools if the bottleneck is inside daily software.',
    },
    startHere: 'Open the comparison group closest to the live decision: hosting first if you are buying infrastructure, deployment next if you are choosing a platform path, automation if you are replacing manual work, AI if you are choosing model workflow, and developer tools if the bottleneck is in day-to-day software.',
    notFor: 'Do not start here if you still need the basics of a category. Use the matching pillar first when you need orientation, setup order, or context before a head-to-head verdict makes sense.',
    whenToUse: [
      'Use it when you already know the options and need a verdict or tradeoff breakdown fast.',
      'Use it when 2 tools, hosts, or models are competing for the same role in your stack right now.',
      'Use it when you want the decision layer first and the implementation details second.',
    ],
    bestToolsIntro: 'Use these directory-style pages after a comparison points you toward a category of tools or a broader shortlist. They are for the moment when the verdict is clear but the surrounding stack still needs shape.',
    guidesIntro: 'These core reads are what you open after a verdict when you need context or implementation, not more debate. They are especially useful when a comparison tells you which lane won but you still need to understand how to use it well.',
    comparisonsIntro: 'This full comparison grid is for decision-ready readers who want every active verdict page in one place. Start with the group below that matches your current buying or tooling decision, then use the matching pillar as the next stop after the verdict lands.',
    recommendedSetupIntro: 'A useful comparison workflow is simple: compare one layer of the stack, close that decision, then move into the matching pillar or implementation page instead of reopening every other debate.',
    recommendedSetup: [
      'Start with the comparison closest to the decision in front of you right now, not the one with the most interesting title.',
      'After each verdict, open the matching topic pillar so implementation keeps moving instead of turning into more comparison loops.',
      'Keep a broader tools or free-tools page nearby when the verdict still leaves you with a shortlist rather than one winner.',
      'Do not compare everything at once. Close one layer of the stack, then move to the next.',
    ],
    learningPathIntro: 'Follow this path if you want to close comparisons in a deliberate order: hosting first, deployment second, automation third, then AI or workflow tooling once the infrastructure choices are settled.',
    topicArticlesIntro: 'Use the full topic map when you want every comparison connected to the same cluster of supporting guides and tool pages. It is the easiest way to move from verdict to action without losing the architecture of the site.',
    relatedArticlesIntro: 'These are the strongest next reads if you want a fast verdict and a clean follow-up path. They are a good fit for readers who already know the shortlist and just need the highest-signal decision pages.',
    conclusion: 'Use this page as the decision center for the site. Open the comparison that matches the active choice, take the verdict, then move straight into the pillar or implementation read that helps you ship the winner.',
    faq: [
      { question: 'Should I start with the comparisons hub or a topic pillar?', answer: 'Start here when the options are already clear and the decision is active. Start with a topic pillar when you still need context, setup order, or a basic map of the category.' },
      { question: 'How do I choose which comparison to open first?', answer: 'Open the comparison that matches the decision blocking you right now. If you cannot name the immediate choice, you probably need the matching pillar page before you need a head-to-head verdict.' },
      { question: 'What should I do after reading a comparison?', answer: 'Go straight to the matching topic pillar or the strongest implementation article for the winner. The goal is to turn the verdict into action quickly, not to keep browsing more comparisons.' },
      { question: 'Are these comparison pages verdict first or neutral?', answer: 'They are meant to help real developers close decisions, so the useful ones should lean toward a clear recommendation instead of pretending every option is equally good.' },
      { question: 'Why are tool pages linked from a comparisons hub?', answer: 'Because some verdicts still leave you with a category choice or a shortlist to finish. The linked tool pages help you connect a narrow comparison outcome to the rest of the workflow.' },
      { question: 'When should I stop comparing and just ship?', answer: 'Stop comparing when one option is clearly good enough for the current workload and the remaining differences are edge cases you may never hit. Most stacks do not need a perfect winner. They need a decision.' },
    ],
    guideSlugs: ['best-free-developer-tools-2026', 'free-vps-hosting-2026', 'n8n-complete-guide-2026', 'coolify-complete-guide-2026'],
    comparisonSlugs: COMPARISON_SLUGS,
    toolSlugs: ['best-free-developer-tools-2026', 'best-postgresql-gui-free', 'best-ai-tools-2026', 'free-vps-hosting-2026'],
    learningPathSlugs: ['hetzner-vs-digitalocean-vs-vultr-india', 'coolify-vs-caprover-2026', 'n8n-vs-make-vs-zapier-indie-dev', 'claude-vs-chatgpt-developers'],
    comparisonGroups: [
      {
        title: 'Hosting and VPS comparisons',
        description: 'Open these first if the active decision is where the app should live. After you pick a provider, move straight into the VPS and cloud pillar or the deployment pillar instead of reopening the hosting debate.',
        slugs: ['hetzner-vs-aws-2026', 'hetzner-vs-aws-lightsail-2026', 'hetzner-vs-digitalocean-vs-vultr-india', 'hetzner-vs-vultr-vs-linode-2026', 'oracle-cloud-free-vs-hetzner-2026'],
      },
      {
        title: 'Deployment and platform comparisons',
        description: 'These are for readers who already have a server plan and now need to choose the operational layer. Use the deployment pillar next if the winner is clear and the remaining job is implementation.',
        slugs: ['coolify-vs-caprover-2026'],
      },
      {
        title: 'Automation comparisons',
        description: 'Use this lane when the bottleneck is repeated work and you are choosing the orchestration tool. Once the verdict lands, open the automation pillar and build one useful workflow before adding more.',
        slugs: ['n8n-vs-make-vs-zapier-indie-dev'],
      },
      {
        title: 'AI comparisons',
        description: 'These are for developers choosing between model workflows, coding assistants, or API tradeoffs. The next stop after a verdict is usually the AI or developer-tools pillar, not another model benchmark.',
        slugs: ['claude-vs-chatgpt-developers', 'claude-api-vs-openai-gpt4-2026', 'claude-api-vs-openai-cost-india'],
      },
      {
        title: 'Developer workflow comparisons',
        description: 'This group helps when the decision is inside your day-to-day toolchain rather than infrastructure. Open the developer-tools or free-tools pillars next if the comparison still leaves you with a shortlist to explore.',
        slugs: ['tailwind-css-vs-css-modules', 'wise-vs-payoneer-india-freelancer'],
      },
    ],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the hub if you want to move from decision pages into guided topic browsing.' },
      { label: 'Developer Tools Pillar', href: `${PILLAR_BASE_PATH}/developer-tools-directory`, description: 'Open the developer-tools pillar if the decision is really about tooling choices inside your workflow.' },
      { label: 'VPS and Cloud Pillar', href: `${PILLAR_BASE_PATH}/vps-cloud-for-developers-guide`, description: 'Open the VPS pillar if the comparison is about providers and infrastructure decisions.' },
    ],
  },
]

function pickPosts(posts: Post[], slugs: readonly string[]): Post[] {
  return slugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is Post => Boolean(post))
}

function uniquePosts(posts: Post[]): Post[] {
  return posts.filter((post, index, collection) => collection.findIndex((entry) => entry.slug === post.slug) === index)
}

function buildCategoryLink(slug: string): PillarCategoryLink {
  const meta = getCategoryMeta(slug)
  return {
    slug,
    label: meta.label,
    href: `/category/${slug}`,
    description: meta.description,
    icon: meta.icon,
    color: meta.color,
  }
}

function getPrimaryArticlesForPillar(definition: PillarDefinition, posts: Post[]): Post[] {
  const slugs = Object.entries(PRIMARY_PILLAR_BY_ARTICLE)
    .filter(([, pillarSlug]) => pillarSlug === definition.slug)
    .map(([slug]) => slug)

  return pickPosts(posts, slugs)
}

function buildPillarPage(definition: PillarDefinition, posts: Post[]): PillarPage {
  const primaryArticles = getPrimaryArticlesForPillar(definition, posts)
  const guides = uniquePosts([...pickPosts(posts, definition.guideSlugs), ...primaryArticles])
  const comparisons = uniquePosts([...pickPosts(posts, definition.comparisonSlugs), ...primaryArticles.filter((post) => isComparisonPost(post))])
  const comparisonGroups = (definition.comparisonGroups ?? [])
    .map((group) => ({
      title: group.title,
      description: group.description,
      posts: uniquePosts(pickPosts(posts, group.slugs)),
    }))
    .filter((group) => group.posts.length > 0)
  const tools = uniquePosts(pickPosts(posts, definition.toolSlugs))
  const learningPath = uniquePosts(pickPosts(posts, definition.learningPathSlugs))
  const topicArticles = uniquePosts([...primaryArticles, ...guides, ...comparisons, ...tools, ...learningPath])

  const relatedArticles = topicArticles
    .filter((post) => !guides.slice(0, 4).some((entry) => entry.slug === post.slug))
    .slice(0, 8)

  return {
    slug: definition.slug,
    title: definition.title,
    description: definition.description,
    eyebrow: definition.eyebrow,
    href: `${PILLAR_BASE_PATH}/${definition.slug}`,
    primaryCategory: buildCategoryLink(definition.primaryCategory),
    supportingCategories: definition.supportingCategories.map(buildCategoryLink),
    intro: definition.intro,
    whatIs: definition.whatIs,
    whyItMatters: definition.whyItMatters,
    heroEntry: definition.heroEntry,
    startHere: definition.startHere,
    notFor: definition.notFor,
    whenToUse: [...definition.whenToUse],
    bestToolsIntro: definition.bestToolsIntro,
    guidesIntro: definition.guidesIntro,
    comparisonsIntro: definition.comparisonsIntro,
    recommendedSetupIntro: definition.recommendedSetupIntro,
    recommendedSetup: [...definition.recommendedSetup],
    learningPathIntro: definition.learningPathIntro,
    topicArticlesIntro: definition.topicArticlesIntro,
    relatedArticlesIntro: definition.relatedArticlesIntro,
    conclusion: definition.conclusion,
    faq: [...definition.faq],
    primaryArticles,
    guides: guides.slice(0, 8),
    comparisons: comparisons.slice(0, 12),
    comparisonGroups,
    tools: tools.slice(0, 8),
    learningPath: learningPath.slice(0, 8),
    topicArticles,
    relatedArticles,
    relatedResources: [...definition.relatedResourceLinks],
    articleCount: topicArticles.length,
  }
}

export function getPillarDefinitions(): readonly PillarDefinition[] {
  return PILLAR_DEFINITIONS
}

export function getAllPillarPages(posts: Post[]): PillarPage[] {
  return PILLAR_DEFINITIONS.map((definition) => buildPillarPage(definition, posts))
}

export function getPillarPageBySlug(slug: string, posts: Post[]): PillarPage | null {
  const definition = PILLAR_DEFINITIONS.find((entry) => entry.slug === slug)
  return definition ? buildPillarPage(definition, posts) : null
}

export function getPrimaryPillarForPost(post: Pick<Post, 'slug'>, posts: Post[]): PillarPage | null {
  const pillarSlug = PRIMARY_PILLAR_BY_ARTICLE[post.slug]
  return pillarSlug ? getPillarPageBySlug(pillarSlug, posts) : null
}

export function getComparisonsHub(posts: Post[]): PillarPage | null {
  return getPillarPageBySlug('comparisons-hub', posts)
}

export function getPillarsForCategory(category: string, posts: Post[]): PillarPage[] {
  const normalizedCategory = category.toLowerCase().trim()

  return getAllPillarPages(posts)
    .filter(
      (pillar) =>
        pillar.primaryCategory.slug === normalizedCategory ||
        pillar.supportingCategories.some((entry) => entry.slug === normalizedCategory)
    )
    .sort((a, b) => {
      const aPrimary = a.primaryCategory.slug === normalizedCategory ? 1 : 0
      const bPrimary = b.primaryCategory.slug === normalizedCategory ? 1 : 0
      return bPrimary - aPrimary || b.articleCount - a.articleCount
    })
}

export function isComparisonPost(post: Pick<Post, 'slug' | 'title'>): boolean {
  return COMPARISON_SLUGS.includes(post.slug as (typeof COMPARISON_SLUGS)[number]) || /(^| )(vs|versus)( |$)/i.test(post.title)
}

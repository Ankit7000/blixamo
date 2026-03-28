import { getCategoryMeta } from './categories'
import type { Post } from './posts'

export const PILLAR_BASE_PATH = '/guides'
export const PILLAR_RESOURCE_HUB_PATH = '/tag/deployment'

type PillarFaq = {
  question: string
  answer: string
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
  whenToUse: readonly string[]
  bestToolsIntro: string
  recommendedSetupIntro: string
  recommendedSetup: readonly string[]
  learningPathIntro: string
  conclusion: string
  faq: readonly PillarFaq[]
  guideSlugs: readonly string[]
  comparisonSlugs: readonly string[]
  toolSlugs: readonly string[]
  learningPathSlugs: readonly string[]
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
  whenToUse: string[]
  bestToolsIntro: string
  recommendedSetupIntro: string
  recommendedSetup: string[]
  learningPathIntro: string
  conclusion: string
  faq: PillarFaq[]
  primaryArticles: Post[]
  guides: Post[]
  comparisons: Post[]
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
  'best-free-developer-tools-2026': 'developer-tools-directory',
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
    intro: 'This page organizes the self-hosting side of Blixamo into one path so readers can move from setup to operations without losing context.',
    whatIs: 'Self-hosting here means running your own apps, automation, analytics, and supporting services on infrastructure you control.',
    whyItMatters: 'It matters because control, cost, and visibility usually improve when the stack is small and intentional.',
    whenToUse: [
      'Use it when you want more control over cost, data, and deploy flow.',
      'Use it when hosted tools are becoming expensive or limiting.',
      'Use it when you want one clear route from VPS setup into a working stack.',
    ],
    bestToolsIntro: 'These supporting reads help with the platform, low-cost tools, and surrounding stack choices.',
    recommendedSetupIntro: 'A strong self-hosted setup is small, understandable, and easy to recover.',
    recommendedSetup: [
      'Secure the VPS first, then install app tooling.',
      'Add services one layer at a time instead of all at once.',
      'Use comparison pages only where the platform choice changes the operational burden.',
      'Keep one main deployment path and document it clearly.',
    ],
    learningPathIntro: 'Follow this path if you want to move from broad self-hosting context into a working production stack.',
    conclusion: 'Use this page as the self-hosting control panel for the site, then branch into deployment or infrastructure decisions only when needed.',
    faq: [
      { question: 'What should I self-host first?', answer: 'Start with the workload that saves money or removes the most vendor friction, usually app deployment, automation, or analytics.' },
      { question: 'Is self-hosting cheaper than SaaS?', answer: 'Often yes when the stack stays lean. The savings disappear if you create a fragile pile of services you do not need.' },
      { question: 'Do I need Docker for self-hosting?', answer: 'Not always, but it helps once you manage more than one service. The linked guides show where that tradeoff becomes worth it.' },
      { question: 'Where should I go after this page?', answer: 'Move into the setup guides first, then use the comparison and tool pages to narrow the stack.' },
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
    intro: 'This page is the deployment lane for the site. It connects the articles that take you from raw server setup to a repeatable production deploy flow.',
    whatIs: 'Deploying apps on a VPS is the layer between infrastructure choice and a live product. It includes setup, proxy, runtime, SSL, and verification.',
    whyItMatters: 'It matters because deployment pain usually comes from gaps between steps, not from one command failing in isolation.',
    whenToUse: [
      'Use it when you are moving from localhost to a real server.',
      'Use it when you want a repeatable VPS deploy path instead of one-off shell history.',
      'Use it when the next problem is production setup rather than app code.',
    ],
    bestToolsIntro: 'These supporting reads help with the platform and tooling around the deploy itself.',
    recommendedSetupIntro: 'A good VPS deployment setup is a path you can rerun, debug, and explain.',
    recommendedSetup: [
      'Provision and secure the VPS before app tooling.',
      'Pick one deploy method, one proxy layer, and one production validation path.',
      'Use comparison pages only where the platform choice changes the workload.',
      'Write the final process down as a sequence instead of a loose list of commands.',
    ],
    learningPathIntro: 'If you want the shortest route to a live deployment, follow these guides in order and do not skip setup or verification.',
    conclusion: 'Treat this page as the deploy checklist for the whole site. It is the fastest way to connect setup, app deployment, and the details that usually get missed.',
    faq: [
      { question: 'What is the best first deployment guide to read?', answer: 'Start with the VPS setup guide if the server is not ready yet. If the box already exists, jump to the app deploy guide.' },
      { question: 'Do I need Coolify to deploy on a VPS?', answer: 'No. Coolify is one route, not the only route. This pillar includes both platform-assisted and more manual paths.' },
      { question: 'Where do reverse proxy and SSL fit in?', answer: 'They fit after the app can run and before you call the stack production-ready. The linked Nginx guide covers that layer directly.' },
      { question: 'What should I read after the deploy guides?', answer: 'Move into the VPS pillar for infrastructure tradeoffs or the self-hosting pillar for the rest of the stack around the app.' },
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
    intro: 'This is the infrastructure decision layer for the site. Use it when you need to choose a host, compare the major options, and understand what happens after the server is live.',
    whatIs: 'VPS and cloud decisions are the foundation under the rest of the stack. This topic covers host selection, price-to-performance tradeoffs, and server hardening.',
    whyItMatters: 'It matters because picking the wrong provider or skipping hardening creates pain that no deployment tool can hide later.',
    whenToUse: [
      'Use it before you buy a VPS or move away from a more expensive cloud setup.',
      'Use it when you need real provider comparisons instead of marketing checklists.',
      'Use it when the next problem is server security, not application code.',
    ],
    bestToolsIntro: 'These supporting reads help with the operational side of running infrastructure after the provider decision is made.',
    recommendedSetupIntro: 'The best infrastructure setup for most readers here is the one that stays cheap, understandable, and strong enough for production.',
    recommendedSetup: [
      'Compare providers before you commit to a deployment platform.',
      'Treat security and backup thinking as part of setup, not an afterthought.',
      'Use one provider comparison and one hardening guide as your baseline.',
      'Move into the deployment pillar once the infrastructure choice is settled.',
    ],
    learningPathIntro: 'If you are still undecided on provider choice, follow this path from broad host selection into security and then deployment.',
    conclusion: 'This page is where infrastructure decisions on Blixamo come together. Start here when the main question is hosting, cost, or server reliability.',
    faq: [
      { question: 'Which VPS comparison should I read first?', answer: 'Start with the comparison closest to the providers you are considering now. That keeps the decision practical.' },
      { question: 'Is a cheap VPS enough for real apps?', answer: 'Often yes, if the workload is modest and the stack stays lean. Several articles in this cluster are built around that exact tradeoff.' },
      { question: 'What matters more: price or ease of use?', answer: 'The useful question is which provider gives you the lowest operational drag for the workload you are actually running.' },
      { question: 'Where do I go after choosing a provider?', answer: 'Move into the deployment pillar if you are ready to ship an app, or into the self-hosting pillar if you are building a wider stack of services.' },
    ],
    guideSlugs: ['free-vps-hosting-2026', 'vps-security-harden-ubuntu-2026', 'vps-setup-guide', 'deploy-nextjs-coolify-hetzner'],
    comparisonSlugs: ['hetzner-vs-aws-2026', 'hetzner-vs-aws-lightsail-2026', 'hetzner-vs-digitalocean-vs-vultr-india', 'hetzner-vs-vultr-vs-linode-2026', 'oracle-cloud-free-vs-hetzner-2026'],
    toolSlugs: ['free-vps-hosting-2026', 'best-vpn-for-developers-2026', 'best-free-developer-tools-2026'],
    learningPathSlugs: ['free-vps-hosting-2026', 'hetzner-vs-aws-lightsail-2026', 'vps-security-harden-ubuntu-2026', 'vps-setup-guide', 'deploy-nextjs-coolify-hetzner'],
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
    intro: 'This page turns the tool-related content on Blixamo into a usable directory. It is the best place to start if you want software recommendations and workflow upgrades.',
    whatIs: 'A developer tools directory should help you narrow choices, not just dump a list. This one combines curated picks, implementation reads, and the comparisons that matter.',
    whyItMatters: 'It matters because tooling affects every later decision: how you write, deploy, debug, and maintain work.',
    whenToUse: [
      'Use it when you want practical software picks instead of generic roundups.',
      'Use it when the current bottleneck is tooling, not hosting or deployment.',
      'Use it when you need both a tool recommendation and the next article that shows how it fits into real work.',
    ],
    bestToolsIntro: 'These are the highest-value tool pages in the cluster, covering general developer software, database tooling, AI tools, and workflow support.',
    recommendedSetupIntro: 'A good developer tool stack is smaller than people think. Choose the few tools that directly improve shipping, debugging, and maintainability.',
    recommendedSetup: [
      'Start with one broad tools list, then narrow into the specific database, AI, or frontend decision you actually need to make.',
      'Use comparison reads only when the tools compete directly for the same slot in your workflow.',
      'Pair recommendation pages with one implementation article so the tool choice stays grounded.',
      'Keep free and open source alternatives in scope whenever the paid default is not clearly better.',
    ],
    learningPathIntro: 'Follow this path if you want to move from broad tooling picks into specific frontend, AI, and workflow decisions.',
    conclusion: 'Use this directory as the main tool-selection layer on the site. Start broad, narrow quickly, and only dive into comparisons when two options are genuinely competing.',
    faq: [
      { question: 'What should I read first in the tools cluster?', answer: 'Start with the broad developer tools roundup if your choices are still wide open. If the decision is already narrow, jump straight to the matching read.' },
      { question: 'Does this page include AI tools too?', answer: 'Yes. AI tools are folded into this directory because they are part of the developer workflow, not a separate hype category.' },
      { question: 'Why are implementation guides included in a tools directory?', answer: 'Because a tool recommendation without applied context is weak. The implementation reads show where those tools fit into real projects.' },
      { question: 'Where should I go for broader software comparisons?', answer: 'Open the comparisons hub if the main task is choosing between two competing tools or platforms instead of browsing a directory of options.' },
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
    intro: 'This pillar page groups the automation content on Blixamo into one lane so readers can move from platform choice to concrete workflows without losing the bigger system picture.',
    whatIs: 'Developer automation is the layer where scripts, workflow tools, APIs, and messaging systems remove repetitive work.',
    whyItMatters: 'It matters because automation compounds. A useful workflow can save time every week, reduce mistakes, and turn one-off tasks into reusable systems.',
    whenToUse: [
      'Use it when repeated manual tasks are slowing down development or operations.',
      'Use it when you need a practical path into n8n or API-driven workflows.',
      'Use it when you want AI in the loop as part of an automation system instead of a standalone chat tool.',
    ],
    bestToolsIntro: 'These reads help with picking the right workflow platform and the supporting AI tools around it.',
    recommendedSetupIntro: 'A strong automation setup usually begins with one clear bottleneck. Build one repeatable workflow first, then expand.',
    recommendedSetup: [
      'Start with one automation platform and one workflow that saves time immediately.',
      'Use comparison reads before switching platforms, not after you have already committed.',
      'Keep self-hosting in scope if cost or control are driving the decision.',
      'Bring AI into the workflow only where it improves the output, not because it is available.',
    ],
    learningPathIntro: 'If you are starting from scratch, follow this path from platform understanding into a concrete automation workflow.',
    conclusion: 'Use this page as the automation hub for the site. Start with the n8n foundation, move into one practical workflow, then use the linked comparisons and tool pages when you need to choose.',
    faq: [
      { question: 'Should I start with n8n or with custom code?', answer: 'Start with the one that matches the problem. If you need visible orchestration and fast iteration, n8n is a strong entry point.' },
      { question: 'Does automation here include AI workflows?', answer: 'Yes. The cluster includes AI-assisted automations where models are part of a broader system, not just a separate tool recommendation.' },
      { question: 'Can I self-host these automations cheaply?', answer: 'Often yes. Several pieces in this cluster are built around low-cost VPS hosting and practical self-hosted workflows.' },
      { question: 'What should I read after the main automation guide?', answer: 'Open the comparison reads if you are choosing a platform, or move into the self-hosting and deployment pillars if the next question is how to run the stack.' },
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
    description: 'The pillar page for free tools, open source replacements, and budget-friendly stack decisions for developers.',
    eyebrow: 'Free Tools',
    primaryCategory: 'free-tools',
    supportingCategories: ['developer-tools', 'indie-hacking', 'vps-cloud'],
    intro: 'This page gathers the strongest cost-saving content on Blixamo into one place so readers can cut tool spend without losing the parts of the stack that actually matter.',
    whatIs: 'Free tools content is not just about no-cost software. It also covers low-cost stack planning, open source replacements, and practical budget choices.',
    whyItMatters: 'It matters because tool and infrastructure spend grows quietly. A better free-tool stack can lower monthly cost while preserving enough quality to keep shipping.',
    whenToUse: [
      'Use it when the main constraint is budget rather than feature breadth.',
      'Use it when you want open source or free alternatives before committing to paid SaaS.',
      'Use it when every software decision needs to justify its recurring cost.',
    ],
    bestToolsIntro: 'These are the strongest low-cost and free-tool reads on the site, covering open source replacements, developer tool lists, and budget-conscious stack planning.',
    recommendedSetupIntro: 'The best free-tool setup is usually a deliberate mix of no-cost tools, one or two paid tools that clearly earn their place, and a hosting bill that stays easy to defend.',
    recommendedSetup: [
      'Start with broad free-tool roundups before choosing category-specific tools.',
      'Use open source replacements where they remove real monthly spend without adding fragile maintenance.',
      'Pair low-cost tools with one stable infrastructure decision so the whole stack stays predictable.',
      'Keep payment and financial workflow articles nearby if you are building with a tight solo budget.',
    ],
    learningPathIntro: 'Follow this path if your goal is to lower software spend while still ending up with a workable developer stack.',
    conclusion: 'Use this page when budget is the first constraint. It links the best free tools, the most useful open source swaps, and the supporting reads that turn those choices into a practical stack.',
    faq: [
      { question: 'Are free tools good enough for production work?', answer: 'Often yes, when the tool choice is deliberate. The best free options here are free because they fit a lean stack well.' },
      { question: 'Should I avoid paid tools completely?', answer: 'No. The goal is not zero spend at all costs. The goal is to pay only where the paid option clearly earns its place.' },
      { question: 'Does this cluster include infrastructure savings too?', answer: 'Yes. Free and low-cost hosting options are part of the broader budget stack, so the linked VPS and cloud reads matter here too.' },
      { question: 'What is the next step after this page?', answer: 'Start with the broad lists, then move into the one article closest to your current cost problem, whether that is hosting, software, or payment workflow overhead.' },
    ],
    guideSlugs: ['open-source-tools-2026', 'free-tools-indian-indie-developer', 'build-saas-mvp-zero-budget-2026', 'indian-debit-cards-dev-tools', 'razorpay-integration-nextjs-india'],
    comparisonSlugs: ['wise-vs-payoneer-india-freelancer', 'oracle-cloud-free-vs-hetzner-2026', 'hetzner-vs-aws-lightsail-2026'],
    toolSlugs: ['best-free-developer-tools-2026', 'best-postgresql-gui-free', 'free-vps-hosting-2026', 'best-ai-tools-2026'],
    learningPathSlugs: ['best-free-developer-tools-2026', 'open-source-tools-2026', 'free-vps-hosting-2026', 'build-saas-mvp-zero-budget-2026', 'free-tools-indian-indie-developer'],
    relatedResourceLinks: [
      { label: 'Resources Hub', href: PILLAR_RESOURCE_HUB_PATH, description: 'Return to the main hub if you want to switch from budget-focused reads into another topic lane.' },
      { label: 'Developer Tools Pillar', href: `${PILLAR_BASE_PATH}/developer-tools-directory`, description: 'Open the developer-tools pillar if the main question is software quality rather than cost.' },
      { label: 'VPS and Cloud Pillar', href: `${PILLAR_BASE_PATH}/vps-cloud-for-developers-guide`, description: 'Use the VPS pillar if you want the infrastructure side of a budget-friendly stack.' },
    ],
  },
  {
    slug: 'comparisons-hub',
    title: 'Comparisons Hub',
    description: 'The main comparison pillar page for hosting, deployment platforms, automation tools, AI tools, and other high-intent choices.',
    eyebrow: 'Comparisons',
    primaryCategory: 'developer-tools',
    supportingCategories: ['vps-cloud', 'automation', 'ai', 'free-tools'],
    intro: 'This page collects the head-to-head decision content on Blixamo so readers can jump straight into the tradeoffs instead of hunting across categories.',
    whatIs: 'A comparisons hub is the decision layer of the site. It groups the articles where tools, platforms, or providers are competing for the same job.',
    whyItMatters: 'It matters because comparison articles are high intent. Readers are usually close to a decision, which means the surrounding links need to point to the right next step.',
    whenToUse: [
      'Use it when you already know the options and need a verdict or tradeoff breakdown.',
      'Use it when two tools, hosts, or models are competing for the same role in your stack.',
      'Use it when you want the decision layer first and the implementation details second.',
    ],
    bestToolsIntro: 'These directory-style pages help once a comparison points you toward a category of tools or a broader shortlist.',
    recommendedSetupIntro: 'A useful comparison workflow is simple: compare, decide, then move into the implementation or pillar page that matches the winner.',
    recommendedSetup: [
      'Start with the comparison closest to the actual decision in front of you right now.',
      'Use the matching topic pillar after the comparison so you can implement the decision without losing context.',
      'Keep a broader tools or free-tools page nearby when you need a shortlist after the comparison.',
      'Avoid comparing everything at once. Pick one layer of the stack and close that decision first.',
    ],
    learningPathIntro: 'Follow this path if you want to move from provider comparisons into platform, automation, and tool decisions in a deliberate order.',
    conclusion: 'Use this page as the decision center for the site. Open the comparison you need, then branch into the matching pillar or tool directory once the verdict is clear.',
    faq: [
      { question: 'Should I start with the comparisons hub or a topic pillar?', answer: 'Start here when the options are already clear and the decision is active. Start with a topic pillar when you still need context first.' },
      { question: 'Are all comparison posts listed here?', answer: 'This hub is built to surface the high-intent comparison content across hosting, automation, AI, frontend, and financial workflow decisions.' },
      { question: 'What should I do after reading a comparison?', answer: 'Go straight to the matching topic pillar or the strongest implementation article that fits the winner.' },
      { question: 'Why are tool pages linked from a comparisons hub?', answer: 'Because many comparison outcomes still require a broader shortlist or a supporting tools page before you lock the rest of the stack.' },
    ],
    guideSlugs: ['best-free-developer-tools-2026', 'free-vps-hosting-2026', 'n8n-complete-guide-2026', 'coolify-complete-guide-2026'],
    comparisonSlugs: COMPARISON_SLUGS,
    toolSlugs: ['best-free-developer-tools-2026', 'best-postgresql-gui-free', 'best-ai-tools-2026', 'free-vps-hosting-2026'],
    learningPathSlugs: ['hetzner-vs-digitalocean-vs-vultr-india', 'coolify-vs-caprover-2026', 'n8n-vs-make-vs-zapier-indie-dev', 'claude-vs-chatgpt-developers'],
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
    whenToUse: [...definition.whenToUse],
    bestToolsIntro: definition.bestToolsIntro,
    recommendedSetupIntro: definition.recommendedSetupIntro,
    recommendedSetup: [...definition.recommendedSetup],
    learningPathIntro: definition.learningPathIntro,
    conclusion: definition.conclusion,
    faq: [...definition.faq],
    primaryArticles,
    guides: guides.slice(0, 8),
    comparisons: comparisons.slice(0, 12),
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

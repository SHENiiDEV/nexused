<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\User;
use App\Services\Ai\CourseThumbnailGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DiverseCoursesSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstWhere('role', 'admin') ?? User::first();
        if (!$admin) {
            $admin = User::create([
                'name' => 'NexusEd Faculty',
                'email' => 'faculty@nexused.test',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]);
        }

        $coursesData = [
            // 1. Languages & Business English
            [
                'title' => 'Business English for Global Careers & Executive Communication',
                'slug' => 'business-english-executive-c1',
                'description' => 'Achieve fluent C1 professional English for international corporate negotiations, executive boardroom presentations, high-stakes client emails, and diplomatic cross-border communications. Includes vocabulary frameworks and pronunciation labs.',
                'price' => 49.00,
                'status' => 'published',
                'generation_step' => 'Published & Verified',
                'generation_progress' => 100,
                'topic' => 'English Language & Communication',
                'category' => 'Languages & Communication',
                'target_audience' => 'Professionals, Managers, Team Leads, Career Changers',
                'estimated_hours' => 12,
                'modules' => [
                    [
                        'title' => 'Diplomatic Phrasing & High-Stakes Negotiations',
                        'description' => 'Replace blunt phrasing with assertive, diplomatic corporate language.',
                        'lessons' => [
                            [
                                'title' => 'De-escalation & Diplomatic Phrasing in High-Stakes Deals',
                                'type' => 'text',
                                'duration_minutes' => 20,
                                'content' => <<<MD
# De-escalation & Diplomatic Phrasing in High-Stakes Deals

In global business environments, direct negative phrasing can easily derail critical multi-million-dollar partnerships. Mastering **diplomatic hedging** and **constructive re-framing** ensures that tough feedback is delivered with executive presence.

---

## 1. The Power of Diplomatic Hedging

Blunt negative statements create defensive reactions. Diplomatic phrasing shifts focus from the person to the underlying strategic objective:

| Blunt / Risky Phrasing | Diplomatic Executive Alternative |
| :--- | :--- |
| *"You missed the project deadline."* | *"It appears our deliverables have encountered unexpected timeline variance."* |
| *"Your pricing proposal is too expensive."* | *"We see significant value in your solution; however, our fiscal budget requires higher capital efficiency."* |
| *"I disagree with this decision."* | *"From an alternative strategic vantage point, have we evaluated the operational trade-offs?"* |
| *"That idea won't work in our market."* | *"While that approach has proven merit, our current customer demographics may pose adoption friction."* |

---

## 2. The 3-Step "Acknowledge, Pivot, Propose" Framework

When negotiating contractual concessions or timeline extensions:

```
[ Step 1: Validate ]  "I fully understand the urgency of finalizing milestone #3."
        |
[ Step 2: Pivot ]     "At the same time, maintaining enterprise QA integrity remains our top priority."
        |
[ Step 3: Propose ]   "What if we phase the deployment: releasing core features on Friday and advanced analytics next Tuesday?"
```

---

## 3. High-Value Idioms for Boardroom Meetings

- **"Circle back"**: Return to an issue once more data is available (*"Let us circle back to vendor licensing post-audit."*).
- **"Touch base"**: Quickly sync with a colleague (*"I will touch base with legal prior to signing."*).
- **"Move the needle"**: Create measurable, tangible business impact (*"This partnership will genuinely move the needle for our European market share."*).

Complete the quiz below to verify your diplomatic phrasing instincts!
MD
                                ,
                                'quizzes' => [
                                    [
                                        'question' => "Which phrase is the most professional and diplomatic alternative to: 'Your quote is too expensive'?",
                                        'explanation' => "Saying 'While we appreciate the comprehensive scope, the current proposal exceeds our allocated fiscal ceiling' maintains respect while opening collaborative negotiation.",
                                        'options' => [
                                            ['text' => 'We will never pay that ridiculous amount.', 'correct' => false],
                                            ['text' => 'While we appreciate the comprehensive scope, the current proposal exceeds our allocated fiscal ceiling.', 'correct' => true],
                                            ['text' => 'Cut the price by 30% or we terminate negotiations.', 'correct' => false],
                                            ['text' => 'We have zero budget for your services.', 'correct' => false],
                                        ],
                                    ],
                                    [
                                        'question' => "What is the primary function of the 'Acknowledge, Pivot, Propose' framework in business negotiations?",
                                        'explanation' => "It validates the counterpart's perspective before introducing constraints, preventing defensive confrontation.",
                                        'options' => [
                                            ['text' => 'To delay responding to client inquiries by 48 hours.', 'correct' => false],
                                            ['text' => 'To validate the counterpart’s priority before constructively proposing an optimal compromise.', 'correct' => true],
                                            ['text' => 'To force the counterparty into immediate contract default.', 'correct' => false],
                                            ['text' => 'To calculate currency exchange rates automatically.', 'correct' => false],
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'title' => 'Writing Persuasive Executive Summaries & Boardroom Emails',
                                'type' => 'interactive',
                                'duration_minutes' => 25,
                                'content' => <<<MD
# Writing Persuasive Executive Summaries & Boardroom Emails

C-suite leaders, directors, and enterprise clients scan communications in less than 30 seconds. The **BLUF (Bottom Line Up Front)** methodology ensures immediate comprehension and prompt decision-making.

---

## 1. The BLUF Communication Structure

```
[ Subject Line ]  Action Required / Decision / Approval: [Clear Project Descriptor]
      |
[ The Hook ]      BLUF: We request approval for €45,000 to expand server capacity before Q4 peak.
      |
[ Key Context ]   Current cluster utilization is at 87%; projected Black Friday traffic is +250%.
      |
[ Clear Call ]    Next Step: Sign-off requested by Thursday, 17:00 CET to allow 2-week vendor lead time.
```

---

## 2. Eliminating Fluff Words & Passive Voice

Avoid weak openings like:
- ❌ *"I am writing this email just to kindly ask if maybe you have had a chance to look at..."*
- ✅ *"Following our Tuesday review, please confirm approval for the revised SLA agreement attached."*

Proceed to the quiz to test your executive email writing skills.
MD
                                ,
                                'quizzes' => [
                                    [
                                        'question' => "What does the BLUF methodology stand for in business communication?",
                                        'explanation' => "BLUF stands for Bottom Line Up Front, prioritizing the conclusion and core decision before supporting evidence.",
                                        'options' => [
                                            ['text' => 'Best Level Under Format', 'correct' => false],
                                            ['text' => 'Bottom Line Up Front', 'correct' => true],
                                            ['text' => 'Board Leadership Ultimate Foundation', 'correct' => false],
                                            ['text' => 'Business Logistics Universal Feature', 'correct' => false],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            // 2. Product Design & UI/UX
            [
                'title' => 'Product Design Mastery: Figma, Design Systems & UX Research',
                'slug' => 'product-design-figma-ux-mastery',
                'description' => 'From qualitative customer discovery interviews to enterprise Figma design systems. Master typography scales, WCAG 2.2 accessibility compliance, auto-layout hierarchies, and seamless engineering handoffs.',
                'price' => 69.00,
                'status' => 'published',
                'generation_step' => 'Published & Verified',
                'generation_progress' => 100,
                'topic' => 'UI/UX & Product Design',
                'category' => 'Design & Creative',
                'target_audience' => 'UI/UX Designers, Product Managers, Frontend Engineers',
                'estimated_hours' => 10,
                'modules' => [
                    [
                        'title' => 'Design Tokens & Scalable Component Architecture',
                        'description' => 'Build bulletproof design systems in Figma that translate directly into clean code.',
                        'lessons' => [
                            [
                                'title' => 'Atomic Design Tokens & WCAG Contrast Standards',
                                'type' => 'text',
                                'duration_minutes' => 25,
                                'content' => <<<MD
# Atomic Design Tokens & WCAG Contrast Standards

A truly world-class digital product cannot rely on arbitrary hex colors or ad-hoc margins. Building an enterprise **Design System** requires defining semantic tokens and enforcing accessibility standards.

---

## 1. The Token Hierarchy

```
[ Global / Primitive Token ]   color-slate-900: #0F172A
            |
[ Semantic Token ]            color-text-primary: var(--color-slate-900)
            |
[ Component-Level Token ]     button-primary-bg: var(--color-text-primary)
```

By binding components to semantic tokens rather than raw hex values, implementing themes (like Dark Mode or High Contrast) takes minutes rather than weeks.

---

## 2. WCAG 2.2 Contrast Ratio Requirements

- **Level AA (Standard)**: Minimum contrast ratio of **4.5:1** for regular text, and **3:1** for large text (18pt+ or bold 14pt+).
- **Level AAA (Enhanced)**: Minimum contrast ratio of **7:1** for regular text, and **4.5:1** for large text.

Always test button labels against background states with tools like Stark or contrast analyzers before shipping to production.
MD
                                ,
                                'quizzes' => [
                                    [
                                        'question' => "Under WCAG 2.2 Level AA, what is the minimum required contrast ratio for regular body text?",
                                        'explanation' => "WCAG 2.2 Level AA requires a minimum contrast ratio of 4.5:1 for normal body text against its background.",
                                        'options' => [
                                            ['text' => '2:1', 'correct' => false],
                                            ['text' => '4.5:1', 'correct' => true],
                                            ['text' => '10:1', 'correct' => false],
                                            ['text' => '1.5:1', 'correct' => false],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            // 3. Project Management & Agile
            [
                'title' => 'Agile Project Management: Scrum Master & Delivery Leadership',
                'slug' => 'agile-project-management-scrum',
                'description' => 'Lead cross-functional teams to predictable, high-speed product releases. Master sprint planning, velocity estimation, burndown tracking, resolving team blockers, and executive stakeholder alignment.',
                'price' => 59.00,
                'status' => 'published',
                'generation_step' => 'Published & Verified',
                'generation_progress' => 100,
                'topic' => 'Project Management & Agile',
                'category' => 'Business & Management',
                'target_audience' => 'Project Managers, Scrum Masters, Team Leads, Founders',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Scrum Framework & Velocity Estimation',
                        'description' => 'Deconstruct the 5 Scrum ceremonies and empirical process control.',
                        'lessons' => [
                            [
                                'title' => 'Sprint Planning, Story Points & Removing Critical Blockers',
                                'type' => 'text',
                                'duration_minutes' => 20,
                                'content' => <<<MD
# Sprint Planning, Story Points & Removing Critical Blockers

Agile is not about doing more work in less time; it is about delivering maximum customer value with minimal wasted effort through rapid feedback loops.

---

## 1. Why Story Points Beat Hours for Estimation

Estimating in hours introduces false precision because:
1. Different developers work at varying speeds.
2. Unforeseen technical complexity or third-party API dependencies do not scale linearly with time.
3. Story points (using modified Fibonacci: 1, 2, 3, 5, 8, 13, 21) measure **relative complexity, uncertainty, and effort**.

---

## 2. The 5 Core Scrum Events

1. **Sprint Planning**: Align on the Sprint Goal and commit to a prioritized sprint backlog.
2. **Daily Standup (15 min)**: Yesterday's achievement, today's commitment, and any active blockers.
3. **Backlog Refinement**: Break down epics, write acceptance criteria, and estimate upcoming user stories.
4. **Sprint Review**: Demonstrate working software increments to real stakeholders.
5. **Sprint Retrospective**: Reflect on process bottlenecks and agree on 1-2 concrete action items for continuous improvement.
MD
                                ,
                                'quizzes' => [
                                    [
                                        'question' => "What is the primary objective of the Sprint Retrospective in Scrum?",
                                        'explanation' => "The retrospective is dedicated to inspecting the team's processes, relationships, and tools, and implementing continuous improvement action items.",
                                        'options' => [
                                            ['text' => 'To demonstrate completed software features to external clients.', 'correct' => false],
                                            ['text' => 'To reflect on team processes and agree on concrete continuous improvement actions.', 'correct' => true],
                                            ['text' => 'To punish developers who failed to complete their assigned user stories.', 'correct' => false],
                                            ['text' => 'To renegotiate developer salaries.', 'correct' => false],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            // 4. Marketing & Growth
            [
                'title' => 'Performance Marketing & Modern Growth Hacking Masterclass',
                'slug' => 'performance-marketing-growth-masterclass',
                'description' => 'Build sustainable, profitable customer acquisition engines. Master Google Ads bidding strategies, Meta ad architectures, CAC/LTV unit economics, and data-driven landing page conversion rate optimization (CRO).',
                'price' => 45.00,
                'status' => 'published',
                'generation_step' => 'Published & Verified',
                'generation_progress' => 100,
                'topic' => 'Marketing & Growth',
                'category' => 'Marketing & Growth',
                'target_audience' => 'Growth Marketers, Founders, Marketing Managers',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Unit Economics & Acquisition Funnels',
                        'description' => 'Master the metrics that govern scalable marketing economics.',
                        'lessons' => [
                            [
                                'title' => 'CAC, LTV & Payback Period: The Growth Trinity',
                                'type' => 'text',
                                'duration_minutes' => 20,
                                'content' => <<<MD
# CAC, LTV & Payback Period: The Growth Trinity

Pouring ad spend into an acquisition funnel with broken unit economics is the fastest path to startup insolvency. Before scaling ad campaigns, you must understand the **Growth Trinity**.

---

## 1. The Core Formulas

### Customer Acquisition Cost (CAC)
$$\text{CAC} = \frac{\text{Total Sales \& Marketing Spend}}{\text{Number of New Customers Acquired}}$$

### Customer Lifetime Value (LTV)
$$\text{LTV} = \frac{\text{Average Revenue Per User (ARPU)} \times \text{Gross Margin \%}}{\text{Monthly Churn Rate}}$$

### The Golden Ratio
$$\frac{\text{LTV}}{\text{CAC}} \ge 3.0$$

- **< 1.0x**: Losing money on every user acquired.
- **1.0x - 2.5x**: Marginally viable, vulnerable to ad auction volatility.
- **3.0x - 5.0x**: Healthy, highly scalable enterprise growth engine.
- **> 6.0x**: Likely under-investing in acquisition; room to scale aggressively.

---

## 2. CAC Payback Period

In B2B SaaS, the benchmark payback period is **< 12 months** (the time it takes for customer revenue to repay the CAC invested to acquire them).
MD
                                ,
                                'quizzes' => [
                                    [
                                        'question' => "What is considered the healthy industry benchmark for the LTV/CAC ratio in scalable businesses?",
                                        'explanation' => "An LTV/CAC ratio of at least 3.0x is widely recognized by investors as the gold standard for profitable, scalable customer acquisition.",
                                        'options' => [
                                            ['text' => '0.5x', 'correct' => false],
                                            ['text' => '3.0x or higher', 'correct' => true],
                                            ['text' => '50x', 'correct' => false],
                                            ['text' => '1.0x exactly', 'correct' => false],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            // 5. Finance & Valuation
            [
                'title' => 'Corporate Finance, Valuation & Financial Modeling',
                'slug' => 'corporate-finance-dcf-valuation',
                'description' => 'Demystify enterprise balance sheets, discounted cash flows (DCF), EBITDA valuation multiples, and M&A financial models. Understand how CFOs, venture capitalists, and private equity firms evaluate commercial viability.',
                'price' => 79.00,
                'status' => 'published',
                'generation_step' => 'Published & Verified',
                'generation_progress' => 100,
                'topic' => 'Finance & Corporate Valuation',
                'category' => 'Finance & Accounting',
                'target_audience' => 'Financial Analysts, Executives, Founders, Investors',
                'estimated_hours' => 9,
                'modules' => [
                    [
                        'title' => 'Financial Statements & Discounted Cash Flow (DCF)',
                        'description' => 'Connect Income Statements, Balance Sheets, and Cash Flows into rigorous models.',
                        'lessons' => [
                            [
                                'title' => 'Calculating WACC, Free Cash Flow & Enterprise Value',
                                'type' => 'text',
                                'duration_minutes' => 25,
                                'content' => <<<MD
# Calculating WACC, Free Cash Flow & Enterprise Value

A business is fundamentally worth the present value of all the cash it can generate in the future. The **Discounted Cash Flow (DCF)** model translates this economic law into a rigorous valuation framework.

---

## 1. Unlevered Free Cash Flow (UFCF)

$$\text{UFCF} = \text{EBIT} \times (1 - t) + \text{D\&A} - \text{CapEx} - \Delta \text{NWC}$$

Where:
- **EBIT**: Earnings Before Interest and Taxes
- **t**: Marginal corporate tax rate
- **D&A**: Depreciation & Amortization (non-cash charge added back)
- **CapEx**: Capital Expenditures needed to maintain operations
- **$\Delta$ NWC**: Change in Non-Cash Working Capital

---

## 2. Weighted Average Cost of Capital (WACC)

WACC represents the blended hurdle rate required by all capital providers (both debt and equity):

$$\text{WACC} = \left(\frac{E}{V} \times R_e\right) + \left(\frac{D}{V} \times R_d \times (1 - t)\right)$$

Complete the quiz below to verify your corporate valuation fundamentals!
MD
                                ,
                                'quizzes' => [
                                    [
                                        'question' => "Why is Depreciation & Amortization (D&A) added back when calculating Free Cash Flow from Operating Income?",
                                        'explanation' => "D&A is an accounting non-cash expense that reduces taxable income on paper, but does not represent an actual physical outflow of cash.",
                                        'options' => [
                                            ['text' => 'Because D&A increases tax liabilities.', 'correct' => false],
                                            ['text' => 'Because D&A is a non-cash accounting expense; no actual physical cash left the business.', 'correct' => true],
                                            ['text' => 'Because banks require it for mortgage approvals.', 'correct' => false],
                                            ['text' => 'It is only added back during economic recessions.', 'correct' => false],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],

            // 6. Public Speaking & Leadership
            [
                'title' => 'Executive Public Speaking, Pitching & Storytelling',
                'slug' => 'executive-public-speaking-storytelling',
                'description' => 'Command any room with presence and confidence. Master vocal projection, psychological pitch structures for venture capital, non-verbal authority cues, and managing stage anxiety for keynotes.',
                'price' => 39.00,
                'status' => 'published',
                'generation_step' => 'Published & Verified',
                'generation_progress' => 100,
                'topic' => 'Public Speaking & Leadership',
                'category' => 'Personal Development',
                'target_audience' => 'Founders, Team Leaders, Conference Speakers',
                'estimated_hours' => 5,
                'modules' => [
                    [
                        'title' => 'Venture Pitch Architecture & Stage Presence',
                        'description' => 'Structure presentations that trigger action and emotional resonance.',
                        'lessons' => [
                            [
                                'title' => 'The Problem-Solution Hook & Non-Verbal Gravitas',
                                'type' => 'text',
                                'duration_minutes' => 15,
                                'content' => <<<MD
# The Problem-Solution Hook & Non-Verbal Gravitas

Within the first **7 seconds** of stepping onto a stage, an audience has subconsciously decided whether you possess authority. Great executive speakers rely on proven structural cues rather than charisma.

---

## 1. The Hook: Never Start with Your Name

Audiences already know your name from the conference program. Hook them with a high-stakes contrast:

1. **The Compelling Stat**: *"Every 11 seconds, an enterprise suffers a ransomware compromise."*
2. **The Provocative Question**: *"What if your entire onboarding cycle took 4 hours instead of 6 weeks?"*
3. **The Vivid Scenario**: *"Picture this: it is 3 AM on Black Friday, and your payment gateway goes completely dark."*

---

## 2. Non-Verbal Gravitas & Eliminating Jitter

- **The Eye-Contact Triad**: Divide the auditorium into Left, Center, and Right zones. Deliver one complete thought (4-6 seconds) to an individual in each zone before rotating.
- **The Grounded Stance**: Feet shoulder-width apart, weight evenly distributed. Never pace aimlessly or sway.
- **Vocal Pacing**: The power is in the pause. Silence generates anticipation and projects supreme comfort.
MD
                                ,
                                'quizzes' => [
                                    [
                                        'question' => "What is the most effective way to open an executive keynote speech?",
                                        'explanation' => "Starting with a high-stakes contrast, provocative question, or vivid story immediately commands the room's attention.",
                                        'options' => [
                                            ['text' => 'Spend 5 minutes reading your resume slide.', 'correct' => false],
                                            ['text' => 'Open with a compelling statistic, provocative contrast, or vivid narrative hook.', 'correct' => true],
                                            ['text' => 'Apologize for being nervous or jet-lagged.', 'correct' => false],
                                            ['text' => 'Check your smartphone on stage.', 'correct' => false],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($coursesData as $cData) {
            $modules = $cData['modules'] ?? [];
            unset($cData['modules']);
            unset($cData['category']);

            $cData['creator_id'] = $admin->id;

            $course = Course::updateOrCreate(
                ['slug' => $cData['slug']],
                $cData
            );

            // Seed modules and lessons
            $modOrder = 1;
            foreach ($modules as $m) {
                $module = Module::updateOrCreate(
                    ['course_id' => $course->id, 'title' => $m['title']],
                    [
                        'description' => $m['description'],
                        'order' => $modOrder++,
                    ]
                );

                $lesOrder = 1;
                foreach ($m['lessons'] as $l) {
                    $lessonSlug = Str::slug($l['title']) . '-' . Str::random(4);
                    $lesson = Lesson::updateOrCreate(
                        ['module_id' => $module->id, 'title' => $l['title']],
                        [
                            'slug' => $lessonSlug,
                            'content' => $l['content'],
                            'type' => $l['type'],
                            'order' => $lesOrder++,
                            'duration_minutes' => $l['duration_minutes'],
                        ]
                    );

                    // Seed Quizzes
                    if (!empty($l['quizzes'])) {
                        $qOrder = 1;
                        foreach ($l['quizzes'] as $q) {
                            $quiz = Quiz::updateOrCreate(
                                ['lesson_id' => $lesson->id, 'question_text' => $q['question']],
                                [
                                    'explanation' => $q['explanation'],
                                    'order' => $qOrder++,
                                ]
                            );

                            $optOrder = 1;
                            foreach ($q['options'] as $opt) {
                                QuizOption::updateOrCreate(
                                    ['quiz_id' => $quiz->id, 'option_text' => $opt['text']],
                                    [
                                        'is_correct' => $opt['correct'],
                                        'order' => $optOrder++,
                                    ]
                                );
                            }
                        }
                    }
                }
            }

            // Generate high-resolution SVG course thumbnail
            CourseThumbnailGenerator::generate($course);
        }
    }
}

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

class FullCatalogSeeder extends Seeder
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

        $catalog = $this->getCatalogData();

        $this->command?->info("Seeding " . count($catalog) . " courses across 8 learning tracks...");

        foreach ($catalog as $item) {
            $course = Course::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'creator_id' => $admin->id,
                    'title' => $item['title'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'status' => 'published',
                    'generation_step' => 'Published & Verified',
                    'generation_progress' => 100,
                    'topic' => $item['topic'],
                    'target_audience' => $item['target_audience'],
                    'estimated_hours' => $item['estimated_hours'],
                ]
            );

            // Create modules and lessons if course has none yet
            if ($course->modules()->count() === 0) {
                foreach ($item['modules'] as $mIdx => $modData) {
                    $module = Module::create([
                        'course_id' => $course->id,
                        'title' => $modData['title'],
                        'description' => $modData['description'],
                        'order' => $mIdx + 1,
                    ]);

                    foreach ($modData['lessons'] as $lIdx => $lesData) {
                        $lesson = Lesson::create([
                            'module_id' => $module->id,
                            'title' => $lesData['title'],
                            'slug' => Str::slug($lesData['title']),
                            'type' => $lesData['type'] ?? 'text',
                            'duration_minutes' => $lesData['duration_minutes'] ?? 20,
                            'order' => $lIdx + 1,
                            'content' => $lesData['content'],
                        ]);

                        if (isset($lesData['quiz'])) {
                            $qData = $lesData['quiz'];
                            $quiz = Quiz::create([
                                'lesson_id' => $lesson->id,
                                'question_text' => $qData['question'],
                                'explanation' => $qData['explanation'],
                            ]);

                            foreach ($qData['options'] as $oIdx => $optText) {
                                QuizOption::create([
                                    'quiz_id' => $quiz->id,
                                    'option_text' => $optText,
                                    'is_correct' => $oIdx === $qData['correct_index'],
                                ]);
                            }
                        }
                    }
                }
            }

            // Generate aesthetic thumbnail
            try {
                CourseThumbnailGenerator::generate($course);
            } catch (\Throwable $e) {
                $this->command?->warn("Thumbnail generation skipped for {$course->slug}: {$e->getMessage()}");
            }
        }

        $this->command?->info("Catalog seeding completed successfully! Total courses: " . Course::count());
    }

    private function getCatalogData(): array
    {
        return [
            // ==========================================
            // TRACK 1: Languages & Communication (8 new)
            // ==========================================
            [
                'title' => 'English A1: Absolute Beginner & Everyday Life',
                'slug' => 'english-a1-everyday-starter',
                'description' => 'Start your English journey from zero. Master the alphabet, phonetic foundations, essential greetings, numbers, ordering food, asking for directions, and forming simple present tense sentences with confidence.',
                'price' => 29.00,
                'topic' => 'English Language & Communication',
                'target_audience' => 'Absolute beginners, adults learning English from scratch, travelers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Foundations: Alphabet, Greetings & The Verb "To Be"',
                        'description' => 'Learn core sounds, introductions, and how to describe yourself and others.',
                        'lessons' => [
                            [
                                'title' => 'Saying Hello, Introductions & Personal Pronouns',
                                'duration_minutes' => 15,
                                'content' => "# Saying Hello & Introductions\n\nWelcome to English A1! In this foundational lesson, you will learn how to introduce yourself naturally in any international setting.\n\n## 1. Greetings by Time of Day\n- **Good morning**: Until 12:00 PM\n- **Good afternoon**: 12:00 PM to 5:00 PM\n- **Good evening**: After 5:00 PM\n- **Hello / Hi**: Casual and universal\n\n## 2. Introducing Yourself\n- *\"Hello! My name is Alex. Nice to meet you.\"*\n- *\"I am from Germany, and I live in Berlin.\"*\n- *\"I am a graphic designer.\"*\n\n## 3. The Verb \"To Be\" (am, is, are)\n| Pronoun | Form | Example |\n|---|---|---|\n| I | am | I am a student. |\n| You | are | You are welcome. |\n| He / She / It | is | She is from Spain. |\n| We / They | are | They are colleagues. |\n\nTake note of contractions: *I am -> I'm*, *He is -> He's*, *They are -> They're*.",
                                'quiz' => [
                                    'question' => 'Which sentence is grammatically correct in English A1?',
                                    'options' => [
                                        'She are from France.',
                                        'She is from France.',
                                        'She am from France.',
                                        'She be from France.'
                                    ],
                                    'correct_index' => 1,
                                    'explanation' => 'With third-person singular pronouns (He, She, It), the present tense of "to be" is "is".'
                                ]
                            ],
                            [
                                'title' => 'Numbers, Time & Daily Essentials',
                                'duration_minutes' => 20,
                                'content' => "# Numbers, Time & Daily Essentials\n\nCounting, telling time, and understanding prices are essential survival skills.\n\n## Numbers 1 to 20\n1: One, 2: Two, 3: Three, 4: Four, 5: Five, 6: Six, 7: Seven, 8: Eight, 9: Nine, 10: Ten...\n\n## Asking the Time\n- *\"Excuse me, what time is it?\"*\n- *\"It is half past two (2:30).\"*\n- *\"It is quarter to five (4:45).\"*\n\n## In a Café: Simple Orders\n- *\"Could I please have a cappuccino and a bottle of water?\"*\n- *\"How much is that?\"* -> *\"That will be five euros, please.\"*"
                            ]
                        ]
                    ],
                    [
                        'title' => 'Everyday Actions: Present Simple & Daily Routine',
                        'description' => 'Form habits, express likes and dislikes, and ask basic questions.',
                        'lessons' => [
                            [
                                'title' => 'Present Simple: Daily Routines and Habits',
                                'duration_minutes' => 25,
                                'content' => "# Present Simple: Daily Routines\n\nUse the Present Simple to describe what you do regularly.\n\n```text\nI wake up at 7:00 AM.\nI drink coffee and read the news.\nHe works in an international logistics office.\nWe study English every Tuesday evening.\n```\n\n**Golden Rule:** Add **-s** or **-es** for *He, She, It* in affirmative sentences!\n- *I work* -> *He works*\n- *I watch* -> *She watches*"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'English A2: Elementary Conversations & Travel Survival',
                'slug' => 'english-a2-conversations-travel',
                'description' => 'Build on your basics. Master past simple tense, booking hotels, navigating international airports, asking for directions, describing past vacations, and holding 5-minute everyday conversations.',
                'price' => 35.00,
                'topic' => 'English Language & Communication',
                'target_audience' => 'A1 graduates, false beginners, frequent tourists and international travelers',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Travel & Navigation: Airports, Hotels & Transit',
                        'description' => 'Handle common travel scenarios with confidence.',
                        'lessons' => [
                            [
                                'title' => 'Airport Check-in & Passport Control',
                                'duration_minutes' => 20,
                                'content' => "# Airport Check-in & Border Control\n\n## Key Airport Vocabulary\n- **Boarding pass**: Талон на посадку\n- **Carry-on luggage**: Ручная кладь\n- **Connecting flight**: Пересадочный рейс\n- **Gate**: Выход на посадку\n\n## Dialogue at the Check-in Desk\n- Agent: *\"Good morning, may I see your passport and booking reference?\"*\n- You: *\"Sure, here they are. I would prefer a window seat if available.\"*\n- Agent: *\"Do you have any checked baggage or just hand luggage?\"*\n- You: *\"Just this one carry-on bag.\"*",
                                'quiz' => [
                                    'question' => 'What does "carry-on luggage" mean?',
                                    'options' => [
                                        'Heavy luggage sent to the airplane hold',
                                        'Baggage you bring inside the aircraft cabin',
                                        'Lost luggage at the terminal',
                                        'An excess baggage fine'
                                    ],
                                    'correct_index' => 1,
                                    'explanation' => 'Carry-on luggage refers to bags allowed inside the airplane passenger cabin.'
                                ]
                            ]
                        ]
                    ],
                    [
                        'title' => 'Talking About the Past: Past Simple & Stories',
                        'description' => 'Narrate your weekend, past travels, and personal experiences.',
                        'lessons' => [
                            [
                                'title' => 'Regular and Irregular Past Verbs',
                                'duration_minutes' => 25,
                                'content' => "# Regular & Irregular Past Simple\n\nTo tell stories about yesterday or last year, use Past Simple.\n\n- Regular: *visit -> visited*, *arrive -> arrived*\n- Irregular: *go -> went*, *see -> saw*, *buy -> bought*, *eat -> ate*\n\nExample: *\"Last summer, I went to Lisbon. I saw the ocean and visited historic castles.\"*"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'English B1: Intermediate Fluency & Daily Socializing',
                'slug' => 'english-b1-intermediate-fluency',
                'description' => 'Transition to independent English. Master conversational idioms, future intentions, expressing opinions, giving advice, conditional structures (If/Then), and understanding podcasts and news.',
                'price' => 39.00,
                'topic' => 'English Language & Communication',
                'target_audience' => 'Elementary speakers striving for intermediate conversational fluency',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Expressing Opinions, Agreement & Polite Disagreement',
                        'description' => 'Engage in natural discussions without sounding blunt.',
                        'lessons' => [
                            [
                                'title' => 'Nuanced Opinions and Conversational Connectors',
                                'duration_minutes' => 20,
                                'content' => "# Nuanced Opinions and Conversational Connectors\n\nAt the B1 level, move beyond *\"I think it's good\"* to richer phrases:\n- *\"In my experience, remote work boosts focus, although team bonding requires effort.\"*\n- *\"I see your point, but have you considered the timeline constraints?\"*\n- *\"From my perspective, that approach offers great flexibility.\"*"
                            ]
                        ]
                    ],
                    [
                        'title' => 'Conditionals & Hypothetical Situations',
                        'description' => 'Express possibilities, future plans, and imaginary scenarios.',
                        'lessons' => [
                            [
                                'title' => 'First and Second Conditionals in Action',
                                'duration_minutes' => 25,
                                'content' => "# First vs. Second Conditionals\n\n- **First Conditional (Real possibilities):** `If + present, will + verb`\n  *\"If it rains tomorrow, we will stay at home.\"*\n- **Second Conditional (Hypothetical / Dreams):** `If + past, would + verb`\n  *\"If I had a million euros, I would launch an educational academy.\"*"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'English B2: Professional Workplace & Cross-Team Collaboration',
                'slug' => 'english-b2-workplace-collaboration',
                'description' => 'The threshold for international workplace success. Confidently participate in sprint reviews, write structured corporate memos, resolve team friction diplomatically, and deliver crisp PowerPoint presentations.',
                'price' => 45.00,
                'topic' => 'English Language & Communication',
                'target_audience' => 'Engineers, managers, consultants, and specialists working in global companies',
                'estimated_hours' => 9,
                'modules' => [
                    [
                        'title' => 'Effective Business Meetings & Standups',
                        'description' => 'Drive discussions, ask clarifying questions, and manage meeting flow.',
                        'lessons' => [
                            [
                                'title' => 'Facilitating Remote Syncs & Handling Interruptions',
                                'duration_minutes' => 20,
                                'content' => "# Facilitating Remote Syncs\n\n## Interventions & Structuring\n- *\"Let's circle back to that topic once we finalize the quarterly budget.\"*\n- *\"Could you elaborate on the technical dependencies before we commit to the release date?\"*\n- *\"If I may jump in here, we need to consider the customer feedback from last week.\"*"
                            ]
                        ]
                    ],
                    [
                        'title' => 'Professional Email Etiquette & Status Updates',
                        'description' => 'Structure clear, action-oriented corporate communications.',
                        'lessons' => [
                            [
                                'title' => 'Executive Status Reports & Action Items',
                                'duration_minutes' => 25,
                                'content' => "# Executive Status Reports\n\nAlways use the **BLUF** model (**Bottom Line Up Front**):\n1. **Executive Summary**: 2 sentences stating the outcome or decision.\n2. **Current Progress**: Bullet points with clear metrics.\n3. **Blockers & Risks**: What is in jeopardy and proposed mitigations.\n4. **Action Items & Owners**: Who does what by when."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'International Business Negotiations & Deal Making',
                'slug' => 'international-business-negotiations',
                'description' => 'Learn Harvard negotiation frameworks, principled bargaining, term sheet tradeoffs, handling objections, and closing cross-border commercial partnerships in fluent English.',
                'price' => 49.00,
                'topic' => 'English Language & Communication',
                'target_audience' => 'Executives, sales leads, startup founders, account managers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'BATNA & Principled Bargaining',
                        'description' => 'Prepare strategic leverage and identify trade-offs before entering the room.',
                        'lessons' => [
                            [
                                'title' => 'Identifying Interests vs. Positions in Deal Making',
                                'duration_minutes' => 25,
                                'content' => "# Interests vs. Positions in Deal Making\n\nIn international negotiations, focus on **underlying interests**, not stubborn positions.\n- Position: *\"We will not pay more than €50k per license.\"*\n- Interest: *\"We must keep our annual software burn within budget while securing 24/7 SLA.\"*\n\nBy addressing the interest (e.g. Offering tiered payment terms or extended SLA credits), both sides can win without stalemate."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Technical Writing & Documentation for Engineers & Product Teams',
                'slug' => 'technical-writing-engineering',
                'description' => 'Write clear, developer-friendly API documentation, architectural decision records (ADRs), incident post-mortems, and RFCs that align stakeholders and eliminate ambiguity.',
                'price' => 39.00,
                'topic' => 'English Language & Communication',
                'target_audience' => 'Software engineers, architects, technical product managers, DevOps leads',
                'estimated_hours' => 5,
                'modules' => [
                    [
                        'title' => 'Architectural Decision Records (ADRs) & RFCs',
                        'description' => 'Document technical trade-offs with structured clarity.',
                        'lessons' => [
                            [
                                'title' => 'The Standard ADR Structure: Context, Decision & Consequences',
                                'duration_minutes' => 20,
                                'content' => "# Architectural Decision Records (ADR)\n\nAn ADR captures a critical architecture choice so future engineers understand why choices were made.\n\n```markdown\n# ADR 014: Adoption of Kafka over RabbitMQ for Event Sourcing\n\n## Status\nAccepted\n\n## Context\nOur microservice cluster requires persistent event replay up to 30 days with throughput exceeding 100k msg/sec.\n\n## Decision\nWe choose Apache Kafka with KRaft consensus.\n\n## Consequences\n- Positive: High partition scalability and historical replay.\n- Negative: Increased operational complexity and ZooKeeper/KRaft monitoring requirements.\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'German A1: Everyday Essentials & German Business Etiquette',
                'slug' => 'german-a1-workplace-basics',
                'description' => 'Master German fundamentals for living, traveling, or working with DACH region partners. Covers articles (der/die/das), basic verb conjugations, ordering, greetings, and formal vs. informal communication (Sie vs. du).',
                'price' => 35.00,
                'topic' => 'German Language & Culture',
                'target_audience' => 'Expats moving to Germany/Austria/Switzerland, international business partners',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Begrüßung, Vorstellung & Höflichkeitsformen',
                        'description' => 'Guten Tag, wie geht es Ihnen? Essential German greetings and formal speech.',
                        'lessons' => [
                            [
                                'title' => 'Guten Tag: Introductions & Formal vs. Informal Address',
                                'duration_minutes' => 20,
                                'content' => "# Begrüßung & Höflichkeitsformen\n\nIn German business culture, punctuality and formal address are paramount.\n\n## 1. Greetings\n- **Guten Morgen**: Good morning (until ~11:00)\n- **Guten Tag**: Good day (universal formal greeting)\n- **Guten Abend**: Good evening\n- **Auf Wiedersehen**: Formal goodbye\n- **Tschüss**: Informal bye\n\n## 2. Sie vs. Du\n- Always use **Sie** with business partners, doctors, and strangers.\n- Use **du** with family, close friends, and within modern tech companies that explicitly offer \"das Du\"."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Spanish A1: Practical Foundations for Travel & Business',
                'slug' => 'spanish-a1-conversational-starter',
                'description' => 'Learn Spanish with a clear, fast-track methodology. Essential greetings, ser vs. estar, asking for directions, hotel check-in, dining out, and conversational etiquette for Spain and Latin America.',
                'price' => 35.00,
                'topic' => 'Spanish Language & Culture',
                'target_audience' => 'Beginners, travelers, expats, and professionals collaborating with Spanish-speaking teams',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Hola y Bienvenidos: Saludos, Presentaciones y Ser vs Estar',
                        'description' => 'Start speaking Spanish from day one.',
                        'lessons' => [
                            [
                                'title' => 'Saludos, Presentaciones y el Verbo Ser',
                                'duration_minutes' => 20,
                                'content' => "# ¡Hola! Saludos y Presentaciones\n\n## Saludos Básicos\n- *¡Buenos días!* (Good morning)\n- *¡Buenas tardes!* (Good afternoon)\n- *¡Buenas noches!* (Good evening / Good night)\n\n## Presentarse\n- *\"Hola, me llamo Carlos. Mucho gusto.\"*\n- *\"Soy de España y trabajo en diseño gráfico.\"*\n- *\"¿De dónde eres?\"* (Where are you from?)"
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // TRACK 2: UI/UX & Product Design (6 new)
            // ==========================================
            [
                'title' => 'Visual Design Fundamentals: Typography, Color & Layout',
                'slug' => 'design-fundamentals-typography-color',
                'description' => 'Master the visual building blocks of world-class digital design. Learn grid systems, typographic hierarchy, 60-30-10 color theory, visual weight, whitespace discipline, and gestalt principles.',
                'price' => 29.00,
                'topic' => 'UI/UX & Product Design',
                'target_audience' => 'Beginning designers, frontend developers wanting better design taste',
                'estimated_hours' => 5,
                'modules' => [
                    [
                        'title' => 'Typographic Hierarchy & Modular Scale',
                        'description' => 'How to choose typefaces and build readable, balanced interfaces.',
                        'lessons' => [
                            [
                                'title' => 'The Golden Rules of Interface Typography',
                                'duration_minutes' => 20,
                                'content' => "# The Golden Rules of Interface Typography\n\nGood typography is 95% of UI design.\n\n1. **Limit Typefaces**: Use one workhorse sans-serif (e.g. Inter, SF Pro) with distinct weights (Regular 400, Semi-Bold 600, Bold 700).\n2. **Type Scale**: Use a mathematical ratio (e.g. 1.25 Major Third): 12px, 14px, 16px (body), 20px, 24px, 32px, 48px.\n3. **Line Height (Leading)**: Body copy requires 140%-160% line height for effortless legibility. Headers need tighter line height (110%-120%)."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Figma Essentials: Auto-Layout, Components & Interactive Prototyping',
                'slug' => 'figma-essentials-autolayout-prototyping',
                'description' => 'Fast-track your mastery of Figma. Learn Auto-Layout 5.0, nested component variants, boolean properties, smart animate transitions, and building interactive clickable prototypes.',
                'price' => 39.00,
                'topic' => 'UI/UX & Product Design',
                'target_audience' => 'Product designers, UI engineers, digital artists',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Auto-Layout & Responsive Constraints',
                        'description' => 'Build bulletproof components that stretch and wrap seamlessly.',
                        'lessons' => [
                            [
                                'title' => 'Mastering Hug, Fill and Fixed Dimensions',
                                'duration_minutes' => 25,
                                'content' => "# Auto-Layout: Hug, Fill & Fixed\n\nAuto-Layout mimics CSS flexbox directly inside Figma.\n\n- **Fixed**: Dimensions stay rigid regardless of content or parent resizing.\n- **Hug**: Frame tightly wraps its inner contents (perfect for buttons, pills, tags).\n- **Fill Container**: Stretches to occupy 100% of available parent width (cards, hero banners, text blocks)."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Enterprise Design Systems: Design Tokens, Multi-Brand & Governance',
                'slug' => 'enterprise-design-systems-tokens',
                'description' => 'Scale design across dozens of product teams. Learn design tokens (W3C format), multi-theme architecture (Dark/Light/High Contrast), component lifecycle governance, and Figma-to-Code sync with Style Dictionary.',
                'price' => 59.00,
                'topic' => 'UI/UX & Product Design',
                'target_audience' => 'Senior product designers, design system engineers, design leads',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Design Token Architecture & Variables',
                        'description' => 'Structure global, semantic, and component-level tokens.',
                        'lessons' => [
                            [
                                'title' => 'The 3-Tier Token Model: Global, Semantic & Component',
                                'duration_minutes' => 25,
                                'content' => "# 3-Tier Design Token Architecture\n\n```json\n{\n  \"color\": {\n    \"blue\": { \"500\": { \"value\": \"#3b82f6\" } },\n    \"semantic\": {\n      \"interactive\": { \"primary\": { \"value\": \"{color.blue.500}\" } }\n    },\n    \"component\": {\n      \"button\": { \"primary\": { \"background\": { \"value\": \"{color.semantic.interactive.primary}\" } } }\n    }\n  }\n}\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'UX Research & Usability Testing: Interviews, CJM & Metrics',
                'slug' => 'ux-research-usability-testing',
                'description' => 'Stop designing based on assumptions. Conduct insightful user interviews, construct Customer Journey Maps (CJM), run unmoderated usability tests, and track SUS and Task Completion metrics.',
                'price' => 45.00,
                'topic' => 'UI/UX & Product Design',
                'target_audience' => 'UX researchers, product managers, product designers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Qualitative User Interviews & Journey Mapping',
                        'description' => 'Uncover latent user needs and map friction touchpoints.',
                        'lessons' => [
                            [
                                'title' => 'Crafting Non-Biased Interview Questions',
                                'duration_minutes' => 20,
                                'content' => "# Non-Biased Qualitative Interviewing\n\nNever ask leading questions like: *\"Would you like an AI assistant here?\"*\nInstead ask:\n- *\"Talk me through the last time you tried to perform this task.\"*\n- *\"Where did you feel the most friction or confusion?\"*\n- *\"What workarounds did you implement to solve it?\"*"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Mobile App UI/UX Design: iOS Human Interface & Material 3',
                'slug' => 'mobile-app-design-ios-android',
                'description' => 'Design native iOS and Android experiences that feel intuitive. Master Apple HIG (Human Interface Guidelines), Android Material 3, thumb zones, navigation stacks, and bottom sheets.',
                'price' => 49.00,
                'topic' => 'UI/UX & Product Design',
                'target_audience' => 'Mobile UI designers, cross-platform Flutter/React Native developers',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'iOS HIG vs Android Material 3 Paradigms',
                        'description' => 'Understand the platform conventions that users instinctively expect.',
                        'lessons' => [
                            [
                                'title' => 'Navigation Patterns: Tab Bars vs Bottom Navigation',
                                'duration_minutes' => 25,
                                'content' => "# Mobile Navigation Patterns\n\n- **iOS Tab Bar**: Always visible at bottom, 3-5 destinations, switches root views.\n- **Android Navigation Bar**: Material 3 pill indicators, back gesture integration.\n- **Thumb Reach Zone**: Place destructive actions and primary CTA buttons in the lower natural reach arc of the screen."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Micro-Interactions, Web Animation & Motion Design',
                'slug' => 'micro-interactions-web-animation',
                'description' => 'Elevate digital products from static to delightful. Learn the 12 principles of animation applied to UI, cubic-bezier easing curves, Framer Motion, and Lottie animations that guide user attention.',
                'price' => 49.00,
                'topic' => 'UI/UX & Product Design',
                'target_audience' => 'UI/UX designers, creative frontend engineers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Motion Choreography & Easing Curves',
                        'description' => 'Use motion to provide spatial orientation and system feedback.',
                        'lessons' => [
                            [
                                'title' => 'The Physics of UI Motion: Spring vs Bezier',
                                'duration_minutes' => 20,
                                'content' => "# The Physics of UI Motion\n\nLinear transitions look mechanical and robotic. Natural interfaces use **spring damping** or **ease-out** curves:\n\n```css\n/* Entering elements: Fast enter, smooth decelerate */\ntransition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);\n\n/* Exiting elements: Accelerate out */\ntransition: opacity 150ms cubic-bezier(0.7, 0, 0.84, 0);\n```"
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // TRACK 3: Agile, Management & Leadership (6 new)
            // ==========================================
            [
                'title' => 'Project Management Fundamentals: Scope, Timeline & Stakeholders',
                'slug' => 'project-management-fundamentals-scope',
                'description' => 'The definitive introduction to modern project management. Master Work Breakdown Structures (WBS), Gantt charts, risk registers, critical path analysis, and stakeholder communication plans.',
                'price' => 35.00,
                'topic' => 'Project Management & Delivery',
                'target_audience' => 'Aspiring project managers, team leads, coordinators',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Scope Definition & Work Breakdown Structure (WBS)',
                        'description' => 'Deconstruct complex initiatives into manageable work packages.',
                        'lessons' => [
                            [
                                'title' => 'Eliminating Scope Creep with Clear Deliverables',
                                'duration_minutes' => 20,
                                'content' => "# Preventing Scope Creep\n\nScope creep occurs when new features are added without adjusting budget, time, or resources.\n\n### The Iron Triangle of Project Management:\n1. **Scope** (Features & Quality)\n2. **Time** (Deadlines & Milestones)\n3. **Cost** (Budget & Human Capital)\n\n*If the scope increases, either the timeline must extend or the budget must expand.*"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Advanced Scrum Master & Agile Coaching: Scaling with LeSS & SAFe',
                'slug' => 'advanced-scrum-agile-coaching',
                'description' => 'Scale agile beyond a single team. Master enterprise agile frameworks (LeSS, SAFe, Nexus), cross-team dependency mapping, coaching resistant executives, and servant leadership.',
                'price' => 65.00,
                'topic' => 'Project Management & Delivery',
                'target_audience' => 'Practicing Scrum Masters, agile coaches, program managers',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Multi-Team Scaling & Dependency Management',
                        'description' => 'Synchronize 5 to 20 teams working on a single product backlog.',
                        'lessons' => [
                            [
                                'title' => 'Scrum of Scrums & Joint Sprint Planning',
                                'duration_minutes' => 25,
                                'content' => "# Large-Scale Scrum (LeSS) Principles\n\nLeSS maintains **One Product Backlog**, **One Product Owner**, and a synchronized sprint rhythm across multiple feature teams.\n\nInstead of creating heavy middle-management layers, teams directly coordinate cross-boundary architectural changes during joint Sprint Planning 1."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Kanban Method & Flow Metrics: WIP Limits, Lead Time & Throughput',
                'slug' => 'kanban-method-flow-metrics',
                'description' => 'Optimize delivery flow and eliminate bottlenecks. Learn how to set Work-in-Progress (WIP) limits, calculate Little\'s Law, interpret Cumulative Flow Diagrams (CFD), and achieve continuous deployment.',
                'price' => 39.00,
                'topic' => 'Project Management & Delivery',
                'target_audience' => 'Engineering managers, tech leads, delivery managers, operations leads',
                'estimated_hours' => 5,
                'modules' => [
                    [
                        'title' => 'WIP Limits & Cumulative Flow Diagrams (CFD)',
                        'description' => 'Identify bottlenecks by limiting work in progress.',
                        'lessons' => [
                            [
                                'title' => 'Little\'s Law and Lead Time Optimization',
                                'duration_minutes' => 20,
                                'content' => "# Little's Law in Knowledge Work\n\n$$\\text{Lead Time} = \\frac{\\text{Work in Progress (WIP)}}{\\text{Throughput}}$$\n\nTo deliver features twice as fast without hiring more engineers, **cut your WIP in half**! Limiting WIP forces team collaboration on existing tickets rather than starting new ones."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Product Management 101: Problem Discovery, PRDs & MVP Launch',
                'slug' => 'product-management-discovery-launch',
                'description' => 'Learn the craft of the modern Product Manager. Write crisp Product Requirement Documents (PRDs), run opportunity solution trees, prioritize backlogs using RICE, and coordinate high-impact MVP launches.',
                'price' => 55.00,
                'topic' => 'Project Management & Delivery',
                'target_audience' => 'Associate PMs, engineers transitioning to PM, startup founders',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'The Product Requirements Document (PRD)',
                        'description' => 'Align designers, engineers, and executives with structured problem definitions.',
                        'lessons' => [
                            [
                                'title' => 'The Anatomy of a Modern PRD',
                                'duration_minutes' => 25,
                                'content' => "# The Modern PRD Template\n\n1. **The Problem Statement**: Why are we doing this? What customer pain are we relieving?\n2. **Success Metrics (KPIs)**: Primary metric (e.g. Day 7 retention) & guardrail metrics (e.g. Server error rate).\n3. **User Stories & Acceptance Criteria**: Specific, testable requirements.\n4. **Out of Scope**: What we explicitly will NOT build in this milestone."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Engineering Leadership: Managing Teams, 1-on-1s & Career Ladders',
                'slug' => 'engineering-leadership-management',
                'description' => 'Transition from Senior Engineer to Engineering Manager. Master the art of effective 1-on-1s, giving constructive feedback, managing underperformance, running engineering career ladders, and delegating.',
                'price' => 59.00,
                'topic' => 'Engineering Leadership & Management',
                'target_audience' => 'Tech leads, engineering managers, directors of engineering',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'High-Impact 1-on-1s & Coaching',
                        'description' => 'Make 1-on-1s about career development, mental clarity, and trust.',
                        'lessons' => [
                            [
                                'title' => 'The 1-on-1 Framework: Not a Status Update',
                                'duration_minutes' => 20,
                                'content' => "# The 1-on-1 Meeting Blueprint\n\n1-on-1s belong to the direct report, not the manager.\n\n- **10 min**: What is on your mind? (Life, blockers, feelings)\n- **10 min**: Team dynamics & process feedback\n- **10 min**: Long-term career goals & growth milestones\n\n*Never use this precious time for ticket status updates that could be read asynchronously in Jira or Slack.*"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Strategic Roadmapping, OKRs & Executive Stakeholder Alignment',
                'slug' => 'strategic-roadmapping-okrs',
                'description' => 'Translate executive strategy into quarterly execution. Master Objectives & Key Results (OKRs), outcome-based roadmaps, managing executive expectations, and communicating business ROI.',
                'price' => 49.00,
                'topic' => 'Engineering Leadership & Management',
                'target_audience' => 'VPs, Heads of Product, Directors, Chief of Staff',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Crafting Measurable OKRs',
                        'description' => 'Connect ambitious qualitative objectives with rigorous quantitative metrics.',
                        'lessons' => [
                            [
                                'title' => 'Output vs. Outcome OKRs',
                                'duration_minutes' => 20,
                                'content' => "# Output vs. Outcome in OKRs\n\n- **Bad (Output)**: *\"Launch 5 new microservices in Q3.\"* (Building something that no one uses is not success).\n- **Good (Outcome)**: *\"Reduce checkout latency from 850ms to 120ms to increase European payment conversion by 3.5%.\"*"
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // TRACK 4: Marketing, Growth & Sales (6 new)
            // ==========================================
            [
                'title' => 'Modern Digital Marketing Fundamentals & Brand Strategy',
                'slug' => 'modern-marketing-fundamentals',
                'description' => 'The complete playbook for modern digital marketing. Learn brand positioning, consumer psychology, multi-channel marketing funnels (TOFU/MOFU/BOFU), and attribution modeling.',
                'price' => 35.00,
                'topic' => 'Marketing & Growth',
                'target_audience' => 'Founders, general marketers, brand managers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'The Marketing Funnel & Customer Journey',
                        'description' => 'Structure acquisition from initial awareness to loyal advocacy.',
                        'lessons' => [
                            [
                                'title' => 'TOFU, MOFU, and BOFU Channel Alignment',
                                'duration_minutes' => 20,
                                'content' => "# Marketing Funnel Architecture\n\n- **Top of Funnel (TOFU)**: Brand awareness, organic video, thought leadership articles.\n- **Middle of Funnel (MOFU)**: Comparison guides, webinars, lead magnets, case studies.\n- **Bottom of Funnel (BOFU)**: Retargeting ads, free trial onboarding, live product demos, ROI calculators."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Google Ads & Search Marketing (SEM): High-Intent Acquisition',
                'slug' => 'google-ads-search-marketing',
                'description' => 'Capture high-intent commercial searchers. Master Google Ads Search campaigns, keyword match types (Broad/Phrase/Exact), Quality Score optimization, bid strategies (tCPA, tROAS), and negative keywords.',
                'price' => 45.00,
                'topic' => 'Marketing & Growth',
                'target_audience' => 'Paid acquisition specialists, growth leads, agency media buyers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Campaign Structure & Quality Score',
                        'description' => 'Lower your cost-per-click (CPC) by maximizing ad relevance.',
                        'lessons' => [
                            [
                                'title' => 'The 3 Pillars of Google Quality Score',
                                'duration_minutes' => 20,
                                'content' => "# The 3 Pillars of Google Quality Score\n\n1. **Expected Click-Through Rate (CTR)**: Historical likelihood of clicks.\n2. **Ad Relevance**: Alignment between user query and ad copy headline.\n3. **Landing Page Experience**: Page speed, mobile responsiveness, and matching message consistency."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Meta Ads & Paid Social Scaling: Creatives, CBO & Retargeting',
                'slug' => 'meta-ads-paid-social-scaling',
                'description' => 'Scale Facebook and Instagram ads profitably. Learn creative testing methodologies, Campaign Budget Optimization (CBO), Conversions API (CAPI), and building high-converting video hooks.',
                'price' => 45.00,
                'topic' => 'Marketing & Growth',
                'target_audience' => 'D2C marketers, B2B SaaS growth leads, e-commerce managers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Creative Velocity & Iterative Ad Testing',
                        'description' => 'Why creatives are your primary targeting in modern Meta advertising.',
                        'lessons' => [
                            [
                                'title' => 'The 3-Second Hook Framework',
                                'duration_minutes' => 20,
                                'content' => "# The 3-Second Hook Framework\n\nWith short-form video, 80% of viewers scroll past within 3 seconds.\n\n- **Pattern Interrupt**: Visually striking opening or unexpected movement.\n- **Address the Agony**: Highlight the precise problem immediately.\n- **The Transformation**: Show the before vs. after outcome."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Technical SEO & Content Architecture: Core Web Vitals & Growth',
                'slug' => 'technical-seo-organic-growth',
                'description' => 'Drive sustainable organic search traffic. Master semantic HTML, schema.org structured data, crawl budget optimization, canonicalization, Core Web Vitals (LCP, INP, CLS), and topical clusters.',
                'price' => 49.00,
                'topic' => 'Marketing & Growth',
                'target_audience' => 'Technical SEO managers, frontend engineers, content strategists',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Core Web Vitals & Search Engine Crawling',
                        'description' => 'Optimize site speed and indexing for modern search algorithms.',
                        'lessons' => [
                            [
                                'title' => 'Optimizing Largest Contentful Paint (LCP) and INP',
                                'duration_minutes' => 25,
                                'content' => "# Core Web Vitals Engineering\n\n- **LCP (Largest Contentful Paint)**: Must be $\\le 2.5\\text{s}$. Preload hero images and avoid render-blocking CSS.\n- **INP (Interaction to Next Paint)**: Must be $\\le 200\\text{ms}$. Defer non-critical JavaScript to keep the main thread responsive.\n- **CLS (Cumulative Layout Shift)**: Must be $\\le 0.1$. Explicitly define `width` and `height` on images and embeds."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Product-Led Growth (PLG): Activation, Onboarding & Viral Loops',
                'slug' => 'product-led-growth-funnel-opt',
                'description' => 'Transform your software into your primary customer acquisition engine. Master Time-to-Value (TTV), product qualification (PQLs), viral loops, freemium paywalls, and retention cohort analytics.',
                'price' => 59.00,
                'topic' => 'Marketing & Growth',
                'target_audience' => 'Product managers, founders, growth engineers',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Frictionless Activation & Time-to-Value (TTV)',
                        'description' => 'Guide new signups to the \"Aha!\" moment within minutes.',
                        'lessons' => [
                            [
                                'title' => 'Eliminating Onboarding Friction',
                                'duration_minutes' => 20,
                                'content' => "# Minimizing Time-to-Value (TTV)\n\nNever force users through a 15-step setup wizard before they experience core value.\n\n- Allow instant demo data exploration.\n- Defer mandatory email verification until critical save actions.\n- Provide one-click templates so the workspace is never an intimidating blank slate."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'B2B Enterprise Sales: Discovery Calls, Demos & Closing Deals',
                'slug' => 'b2b-enterprise-sales-closing',
                'description' => 'Close high-ticket enterprise contracts. Master MEDDPICC qualification, consultative discovery questions, tailoring software demos to executive buyers, procurement negotiations, and closing.',
                'price' => 59.00,
                'topic' => 'Marketing & Growth',
                'target_audience' => 'Account executives, sales engineers, founders doing enterprise sales',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'The MEDDPICC Enterprise Framework',
                        'description' => 'Qualify multi-thousand euro enterprise opportunities rigorously.',
                        'lessons' => [
                            [
                                'title' => 'Identifying the Economic Buyer & Champion',
                                'duration_minutes' => 20,
                                'content' => "# The MEDDPICC Framework\n\n- **M**etrics: Quantified business impact\n- **E**conomic Buyer: Who has the ultimate veto and budget authority\n- **D**ecision Criteria: Formal technical and business requirements\n- **D**ecision Process: Procurement, legal, and security review steps\n- **P**aper Process: Legal approvals and signature mechanics\n- **I**dentify Pain: Cost of doing nothing\n- **C**hampion: Internal advocate with power and vested interest\n- **C**ompetition: Alternative solutions"
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // TRACK 5: Corporate Finance & Economics (6 new)
            // ==========================================
            [
                'title' => 'Financial Literacy & Managerial Accounting: P&L, Balance & Cash Flow',
                'slug' => 'financial-literacy-managerial-accounting',
                'description' => 'Master the three fundamental financial statements. Learn accrual vs. cash accounting, EBITDA, working capital, gross margin analysis, and how to read public corporate annual reports.',
                'price' => 39.00,
                'topic' => 'Finance & Corporate Valuation',
                'target_audience' => 'Managers, founders, team leads, investors',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'The Three Financial Statements & Their Interconnections',
                        'description' => 'Understand how revenue turns into cash on the balance sheet.',
                        'lessons' => [
                            [
                                'title' => 'P&L vs Balance Sheet vs Cash Flow Statement',
                                'duration_minutes' => 25,
                                'content' => "# The 3 Financial Statements\n\n1. **Income Statement (P&L)**: Revenue, Cost of Goods Sold (COGS), Gross Profit, Operating Expenses, Net Income over a period.\n2. **Balance Sheet**: Assets = Liabilities + Shareholders' Equity at a specific moment in time.\n3. **Cash Flow Statement**: Cash from Operations, Cash from Investing, and Cash from Financing. *Remember: Profit is an opinion, but Cash is a fact!*"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'SaaS Unit Economics & Cohort Analysis: CAC, LTV, NRR & Churn',
                'slug' => 'saas-unit-economics-cohort-retention',
                'description' => 'The definitive guide to software business metrics. Master Net Revenue Retention (NRR), Logo Churn vs. Dollar Churn, Magic Number, CAC Payback Period, and cohort retention decay curves.',
                'price' => 59.00,
                'topic' => 'Finance & Corporate Valuation',
                'target_audience' => 'SaaS founders, CFOs, financial analysts, product leads',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Net Revenue Retention (NRR) & Expansion Mechanics',
                        'description' => 'Why world-class SaaS businesses grow even with zero new acquisitions.',
                        'lessons' => [
                            [
                                'title' => 'Calculating and Optimizing NRR Above 120%',
                                'duration_minutes' => 25,
                                'content' => "# Net Revenue Retention (NRR)\n\n$$\\text{NRR} = \\frac{\\text{Starting ARR} + \\text{Expansion} - \\text{Contraction} - \\text{Churn}}{\\text{Starting ARR}} \\times 100\\%$$\n\nAn NRR of 125% means that even if the sales team signs zero new logos next year, the company grows 25% purely from existing accounts expanding their seat count or tier usage."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Startup Fundraising & Venture Capital: Term Sheets & Cap Tables',
                'slug' => 'startup-fundraising-venture-capital',
                'description' => 'Navigate seed to Series A fundraising with confidence. Master SAFEs vs. Priced Rounds, liquidation preferences, anti-dilution clauses, vesting schedules, and modeling dilution across rounds.',
                'price' => 69.00,
                'topic' => 'Finance & Corporate Valuation',
                'target_audience' => 'Founders, angel investors, startup CFOs, venture builders',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Deciphering the VC Term Sheet',
                        'description' => 'Protect your company from predatory terms and unfavorable governance.',
                        'lessons' => [
                            [
                                'title' => 'Liquidation Preferences & Board Control',
                                'duration_minutes' => 25,
                                'content' => "# Term Sheet Critical Clauses\n\n- **1x Non-Participating Preference**: Standard and fair. Investors get their investment back first OR convert to common stock.\n- **Participating Preferred (Double Dip)**: Dangerous for founders. Investors take their capital back AND participate proportionally in remaining proceeds.\n- **Protective Provisions**: Veto rights over future financing, M&A, or executive hiring."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'M&A and Leveraged Buyouts (LBO): Financial Modeling & Due Diligence',
                'slug' => 'mergers-acquisitions-lbo-modeling',
                'description' => 'Master institutional private equity and corporate acquisitions. Build dynamic LBO models with debt schedules, calculate returns (IRR and MoIC), and conduct rigorous financial and legal due diligence.',
                'price' => 89.00,
                'topic' => 'Finance & Corporate Valuation',
                'target_audience' => 'Investment bankers, PE associates, corporate development executives',
                'estimated_hours' => 9,
                'modules' => [
                    [
                        'title' => 'The LBO Mechanics: Debt Tranches & Free Cash Flow Sweep',
                        'description' => 'Structure senior secured debt, mezzanine financing, and equity contributions.',
                        'lessons' => [
                            [
                                'title' => 'Calculating Equity Value and Target Returns',
                                'duration_minutes' => 30,
                                'content' => "# Leveraged Buyout (LBO) Architecture\n\nAn LBO acquires a stable, cash-flow-generating enterprise using significant debt (60%-80%), using the target company's cash flows to pay down the debt over 5 years.\n\nKey PE hurdles:\n- **IRR (Internal Rate of Return)**: Typically target 20%-25%+\n- **MoIC (Multiple on Invested Capital)**: Target 2.0x to 3.0x return over 5 years."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'European B2B Invoicing & Tax Compliance: Peppol BIS 3.0 & UBL 2.1',
                'slug' => 'peppol-ubl-b2b-invoicing-compliance',
                'description' => 'Implement mandatory European electronic invoicing standards. Master Peppol Network architecture, OASIS UBL 2.1 XML specifications, VAT compliance, and automated ERP integrations.',
                'price' => 49.00,
                'topic' => 'Finance & Corporate Valuation',
                'target_audience' => 'Fintech developers, enterprise architects, corporate tax accountants',
                'estimated_hours' => 5,
                'modules' => [
                    [
                        'title' => 'Peppol BIS 3.0 & 4-Corner Architecture',
                        'description' => 'How European governments and enterprise ERPs exchange structured e-invoices.',
                        'lessons' => [
                            [
                                'title' => 'The UBL 2.1 XML Invoice Anatomy',
                                'duration_minutes' => 20,
                                'content' => "# Peppol UBL 2.1 XML Schema\n\n```xml\n<Invoice xmlns=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\">\n  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>\n  <cbc:ID>INV-2026-0042</cbc:ID>\n  <cbc:IssueDate>2026-09-10</cbc:IssueDate>\n  <cac:AccountingSupplierParty>...</cac:AccountingSupplierParty>\n  <cac:LegalMonetaryTotal>\n    <cbc:PayableAmount currencyID=\"EUR\">1490.00</cbc:PayableAmount>\n  </cac:LegalMonetaryTotal>\n</Invoice>\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Commercial Law, IP Protection & SaaS Master Services Agreements',
                'slug' => 'commercial-law-saas-agreements',
                'description' => 'Protect your intellectual property and de-risk contracts. Master Master Services Agreements (MSAs), Service Level Agreements (SLAs), Data Processing Agreements (GDPR DPAs), and limitation of liability clauses.',
                'price' => 49.00,
                'topic' => 'Finance & Corporate Valuation',
                'target_audience' => 'Founders, legal counsels, enterprise sales reps',
                'estimated_hours' => 5,
                'modules' => [
                    [
                        'title' => 'The Anatomy of a Modern B2B SaaS MSA',
                        'description' => 'Draft fair contracts that protect intellectual property while closing smoothly.',
                        'lessons' => [
                            [
                                'title' => 'Limitation of Liability & Indemnification Clauses',
                                'duration_minutes' => 20,
                                'content' => "# Key SaaS Contract Clauses\n\n- **Limitation of Liability**: Typically capped at 12 months of fees paid by the client.\n- **IP Ownership**: The vendor retains all underlying code and algorithms; the client retains ownership of their submitted data.\n- **GDPR DPA**: Mandatory standard contractual clauses governing data storage location and breach notifications."
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // TRACK 6: Backend & Distributed Systems (6 new)
            // ==========================================
            [
                'title' => 'Programming in Go: Syntax, Concurrency, Channels & Goroutines',
                'slug' => 'golang-syntax-concurrency-basics',
                'description' => 'The ultimate introduction to Go (Golang). Learn idiomatic syntax, structs and interfaces, memory management, error handling without exceptions, and CSP concurrency with goroutines and channels.',
                'price' => 39.00,
                'topic' => 'Distributed Systems & Go',
                'target_audience' => 'Software engineers transitioning to Go, backend developers',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Go Fundamentals & Idiomatic Design',
                        'description' => 'Master interfaces, pointers, and explicit error handling.',
                        'lessons' => [
                            [
                                'title' => 'Implicit Interfaces and Composition over Inheritance',
                                'duration_minutes' => 20,
                                'content' => "# Idiomatic Go Interfaces\n\nIn Go, interfaces are satisfied **implicitly**. If a struct implements the methods, it implements the interface without any `implements` keyword.\n\n```go\ntype Reader interface {\n    Read(p []byte) (n int, err error)\n}\n```"
                            ]
                        ]
                    ],
                    [
                        'title' => 'Goroutines, Channels & Select Statements',
                        'description' => 'Harness Go\'s lightweight concurrency primitives.',
                        'lessons' => [
                            [
                                'title' => 'Buffered vs Unbuffered Channels & Deadlock Prevention',
                                'duration_minutes' => 25,
                                'content' => "# Go Concurrency Primitives\n\n```go\nfunc Worker(ctx context.Context, jobs <-chan int, results chan<- int) {\n    for {\n        select {\n        case <-ctx.Done():\n            return\n        case job, ok := <-jobs:\n            if !ok { return }\n            results <- job * 2\n        }\n    }\n}\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Modern Backend Engineering with Laravel 12 & High-Concurrency PHP 8.4',
                'slug' => 'modern-backend-laravel-php84',
                'description' => 'Build bulletproof enterprise backends. Learn modern PHP 8.4 property hooks and JIT, Laravel 12 architecture, asynchronous queue workers with Redis, transaction isolation, and Inertia.js integration.',
                'price' => 49.00,
                'topic' => 'Web & Backend Engineering',
                'target_audience' => 'Fullstack and backend developers, PHP and Laravel engineers',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'PHP 8.4 Hooks & High-Throughput Laravel Queues',
                        'description' => 'Optimize background jobs and handle millions of tasks reliably.',
                        'lessons' => [
                            [
                                'title' => 'Idempotent Queued Jobs with Atomic Redis Locks',
                                'duration_minutes' => 25,
                                'content' => "# Idempotent Queued Jobs in Laravel\n\nTo prevent race conditions during high concurrency, utilize atomic cache locks:\n\n```php\npublic function handle(): void\n{\n    Redis::funnel('process-order:'.\$this->orderId)\n        ->limit(1)\n        ->then(function () {\n            // Safe critical section execution\n        });\n}\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Rust Systems Programming: Memory Safety, Lifetimes & Network Async',
                'slug' => 'rust-systems-async-networking',
                'description' => 'Master systems programming without a garbage collector. Learn Rust\'s borrow checker, ownership, lifetimes, fearless concurrency with Tokio, and building blazingly fast network services.',
                'price' => 69.00,
                'topic' => 'Systems Programming & Rust',
                'target_audience' => 'Backend engineers, C/C++ developers, systems architects',
                'estimated_hours' => 10,
                'modules' => [
                    [
                        'title' => 'Ownership, Borrowing & Lifetimes',
                        'description' => 'How Rust guarantees memory safety at compile time without runtime overhead.',
                        'lessons' => [
                            [
                                'title' => 'The Borrow Checker and Mutable Aliasing Rules',
                                'duration_minutes' => 25,
                                'content' => "# Rust Ownership Rules\n\n1. Each value in Rust has an owner.\n2. There can only be one owner at a time.\n3. When the owner goes out of scope, the value is dropped.\n\n**Borrowing Rule:** You may have either *one mutable reference* OR *any number of immutable references*, but never both simultaneously!"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'PostgreSQL Deep Dive: Indexing, Query Plans, Partitioning & ACID',
                'slug' => 'postgresql-internals-indexing-acid',
                'description' => 'Become a database expert. Master EXPLAIN ANALYZE, B-Tree vs. GIN/BRIN indexes, write-ahead logging (WAL), table partitioning, connection pooling (PgBouncer), and tuning for millions of rows.',
                'price' => 59.00,
                'topic' => 'Database Architecture & Cache',
                'target_audience' => 'Database administrators, backend architects, software engineers',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Query Plan Optimization & EXPLAIN ANALYZE',
                        'description' => 'Diagnose slow queries, index scans, and sequential table scans.',
                        'lessons' => [
                            [
                                'title' => 'Reading Query Execution Plans & Index Selection',
                                'duration_minutes' => 25,
                                'content' => "# PostgreSQL EXPLAIN (ANALYZE, BUFFERS)\n\nLook out for:\n- `Seq Scan`: Full table scan when an index was expected.\n- `Rows Removed by Filter`: Shows high volume of discarded rows before returning results.\n- `Buffers: shared hit vs read`: High `read` indicates disk I/O bottlenecks."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Event-Driven Systems: Apache Kafka, Event Sourcing & CQRS',
                'slug' => 'event-driven-systems-kafka',
                'description' => 'Design resilient asynchronous enterprise platforms. Master Kafka topic partitioning, consumer groups, exactly-once semantics, schema registries (Avro/Protobuf), and Event Sourcing with CQRS.',
                'price' => 79.00,
                'topic' => 'Distributed Systems & Go',
                'target_audience' => 'Distributed systems architects, staff software engineers',
                'estimated_hours' => 10,
                'modules' => [
                    [
                        'title' => 'Kafka Architecture & Partitioning Strategies',
                        'description' => 'Ensure strictly ordered event streams at immense horizontal scale.',
                        'lessons' => [
                            [
                                'title' => 'Partition Key Selection & Consumer Rebalancing',
                                'duration_minutes' => 25,
                                'content' => "# Kafka Partitioning Mechanics\n\nKafka guarantees message ordering **only within a single partition**.\n- Choose partition keys carefully (e.g. `customer_id` or `order_id`) to ensure events for that entity land in the same partition.\n- Avoid high cardinality random UUID partition keys when ordering matters."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Microservices Resiliency: gRPC, Circuit Breakers & Distributed Tracing',
                'slug' => 'microservices-resiliency-grpc-tracing',
                'description' => 'Prevent cascading service failures in production. Master gRPC protocol buffers, Netflix-style circuit breakers, exponential backoff with jitter, and OpenTelemetry distributed tracing.',
                'price' => 69.00,
                'topic' => 'Cloud & Microservices',
                'target_audience' => 'Site reliability engineers, backend architects, microservices leads',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Circuit Breaker Pattern & Fault Tolerance',
                        'description' => 'Isolate failing downstream services to keep core platforms alive.',
                        'lessons' => [
                            [
                                'title' => 'The Three States of Circuit Breakers: Closed, Open, Half-Open',
                                'duration_minutes' => 25,
                                'content' => "# Circuit Breaker States\n\n- **Closed**: Normal operations. Requests pass through.\n- **Open**: When failure rate exceeds threshold (e.g. 50%), circuit opens immediately. Requests fail fast without hitting dying downstream service.\n- **Half-Open**: After cool-down period, a small sample of canary requests are tested. If successful, circuit resets to Closed."
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // TRACK 7: AI Engineering & LLMs (7 new)
            // ==========================================
            [
                'title' => 'AI Literacy & Prompt Engineering: Structured Thinking with LLMs',
                'slug' => 'ai-literacy-prompt-engineering',
                'description' => 'Unlock the full power of frontier language models. Master few-shot prompting, Chain-of-Thought (CoT), system instruction tuning, structured markdown prompting, and avoiding hallucinations.',
                'price' => 29.00,
                'topic' => 'Generative AI & Agents',
                'target_audience' => 'Knowledge workers, software developers, managers, analysts',
                'estimated_hours' => 5,
                'modules' => [
                    [
                        'title' => 'Prompt Engineering Frameworks',
                        'description' => 'Move from vague questions to predictable, high-precision results.',
                        'lessons' => [
                            [
                                'title' => 'Role, Objective, Context, Constraints (ROCC) Framework',
                                'duration_minutes' => 20,
                                'content' => "# The ROCC Prompting Framework\n\n1. **Role**: Who is the AI? (e.g. *\"You are a principal cloud security architect\"*)\n2. **Objective**: What is the exact task? (*\"Audit this Terraform snippet for public S3 buckets\"*)\n3. **Context**: Relevant background and assumptions.\n4. **Constraints**: Formatting rules (*\"Output valid JSON only. Never include conversational filler\"*)."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'OpenAI API & Function Calling: Structured JSON & Tools Integration',
                'slug' => 'openai-api-function-calling',
                'description' => 'Build programmatic AI applications. Master OpenAI Responses API, Function Calling, Pydantic/Zod structured outputs, token streaming, and executing client-side tool loops.',
                'price' => 49.00,
                'topic' => 'Generative AI & Agents',
                'target_audience' => 'Fullstack engineers, Python/TypeScript developers building AI features',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Deterministic JSON Schemas with Function Calling',
                        'description' => 'Force language models to return 100% valid, typed payloads.',
                        'lessons' => [
                            [
                                'title' => 'Defining JSON Schemas and Parsing Tool Calls',
                                'duration_minutes' => 25,
                                'content' => "# Deterministic JSON Structured Outputs\n\n```python\nresponse = client.beta.chat.completions.parse(\n    model=\"gpt-4o\",\n    messages=[\n        {\"role\": \"system\", \"content\": \"Extract customer lead information.\"},\n        {\"role\": \"user\", \"content\": \"Alice Smith from Acme Corp, email alice@acme.com\"}\n    ],\n    response_format=LeadExtractionModel,\n)\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Vector Databases & Semantic Search: Pinecone, Qdrant & Hybrid Search',
                'slug' => 'vector-databases-semantic-search',
                'description' => 'Power enterprise search and RAG systems. Master embedding models, distance metrics (Cosine vs. Dot Product), approximate nearest neighbors (HNSW), hybrid search with BM25, and reranking.',
                'price' => 59.00,
                'topic' => 'Generative AI & Agents',
                'target_audience' => 'AI engineers, search architects, data engineers',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Vector Embeddings & HNSW Indexing',
                        'description' => 'How high-dimensional vectors represent semantic concepts.',
                        'lessons' => [
                            [
                                'title' => 'Hybrid Search: Combining BM25 Keyword Search with Dense Vectors',
                                'duration_minutes' => 25,
                                'content' => "# Hybrid Search Architecture\n\nPure dense vector search can struggle with exact acronyms, part numbers, or rare names.\n- **Dense Embeddings**: Capture broad semantic intent and conceptual meaning.\n- **Sparse BM25**: Captures exact keyword token matches.\n- **Reciprocal Rank Fusion (RRF)**: Merges both lists for optimal search precision."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Fine-Tuning Open Source LLMs: LoRA, QLoRA, Unsloth & Evaluation',
                'slug' => 'fine-tuning-llms-lora-unsloth',
                'description' => 'Train custom models on your own domain data. Master Low-Rank Adaptation (LoRA), 4-bit quantization (QLoRA), dataset formatting (ChatML), Axolotl/Unsloth workflows, and benchmark evaluation.',
                'price' => 79.00,
                'topic' => 'Generative AI & Agents',
                'target_audience' => 'Machine learning engineers, AI researchers, backend developers',
                'estimated_hours' => 9,
                'modules' => [
                    [
                        'title' => 'LoRA & Parameter-Efficient Fine-Tuning (PEFT)',
                        'description' => 'Fine-tune 70B parameter models on consumer GPUs by decomposing weight matrices.',
                        'lessons' => [
                            [
                                'title' => 'Understanding Low-Rank Decomposition ($W + A \\times B$)',
                                'duration_minutes' => 25,
                                'content' => "# Low-Rank Adaptation (LoRA)\n\nInstead of updating all billions of parameters in a pretrained weight matrix \$W_0, LoRA freezes \$W_0 and trains two smaller low-rank matrices \$A and \$B:\n\n\$\$W = W_0 + \\Delta W = W_0 + B \\times A\$\$\n\nThis reduces trainable parameters by **99%** while preserving core model intelligence."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Python for Data Science & Machine Learning Foundations',
                'slug' => 'python-data-science-machine-learning',
                'description' => 'The essential math and coding toolkit for modern data science. Master NumPy vectorization, Pandas dataframes, Matplotlib/Seaborn visualizations, and Scikit-Learn regression and clustering.',
                'price' => 45.00,
                'topic' => 'Data Science & Machine Learning',
                'target_audience' => 'Aspiring data scientists, analysts, programmers entering ML',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'NumPy Vectorization & Pandas Data Cleaning',
                        'description' => 'Eliminate slow Python loops using vectorized array operations.',
                        'lessons' => [
                            [
                                'title' => 'Vectorized Operations vs. Python Loops',
                                'duration_minutes' => 20,
                                'content' => "# NumPy Vectorization\n\nNumPy performs array calculations in pre-compiled C loops without Python overhead:\n\n```python\nimport numpy as np\n\n# Fast vectorized dot product\narr = np.random.randn(1_000_000)\nresult = np.sum(arr ** 2) # Runs 50x faster than pure Python for-loop\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Deep Learning & Neural Networks: PyTorch, Vision & Transformers',
                'slug' => 'deep-learning-neural-networks-pytorch',
                'description' => 'Build modern neural architectures from scratch. Master PyTorch tensors and autograd, Convolutional Neural Networks (CNNs), attention mechanisms, and Transformer encoders and decoders.',
                'price' => 69.00,
                'topic' => 'Data Science & Machine Learning',
                'target_audience' => 'ML engineers, software developers, STEM graduates',
                'estimated_hours' => 10,
                'modules' => [
                    [
                        'title' => 'PyTorch Autograd & The Self-Attention Mechanism',
                        'description' => 'Implement multi-head self-attention step by step.',
                        'lessons' => [
                            [
                                'title' => 'Scaled Dot-Product Attention ($Q, K, V$)',
                                'duration_minutes' => 30,
                                'content' => "# The Attention Equation\n\n\$\$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V\$\$\n\n- **Queries (\$Q\$)**: What each token is looking for.\n- **Keys (\$K\$)**: What each token offers.\n- **Values (\$V\$)**: The actual semantic information passed forward."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'AI Safety, Guardrails & Production LLMOps: Latency & Cost Optimization',
                'slug' => 'ai-safety-guardrails-llmops',
                'description' => 'Safely operate large language models in enterprise production. Master prompt injection defense, PII masking, semantic caching with Redis, token budget monitoring, and automated red-teaming.',
                'price' => 69.00,
                'topic' => 'Generative AI & Agents',
                'target_audience' => 'AI platform leads, security engineers, DevOps architects',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Prompt Injection Defense & Guardrail Ensembles',
                        'description' => 'Protect AI agents from adversarial user prompts and data exfiltration.',
                        'lessons' => [
                            [
                                'title' => 'Dual-Model Architecture & Semantic Cache',
                                'duration_minutes' => 25,
                                'content' => "# Dual-Model Guardrail Architecture\n\n1. **Guardrail Evaluator**: Fast, lightweight classifier (e.g. Llama-Guard) screens inputs for jailbreak attempts.\n2. **Semantic Cache**: If a verified identical query was answered within 24h, return cached response with zero LLM API cost.\n3. **Output Sanitizer**: Redacts accidental API keys, credit cards, or internal system prompts."
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // TRACK 8: Cloud, DevOps & Security (7 new)
            // ==========================================
            [
                'title' => 'Linux Administration, Bash Scripting & System Internals',
                'slug' => 'linux-administration-bash-internals',
                'description' => 'The cornerstone of server operations. Master Linux file permissions (chmod/chown), process management (systemd, journalctl), networking (netstat, iptables), and writing production-ready Bash scripts.',
                'price' => 35.00,
                'topic' => 'Cloud & DevOps Infrastructure',
                'target_audience' => 'DevOps novices, backend developers, system administrators',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Linux Process Management & Systemd Services',
                        'description' => 'Deploy and supervise daemons with automated restarts and logging.',
                        'lessons' => [
                            [
                                'title' => 'Writing a Production Systemd Unit File',
                                'duration_minutes' => 20,
                                'content' => "# Production Systemd Service\n\n```ini\n[Unit]\nDescription=NexusEd Core API Worker\nAfter=network.target redis.service\n\n[Service]\nType=simple\nUser=www-data\nWorkingDirectory=/var/www/nexus-ed\nExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3\nRestart=always\nRestartSec=5s\n\n[Install]\nWantedBy=multi-user.target\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Docker & Container Internals: Images, Multi-Stage & Networking',
                'slug' => 'docker-containers-multistage-networking',
                'description' => 'Containerize applications like a pro. Master Docker multi-stage builds, rootless containers, Linux cgroups & namespaces, container networking (bridge/host/overlay), and minimizing attack surfaces.',
                'price' => 39.00,
                'topic' => 'Cloud & DevOps Infrastructure',
                'target_audience' => 'Software developers, DevOps engineers, site reliability engineers',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Optimized Multi-Stage Dockerfiles',
                        'description' => 'Produce tiny, secure production container images under 50MB.',
                        'lessons' => [
                            [
                                'title' => 'Multi-Stage Builds: Separating Build Tools from Runtime',
                                'duration_minutes' => 20,
                                'content' => "# Multi-Stage Dockerfile Pattern\n\n```dockerfile\n# Stage 1: Build\nFROM golang:1.24-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN CGO_ENABLED=0 go build -ldflags=\"-s -w\" -o server .\n\n# Stage 2: Minimal Distroless / Scratch Runtime\nFROM scratch\nCOPY --from=builder /app/server /server\nEXPOSE 8080\nENTRYPOINT [\"/server\"]\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Advanced Kubernetes Operations: GitOps with ArgoCD & Helm 3',
                'slug' => 'advanced-kubernetes-argocd-gitops',
                'description' => 'Operate production Kubernetes clusters with zero manual kubectl commands. Master GitOps reconciliation with ArgoCD, Helm 3 chart authoring, Custom Resource Definitions (CRDs), and Canary rollouts.',
                'price' => 69.00,
                'topic' => 'Cloud & DevOps Infrastructure',
                'target_audience' => 'Platform engineers, SREs, senior DevOps engineers',
                'estimated_hours' => 9,
                'modules' => [
                    [
                        'title' => 'The GitOps Paradigm & ArgoCD Synchronization',
                        'description' => 'Treat Git repositories as the single source of truth for all cluster state.',
                        'lessons' => [
                            [
                                'title' => 'Declarative Application Manifests and Auto-Healing',
                                'duration_minutes' => 25,
                                'content' => "# ArgoCD Application Resource\n\n```yaml\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: production-microservices\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: 'https://github.com/nexused/infrastructure.git'\n    targetRevision: HEAD\n    path: k8s/production\n  destination:\n    server: 'https://kubernetes.default.svc'\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Infrastructure as Code: Terraform Enterprise & Modular Cloud Design',
                'slug' => 'infrastructure-as-code-terraform',
                'description' => 'Provision multi-cloud infrastructure safely. Master Terraform state management, remote backends with S3/DynamoDB locking, Terragrunt DRY architecture, and writing reusable cloud modules.',
                'price' => 59.00,
                'topic' => 'Cloud & DevOps Infrastructure',
                'target_audience' => 'Cloud architects, DevOps leads, systems engineers',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Terraform State Management & Remote Locking',
                        'description' => 'Prevent concurrent state corruption in distributed engineering teams.',
                        'lessons' => [
                            [
                                'title' => 'State Locking with DynamoDB and S3 Versioning',
                                'duration_minutes' => 25,
                                'content' => "# Terraform Backend Configuration\n\n```hcl\nterraform {\n  backend \"s3\" {\n    bucket         = \"nexus-terraform-state-prod\"\n    key            = \"global/s3/terraform.tfstate\"\n    region         = \"eu-central-1\"\n    dynamodb_table = \"nexus-terraform-locks\"\n    encrypt        = true\n  }\n}\n```"
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'CI/CD Automation: GitHub Actions, Automated Testing & Security Scans',
                'slug' => 'cicd-github-actions-security',
                'description' => 'Ship code to production multiple times a day with total confidence. Master GitHub Actions reusable workflows, matrix testing, Docker layer caching, dependency vulnerability scans, and OIDC AWS auth.',
                'price' => 45.00,
                'topic' => 'Cloud & DevOps Infrastructure',
                'target_audience' => 'DevOps engineers, fullstack developers, QA leads',
                'estimated_hours' => 6,
                'modules' => [
                    [
                        'title' => 'Secure CI/CD Workflows & OIDC Integration',
                        'description' => 'Eliminate long-lived static cloud credentials in CI pipelines.',
                        'lessons' => [
                            [
                                'title' => 'Keyless Cloud Authentication with OpenID Connect (OIDC)',
                                'duration_minutes' => 20,
                                'content' => "# Keyless AWS Auth in GitHub Actions\n\nUsing OIDC, GitHub Actions requests short-lived temporary STS credentials directly from AWS based on repository identity, completely eliminating the risk of leaked permanent `AWS_SECRET_ACCESS_KEY` credentials."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Cybersecurity Fundamentals: Network Defense, OWASP Top 10 & SAST',
                'slug' => 'cybersecurity-network-defense-owasp',
                'description' => 'Defend modern web applications against real-world attacks. Master the OWASP Top 10 (SQLi, SSRF, XSS, IDOR), secure cryptographic hashing, static analysis security testing (SAST), and defense-in-depth.',
                'price' => 49.00,
                'topic' => 'Cybersecurity & Zero-Trust',
                'target_audience' => 'Security engineers, backend developers, system administrators',
                'estimated_hours' => 7,
                'modules' => [
                    [
                        'title' => 'Web Vulnerabilities & The OWASP Top 10',
                        'description' => 'Identify and remediate the most common modern security flaws.',
                        'lessons' => [
                            [
                                'title' => 'Preventing Insecure Direct Object References (IDOR) & SSRF',
                                'duration_minutes' => 25,
                                'content' => "# IDOR & Server-Side Request Forgery (SSRF)\n\n- **IDOR**: Never rely on client-supplied IDs without verifying that the currently authenticated user owns the resource (`Policy::authorize('view', \$order)`).\n- **SSRF**: When fetching remote URLs on behalf of users, strictly validate protocols (HTTP/HTTPS only) and block private IP ranges (127.0.0.1, 10.0.0.0/8, 169.254.169.254 AWS metadata)."
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Zero-Trust Architecture: mTLS, SPIFFE/SPIRE & Identity-Aware Proxy',
                'slug' => 'zero-trust-architecture-mtls',
                'description' => 'Never trust, always verify. Build modern Zero-Trust architectures using mutual TLS (mTLS), cryptographic workload identities with SPIFFE/SPIRE, and identity-aware proxies (BeyondCorp style).',
                'price' => 69.00,
                'topic' => 'Cybersecurity & Zero-Trust',
                'target_audience' => 'Security architects, enterprise infrastructure engineers, CISO teams',
                'estimated_hours' => 8,
                'modules' => [
                    [
                        'title' => 'Cryptographic Workload Identity (SPIFFE/SPIRE)',
                        'description' => 'Replace fragile network IP whitelists with cryptographically verifiable service certificates.',
                        'lessons' => [
                            [
                                'title' => 'Mutual TLS (mTLS) Handshake and SVID Validation',
                                'duration_minutes' => 25,
                                'content' => "# Mutual TLS (mTLS) in Zero-Trust\n\nIn standard TLS, only the server proves its identity to the client.\nIn **mTLS**, both client and server present X.509 certificates to each other during the cryptographic handshake. Every microservice call is authenticated and encrypted end-to-end regardless of network location."
                            ]
                        ]
                    ]
                ]
            ]
        ];
    }
}

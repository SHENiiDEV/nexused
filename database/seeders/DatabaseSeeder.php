<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Company;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizOption;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Billing\B2BInvoiceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Corporate Company
        $company = Company::create([
            'name' => 'Acme Global Technologies GmbH',
            'vat_number' => 'DE389201940',
            'billing_email' => 'billing@acme-global.de',
            'billing_address' => 'Friedrichstraße 200, 10117 Berlin, Germany',
            'country_code' => 'DE',
            'max_seats' => 20,
            'used_seats' => 3,
        ]);

        // 2. Users
        $admin = User::create([
            'name' => 'Mihails Segins (Admin)',
            'email' => 'admin@nexused.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $corporateUser = User::create([
            'name' => 'Elena Rostova (Acme Tech Lead)',
            'email' => 'corporate@nexused.test',
            'password' => Hash::make('password'),
            'role' => 'corporate',
            'company_id' => $company->id,
        ]);

        $student = User::create([
            'name' => 'Alex Vance (Student)',
            'email' => 'student@nexused.test',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        $emp1 = User::create([
            'name' => 'Markus Weber',
            'email' => 'markus.weber@acme-global.de',
            'password' => Hash::make('password'),
            'role' => 'student',
            'company_id' => $company->id,
        ]);

        $emp2 = User::create([
            'name' => 'Sophie Laurent',
            'email' => 'sophie.laurent@acme-global.de',
            'password' => Hash::make('password'),
            'role' => 'student',
            'company_id' => $company->id,
        ]);

        // 3. Courses
        $course1 = Course::create([
            'creator_id' => $admin->id,
            'title' => 'High-Throughput Distributed Systems Architecture in Go',
            'slug' => 'distributed-systems-go',
            'description' => 'Architect resilient distributed architectures with zero single points of failure. Learn practical event streaming with Kafka, Raft consensus, CQRS/event sourcing, and low-latency Go concurrency patterns.',
            'price' => 89.00,
            'status' => 'published',
            'generation_step' => 'Published & Verified',
            'generation_progress' => 100,
            'topic' => 'Distributed Systems & Go',
            'target_audience' => 'Senior Backend Engineers, Cloud Architects',
            'estimated_hours' => 8,
        ]);

        $course2 = Course::create([
            'creator_id' => $admin->id,
            'title' => 'Production AI Engineering: Autonomous Agents & RAG',
            'slug' => 'production-ai-agents',
            'description' => 'Build high-reliability production AI applications. Master OpenAI structured outputs, vector indexing, evaluation benchmarks, multi-agent orchestration, and guardrails for mission-critical SaaS.',
            'price' => 149.00,
            'status' => 'published',
            'generation_step' => 'Published & Verified',
            'generation_progress' => 100,
            'topic' => 'Generative AI & Agents',
            'target_audience' => 'AI Engineers, Full-Stack Architects',
            'estimated_hours' => 10,
        ]);

        $course3 = Course::create([
            'creator_id' => $admin->id,
            'title' => 'Cloud-Native Microservices with Kubernetes & Envoy',
            'slug' => 'cloud-native-microservices',
            'description' => 'Production hardening for modern cloud workloads. Service meshes with Envoy, zero-trust mTLS security, distributed tracing with OpenTelemetry, and GitOps delivery pipelines.',
            'price' => 49.00,
            'status' => 'published',
            'generation_step' => 'Published & Verified',
            'generation_progress' => 100,
            'topic' => 'Cloud & Microservices',
            'target_audience' => 'DevOps Engineers, Platform Teams',
            'estimated_hours' => 6,
        ]);

        // Seed modules and lessons for Course 1
        $this->seedCourseContent($course1);
        $this->seedCourseContent($course2);
        $this->seedCourseContent($course3);

        // 4. Enrollments & Progress
        $allLessonsCourse1 = $course1->modules->flatMap->lessons;

        // Student enrollment in Course 1 with completed first 2 lessons
        $studentEnrollment = Enrollment::create([
            'user_id' => $student->id,
            'course_id' => $course1->id,
            'created_at' => now()->subDays(3),
        ]);

        foreach ($allLessonsCourse1->take(2) as $lesson) {
            LessonProgress::create([
                'user_id' => $student->id,
                'lesson_id' => $lesson->id,
                'is_completed' => true,
                'completed_at' => now()->subDays(1),
            ]);

            // Quiz attempts
            foreach ($lesson->quizzes as $quiz) {
                $correctOpt = $quiz->options->firstWhere('is_correct', true);
                if ($correctOpt) {
                    QuizAttempt::create([
                        'user_id' => $student->id,
                        'quiz_id' => $quiz->id,
                        'quiz_option_id' => $correctOpt->id,
                        'is_correct' => true,
                    ]);
                }
            }
        }

        // Corporate employee 1: completed course 1 and received certificate
        $certCode = 'CERT-NX' . strtoupper(Str::random(8));
        $emp1Enrollment = Enrollment::create([
            'user_id' => $emp1->id,
            'course_id' => $course1->id,
            'company_id' => $company->id,
            'certificate_code' => $certCode,
            'completed_at' => now()->subDays(2),
            'created_at' => now()->subDays(10),
        ]);

        foreach ($allLessonsCourse1 as $lesson) {
            LessonProgress::create([
                'user_id' => $emp1->id,
                'lesson_id' => $lesson->id,
                'is_completed' => true,
                'completed_at' => now()->subDays(2),
            ]);

            foreach ($lesson->quizzes as $quiz) {
                $correctOpt = $quiz->options->firstWhere('is_correct', true);
                if ($correctOpt) {
                    QuizAttempt::create([
                        'user_id' => $emp1->id,
                        'quiz_id' => $quiz->id,
                        'quiz_option_id' => $correctOpt->id,
                        'is_correct' => true,
                    ]);
                }
            }
        }

        // Corporate employee 2: enrolled in course 2
        Enrollment::create([
            'user_id' => $emp2->id,
            'course_id' => $course2->id,
            'company_id' => $company->id,
            'created_at' => now()->subDays(5),
        ]);

        // 5. Transactions & B2B Invoices
        $b2bTxn = Transaction::create([
            'user_id' => $corporateUser->id,
            'company_id' => $company->id,
            'amount' => 1250.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'completed',
            'transaction_ref' => 'TXN-CORP-94821',
            'signature' => hash_hmac('sha256', 'payload_sample', 'nexus_corefy_sec_994821'),
            'metadata' => [
                'type' => 'b2b_license',
                'seats' => 20,
                'course_title' => 'NexusEd Enterprise All-Access Pass',
            ],
            'created_at' => now()->subDays(10),
        ]);

        $b2cTxn = Transaction::create([
            'user_id' => $student->id,
            'course_id' => $course1->id,
            'amount' => 89.00,
            'currency' => 'EUR',
            'payment_gateway' => 'cardaq',
            'status' => 'completed',
            'transaction_ref' => 'TXN-B2C-77412',
            'signature' => hash_hmac('sha256', 'payload_b2c', 'nexus_cardaq_sec_884122'),
            'metadata' => ['type' => 'b2c_course'],
            'created_at' => now()->subDays(3),
        ]);

        // Generate corporate invoice (with Peppol UBL 2.1 XML)
        $invoiceService = new B2BInvoiceService();
        $invoiceService->createInvoice(
            $company,
            $corporateUser,
            $b2bTxn,
            'NexusEd Enterprise Team License (20 Seats)',
            20
        );

        // 6. Audit Logs
        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'course.published',
            'entity_type' => 'Course',
            'entity_id' => $course1->id,
            'payload' => ['title' => $course1->title, 'price' => 89.00],
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(12),
        ]);

        AuditLog::create([
            'user_id' => $corporateUser->id,
            'action' => 'b2b.license_purchased',
            'entity_type' => 'Company',
            'entity_id' => $company->id,
            'payload' => ['seats' => 20, 'amount' => 1250.00, 'gateway' => 'corefy'],
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(10),
        ]);

        AuditLog::create([
            'user_id' => $corporateUser->id,
            'action' => 'seat.allocated',
            'entity_type' => 'User',
            'entity_id' => $emp1->id,
            'payload' => ['employee_email' => $emp1->email, 'course_id' => $course1->id],
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(10),
        ]);

        // 7. Seed Full 63-Course Catalog
        $this->call([
            FullCatalogSeeder::class,
        ]);
    }

    protected function seedCourseContent(Course $course): void
    {
        $modulesData = [
            [
                'title' => 'Core Architecture, Invariants & Foundations',
                'description' => 'Deconstruct the building blocks and concurrency models.',
                'lessons' => [
                    [
                        'title' => 'Mental Models & Invariant Design',
                        'type' => 'text',
                        'duration_minutes' => 15,
                        'content' => $this->getLessonOneMarkdown($course->title),
                    ],
                    [
                        'title' => 'High-Throughput Pipelines & Backpressure',
                        'type' => 'interactive',
                        'duration_minutes' => 20,
                        'content' => $this->getLessonTwoMarkdown($course->title),
                    ],
                ],
            ],
            [
                'title' => 'Production Implementation & Scaling',
                'description' => 'Practical code implementation and zero-downtime patterns.',
                'lessons' => [
                    [
                        'title' => 'Stateful Workflows & Distributed Consensus',
                        'type' => 'text',
                        'duration_minutes' => 25,
                        'content' => $this->getLessonThreeMarkdown($course->title),
                    ],
                ],
            ],
        ];

        $modOrder = 1;
        foreach ($modulesData as $m) {
            $module = Module::create([
                'course_id' => $course->id,
                'title' => $m['title'],
                'description' => $m['description'],
                'order' => $modOrder++,
            ]);

            $lesOrder = 1;
            foreach ($m['lessons'] as $l) {
                $lesson = Lesson::create([
                    'module_id' => $module->id,
                    'title' => $l['title'],
                    'slug' => Str::slug($l['title']) . '-' . Str::random(4),
                    'content' => $l['content'],
                    'type' => $l['type'],
                    'order' => $lesOrder++,
                    'duration_minutes' => $l['duration_minutes'],
                ]);

                // Seed 2 quizzes per lesson
                $this->seedQuizzesForLesson($lesson);
            }
        }
    }

    protected function seedQuizzesForLesson(Lesson $lesson): void
    {
        $q1 = Quiz::create([
            'lesson_id' => $lesson->id,
            'question_text' => "What is the primary benefit of enforcing strict idempotency in '{$lesson->title}'?",
            'explanation' => 'Network retries, queue deadlocks, and dual-deliveries occur continuously in distributed systems. Idempotency ensures that applying an operation multiple times leaves the system in the exact same state as applying it once.',
            'order' => 1,
        ]);

        QuizOption::create(['quiz_id' => $q1->id, 'option_text' => 'It eliminates the need for database TLS encryption.', 'is_correct' => false, 'order' => 1]);
        QuizOption::create(['quiz_id' => $q1->id, 'option_text' => 'It guarantees repeat requests or retry attempts cause zero duplicate mutations.', 'is_correct' => true, 'order' => 2]);
        QuizOption::create(['quiz_id' => $q1->id, 'option_text' => 'It decreases MySQL disk usage by 90%.', 'is_correct' => false, 'order' => 3]);
        QuizOption::create(['quiz_id' => $q1->id, 'option_text' => 'It allows client browsers to bypass CORS security policies.', 'is_correct' => false, 'order' => 4]);

        $q2 = Quiz::create([
            'lesson_id' => $lesson->id,
            'question_text' => 'When processing financial webhooks under high concurrency, why must HMAC signatures be verified BEFORE payload parsing?',
            'explanation' => 'Validating the cryptographic HMAC signature before JSON deserialization prevents malicious actor denial-of-service, payload tampering, and processing of untrusted payloads.',
            'order' => 2,
        ]);

        QuizOption::create(['quiz_id' => $q2->id, 'option_text' => 'To convert webhook JSON into PDF invoices automatically.', 'is_correct' => false, 'order' => 1]);
        QuizOption::create(['quiz_id' => $q2->id, 'option_text' => 'To guarantee message authenticity and reject tampered payloads before allocating compute.', 'is_correct' => true, 'order' => 2]);
        QuizOption::create(['quiz_id' => $q2->id, 'option_text' => 'Because HMAC encryption reduces network latency by 50ms.', 'is_correct' => false, 'order' => 3]);
        QuizOption::create(['quiz_id' => $q2->id, 'option_text' => 'It is only required when running on Windows operating systems.', 'is_correct' => false, 'order' => 4]);
    }

    protected function getLessonOneMarkdown(string $courseTitle): string
    {
        return <<<MARKDOWN
# Mental Models & Invariant Design

Welcome to **{$courseTitle}**. In this opening lecture, we dissect the mental models required to construct robust software systems that survive network partitions, worker crashes, and unanticipated traffic spikes.

> **Fundamental Principle:**
> Assume everything will fail asynchronously: database connections drop, networks partition, and third-party APIs experience transient timeouts. Code for predictable failure rather than optimistic success.

---

## 1. Defining Core System Invariants

A system invariant is a condition that must ALWAYS evaluate to true throughout the lifecycle of every transaction:

```
[ Incoming Request ] ---> ( Guardrail Validation ) ---> [ Atomic State Mutator ]
                                                                |
                                                                v
                                                        [ Verified Audit Log ]
```

### Invariants We Guarantee
1. **Single Source of Truth**: Balance ledger transactions must balance to zero when factoring inputs and outputs.
2. **Deterministic State Transitions**: State can only move forward: `pending` → `completed` OR `pending` → `failed`. Once a state is terminal, no rollback or override is permitted.
3. **Cryptographic Validation**: Ingress payloads must include valid HMAC-SHA256 headers matching the shared merchant secret.

---

## 2. Production Code Walkthrough

Below is a production-grade worker pipeline implementing these principles:

```php
namespace App\Services\Core;

use Illuminate\Support\Facades\DB;
use App\Models\AuditLog;
use Exception;

final class ExecutionPipeline
{
    public function process(string \$reference, float \$amount): bool
    {
        return DB::transaction(function () use (\$reference, \$amount) {
            \$record = DB::table('transactions')
                ->where('transaction_ref', \$reference)
                ->lockForUpdate()
                ->first();

            if (!\$record || \$record->status !== 'pending') {
                throw new Exception("Transaction {\$reference} invalid or already finalized.");
            }

            DB::table('transactions')
                ->where('id', \$record->id)
                ->update([
                    'status' => 'completed',
                    'updated_at' => now(),
                ]);

            AuditLog::create([
                'action' => 'transaction.completed',
                'entity_type' => 'Transaction',
                'entity_id' => \$record->id,
                'payload' => ['amount' => \$amount, 'reference' => \$reference],
            ]);

            return true;
        });
    }
}
```

---

## 3. Checklist for Engineers

- [x] Ensure every database operation is bound within explicit transactions
- [x] Use row-level locking (`lockForUpdate`) on sensitive balance accounts
- [x] Keep write transactions concise (under 25 milliseconds) to avoid lock contention
- [x] Stream structured logs into centralized audit storage

Review these concepts and proceed to the comprehension quiz below!
MARKDOWN;
    }

    protected function getLessonTwoMarkdown(string $courseTitle): string
    {
        return <<<MARKDOWN
# High-Throughput Pipelines & Backpressure

In high-throughput systems, latency degradation usually stems from uncoordinated queue starvation or worker exhaustion. In this lecture, we analyze how to engineer backpressure into message ingestion pipelines.

## 1. Backpressure Mechanics

```
[ Traffic Burst: 10k req/sec ]
              |
              v
     [ Rate Limiter ]
              |
              v
  [ Redis FIFO Stream ] =====> [ Pool of 8 Concurrent Workers ]
                                               |
                                               v
                                    [ SQLite / MySQL Write ]
```

When downstream workers take 50ms to persist an entity, an unconstrained ingestion pipeline will inevitably overwhelm memory limits. Backpressure signals upstream clients to slow down or queue requests with appropriate TTL.

---

## 2. Token Bucket Implementation Pattern

```go
package main

import (
    "context"
    "fmt"
    "time"
)

type RateLimiter struct {
    tokens chan struct{}
}

func NewRateLimiter(rate int) *RateLimiter {
    rl := &RateLimiter{
        tokens: make(chan struct{}, rate),
    }
    go func() {
        ticker := time.NewTicker(time.Second / time.Duration(rate))
        defer ticker.Stop()
        for range ticker.C {
            select {
            case rl.tokens <- struct{}{}:
            default:
            }
        }
    }()
    return rl
}

func (rl *RateLimiter) Wait(ctx context.Context) error {
    select {
    case <-rl.tokens:
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}
```

Proceed to test your understanding on backpressure dynamics in the quiz below.
MARKDOWN;
    }

    protected function getLessonThreeMarkdown(string $courseTitle): string
    {
        return <<<MARKDOWN
# Stateful Workflows & Distributed Consensus

In modern distributed microservices, state coordination cannot rely on centralized memory. This lecture explores consensus mechanisms and saga orchestration.

## 1. The Distributed Saga Pattern

Instead of distributed two-phase commits (2PC) which cause severe locking latency, use choreography or orchestration-based sagas:

```
[ Order Placed ] ---> [ Payment Authorized ] ---> [ Seats Allocated ] ---> [ Invoice Generated ]
       |                      |                          |                         |
       x                      x                          x                         x
[ Compensate Order ] <- [ Refund Payment ] <- [ Deallocate Seats ] <--------------+
```

If seat allocation fails, the saga orchestrator automatically issues compensating transactions (such as issuing a gateway refund) to restore consistency.

---

## 2. Key Architecture Standards

- **Compensating Actions**: Every forward step must have an inverted rollback operation.
- **Outbox Pattern**: Never publish message bus events in the same HTTP handler without an atomic outbox table.
- **European E-Invoicing**: High-volume B2B systems must emit machine-readable UBL 2.1 invoices for cross-border tax transparency.

Complete the quiz below to master stateful workflow principles.
MARKDOWN;
    }
}

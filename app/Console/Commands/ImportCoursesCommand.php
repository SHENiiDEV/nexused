<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportCoursesCommand extends Command
{
    protected $signature = 'courses:import {path=courses_catalog.json : Input JSON file path}';
    protected $description = 'Import courses with modules, lessons, and quizzes from a JSON file';

    public function handle(): int
    {
        $path = $this->argument('path');
        $fullPath = base_path($path);

        if (!File::exists($fullPath)) {
            $this->error("File not found at: {$fullPath}");
            return self::FAILURE;
        }

        $content = File::get($fullPath);
        $coursesData = json_decode($content, true);

        if (!is_array($coursesData)) {
            $this->error("Invalid JSON data format.");
            return self::FAILURE;
        }

        $admin = User::firstWhere('role', 'admin') ?? User::first();
        if (!$admin) {
            $admin = User::create([
                'name' => 'NexusEd Faculty',
                'email' => 'admin@nexused.co.uk',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]);
        }

        $this->info("Importing " . count($coursesData) . " courses...");
        $bar = $this->output->createProgressBar(count($coursesData));
        $bar->start();

        DB::transaction(function () use ($coursesData, $admin, $bar) {
            foreach ($coursesData as $cData) {
                $slug = $cData['slug'] ?? Str::slug($cData['title']);

                $course = Course::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'creator_id' => $admin->id,
                        'title' => $cData['title'],
                        'category' => $cData['category'] ?? 'Engineering',
                        'difficulty' => $cData['difficulty'] ?? 'intermediate',
                        'description' => $cData['description'] ?? '',
                        'price' => (float)($cData['price'] ?? 49.00),
                        'status' => $cData['status'] ?? 'published',
                        'topic' => $cData['topic'] ?? $cData['title'],
                        'target_audience' => $cData['target_audience'] ?? 'Engineers & Professionals',
                        'estimated_hours' => $cData['estimated_hours'] ?? 10,
                        'thumbnail_url' => $cData['thumbnail_url'] ?? null,
                    ]
                );

                if (!empty($cData['modules'])) {
                    foreach ($cData['modules'] as $mIdx => $mVal) {
                        $module = Module::updateOrCreate(
                            ['course_id' => $course->id, 'order' => $mVal['order'] ?? ($mIdx + 1)],
                            [
                                'title' => $mVal['title'],
                                'description' => $mVal['description'] ?? null,
                            ]
                        );

                        if (!empty($mVal['lessons'])) {
                            foreach ($mVal['lessons'] as $lIdx => $lVal) {
                                $lessonSlug = $lVal['slug'] ?? Str::slug($lVal['title']);
                                $lesson = Lesson::updateOrCreate(
                                    ['module_id' => $module->id, 'order' => $lVal['order'] ?? ($lIdx + 1)],
                                    [
                                        'course_id' => $course->id,
                                        'title' => $lVal['title'],
                                        'slug' => $lessonSlug,
                                        'content' => $lVal['content'] ?? '# ' . $lVal['title'],
                                        'duration_minutes' => $lVal['duration_minutes'] ?? 25,
                                        'is_preview' => (bool)($lVal['is_preview'] ?? false),
                                    ]
                                );

                                if (!empty($lVal['quizzes'])) {
                                    foreach ($lVal['quizzes'] as $qVal) {
                                        $quiz = Quiz::create([
                                            'lesson_id' => $lesson->id,
                                            'question' => $qVal['question'],
                                            'explanation' => $qVal['explanation'] ?? null,
                                            'xp_reward' => $qVal['xp_reward'] ?? 20,
                                        ]);

                                        if (!empty($qVal['options'])) {
                                            foreach ($qVal['options'] as $optVal) {
                                                QuizOption::create([
                                                    'quiz_id' => $quiz->id,
                                                    'option_text' => $optVal['option_text'],
                                                    'is_correct' => (bool)($optVal['is_correct'] ?? false),
                                                    'explanation' => $optVal['explanation'] ?? null,
                                                ]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine();
        $this->info("✓ Successfully imported all courses!");

        return self::SUCCESS;
    }
}

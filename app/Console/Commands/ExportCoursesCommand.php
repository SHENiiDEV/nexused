<?php

namespace App\Console\Commands;

use App\Models\Course;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ExportCoursesCommand extends Command
{
    protected $signature = 'courses:export {path=courses_catalog.json : Output JSON file path}';
    protected $description = 'Export full course catalog with modules, lessons, and quizzes to a JSON file';

    public function handle(): int
    {
        $courses = Course::with(['modules.lessons.quizzes.options'])->get();

        $this->info("Exporting {$courses->count()} courses...");

        $exportData = $courses->map(function ($course) {
            return [
                'title' => $course->title,
                'slug' => $course->slug,
                'category' => $course->category,
                'difficulty' => $course->difficulty,
                'description' => $course->description,
                'price' => (float)$course->price,
                'status' => $course->status,
                'topic' => $course->topic,
                'target_audience' => $course->target_audience,
                'estimated_hours' => $course->estimated_hours,
                'thumbnail_url' => $course->thumbnail_url,
                'modules' => $course->modules->map(function ($module) {
                    return [
                        'title' => $module->title,
                        'description' => $module->description,
                        'order' => $module->order,
                        'lessons' => $module->lessons->map(function ($lesson) {
                            return [
                                'title' => $lesson->title,
                                'slug' => $lesson->slug,
                                'content' => $lesson->content,
                                'duration_minutes' => $lesson->duration_minutes,
                                'order' => $lesson->order,
                                'is_preview' => (bool)$lesson->is_preview,
                                'quizzes' => $lesson->quizzes->map(function ($quiz) {
                                    return [
                                        'question' => $quiz->question,
                                        'explanation' => $quiz->explanation,
                                        'xp_reward' => $quiz->xp_reward,
                                        'options' => $quiz->options->map(function ($opt) {
                                            return [
                                                'option_text' => $opt->option_text,
                                                'is_correct' => (bool)$opt->is_correct,
                                                'explanation' => $opt->explanation,
                                            ];
                                        })->toArray(),
                                    ];
                                })->toArray(),
                            ];
                        })->toArray(),
                    ];
                })->toArray(),
            ];
        });

        $path = $this->argument('path');
        $fullPath = base_path($path);

        File::put($fullPath, json_encode($exportData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        $this->info("✓ Successfully exported {$courses->count()} courses to: {$fullPath}");

        return self::SUCCESS;
    }
}

<?php

namespace App\Services\Gamification;

use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;
use App\Models\User;

class GamificationService
{
    protected array $levels = [
        ['level' => 1, 'title' => 'Novice Scholar', 'min_xp' => 0, 'next_xp' => 500],
        ['level' => 2, 'title' => 'Junior Engineer', 'min_xp' => 500, 'next_xp' => 1200],
        ['level' => 3, 'title' => 'Systems Architect', 'min_xp' => 1200, 'next_xp' => 2500],
        ['level' => 4, 'title' => 'Senior Cloud Vanguard', 'min_xp' => 2500, 'next_xp' => 5000],
        ['level' => 5, 'title' => 'Staff AI Specialist', 'min_xp' => 5000, 'next_xp' => 9000],
        ['level' => 6, 'title' => 'Distinguished Fellow', 'min_xp' => 9000, 'next_xp' => 15000],
    ];

    /**
     * Compute comprehensive gamification profile for a user
     */
    public function getUserStats(User $user): array
    {
        $completedLessonsCount = LessonProgress::where('user_id', $user->id)
            ->where('is_completed', true)
            ->count();

        $correctQuizAttempts = QuizAttempt::where('user_id', $user->id)
            ->where('is_correct', true)
            ->count();

        $totalQuizAttempts = QuizAttempt::where('user_id', $user->id)->count();

        $quizAccuracy = $totalQuizAttempts > 0
            ? round(($correctQuizAttempts / $totalQuizAttempts) * 100)
            : 100;

        $completedCoursesCount = Enrollment::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->count();

        $enrolledCount = Enrollment::where('user_id', $user->id)->count();

        // Calculate dynamic XP
        $lessonXp = $completedLessonsCount * 50;
        $quizXp = $correctQuizAttempts * 100;
        $courseXp = $completedCoursesCount * 500;
        $streakDays = max(1, $user->streak_days ?? 1);
        $streakXp = $streakDays * 50;

        // Profile completeness bonus (KYC verified)
        $profileBonus = (!empty($user->address_street) && !empty($user->phone) && !empty($user->date_of_birth)) ? 200 : 0;

        $totalXp = ($user->xp ?? 0) + $lessonXp + $quizXp + $courseXp + $streakXp + $profileBonus;

        // Determine Level Tier
        $levelInfo = $this->calculateLevel($totalXp);

        // Calculate Unlocked Achievements
        $achievements = $this->calculateAchievements($user, [
            'completed_lessons' => $completedLessonsCount,
            'correct_quizzes' => $correctQuizAttempts,
            'completed_courses' => $completedCoursesCount,
            'streak_days' => $streakDays,
            'has_kyc' => $profileBonus > 0,
        ]);

        return [
            'total_xp' => $totalXp,
            'level' => $levelInfo['level'],
            'rank_title' => $levelInfo['title'],
            'min_xp' => $levelInfo['min_xp'],
            'next_level_xp' => $levelInfo['next_xp'],
            'progress_percent' => $levelInfo['percent'],
            'xp_remaining' => max(0, $levelInfo['next_xp'] - $totalXp),
            'streak_days' => $streakDays,
            'completed_lessons' => $completedLessonsCount,
            'correct_quizzes' => $correctQuizAttempts,
            'quiz_accuracy_percent' => $quizAccuracy,
            'completed_courses' => $completedCoursesCount,
            'enrolled_courses' => $enrolledCount,
            'achievements' => $achievements,
        ];
    }

    protected function calculateLevel(int $xp): array
    {
        $current = $this->levels[0];

        foreach ($this->levels as $lvl) {
            if ($xp >= $lvl['min_xp']) {
                $current = $lvl;
            }
        }

        $tierSpan = max(1, $current['next_xp'] - $current['min_xp']);
        $xpInTier = max(0, $xp - $current['min_xp']);
        $percent = min(100, round(($xpInTier / $tierSpan) * 100));

        return [
            'level' => $current['level'],
            'title' => $current['title'],
            'min_xp' => $current['min_xp'],
            'next_xp' => $current['next_xp'],
            'percent' => $percent,
        ];
    }

    protected function calculateAchievements(User $user, array $stats): array
    {
        return [
            [
                'id' => 'first_step',
                'title' => 'First Step Taken',
                'description' => 'Completed your very first interactive lesson.',
                'icon' => 'Sparkles',
                'xp_reward' => 50,
                'unlocked' => $stats['completed_lessons'] >= 1,
                'progress' => min(1, $stats['completed_lessons']) . '/1',
            ],
            [
                'id' => 'deep_dive',
                'title' => 'Deep Diver',
                'description' => 'Completed 5 curriculum lessons across any active course.',
                'icon' => 'BookOpen',
                'xp_reward' => 150,
                'unlocked' => $stats['completed_lessons'] >= 5,
                'progress' => min(5, $stats['completed_lessons']) . '/5',
            ],
            [
                'id' => 'quiz_ace',
                'title' => 'Quiz Master',
                'description' => 'Successfully passed 3 quizzes with 100% correct answers.',
                'icon' => 'Target',
                'xp_reward' => 200,
                'unlocked' => $stats['correct_quizzes'] >= 3,
                'progress' => min(3, $stats['correct_quizzes']) . '/3',
            ],
            [
                'id' => 'certified_pro',
                'title' => 'Verified Credential',
                'description' => 'Completed a certified course and earned a cryptographic diploma.',
                'icon' => 'Award',
                'xp_reward' => 500,
                'unlocked' => $stats['completed_courses'] >= 1,
                'progress' => min(1, $stats['completed_courses']) . '/1',
            ],
            [
                'id' => 'streak_fire',
                'title' => 'Unstoppable Momentum',
                'description' => 'Maintained a 3-day active daily learning streak.',
                'icon' => 'Flame',
                'xp_reward' => 150,
                'unlocked' => $stats['streak_days'] >= 3,
                'progress' => min(3, $stats['streak_days']) . '/3 days',
            ],
            [
                'id' => 'identity_verified',
                'title' => 'Compliant Identity',
                'description' => 'Registered full residential KYC and verified date of birth.',
                'icon' => 'ShieldCheck',
                'xp_reward' => 200,
                'unlocked' => $stats['has_kyc'],
                'progress' => $stats['has_kyc'] ? 'Verified' : 'Incomplete',
            ],
        ];
    }
}

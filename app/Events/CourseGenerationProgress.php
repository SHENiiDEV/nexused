<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CourseGenerationProgress implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $courseId,
        public int $progress,
        public string $step,
        public string $message
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('course.' . $this->courseId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'progress.updated';
    }
}

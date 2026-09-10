<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CourseGenerationCompleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $courseId,
        public string $title,
        public string $slug
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('course.' . $this->courseId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'generation.completed';
    }
}

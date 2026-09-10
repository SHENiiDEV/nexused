<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Log;

class AuditLogger
{
    public static function record(
        string $action,
        string $entityType,
        ?int $entityId = null,
        ?array $payload = null,
        ?int $userId = null,
        ?string $ipAddress = null
    ): AuditLog {
        $ip = $ipAddress ?? request()->ip();
        $user = $userId ?? auth()->id();

        Log::info("[AUDIT] {$action} on {$entityType}#{$entityId}", [
            'user_id' => $user,
            'ip' => $ip,
            'payload' => $payload,
        ]);

        return AuditLog::create([
            'user_id' => $user,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'payload' => $payload,
            'ip_address' => $ip,
        ]);
    }
}

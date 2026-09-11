<?php

namespace App\Services\Ai;

use App\Models\Course;
use Illuminate\Support\Facades\File;

class CourseThumbnailGenerator
{
    /**
     * Generate an aesthetic, high-resolution SVG course banner tailored to the course topic
     */
    public static function generate(Course $course): string
    {
        $dir = public_path('thumbnails');
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true, true);
        }

        $theme = self::resolveTheme($course->topic ?? '', $course->title);
        $svg = self::renderSvg($course, $theme);

        $filename = $course->slug . '.svg';
        $filepath = $dir . '/' . $filename;
        File::put($filepath, $svg);

        $url = '/thumbnails/' . $filename;
        $course->update(['thumbnail_url' => $url]);

        return $url;
    }

    protected static function resolveTheme(string $topic, string $title): array
    {
        $text = strtolower($topic . ' ' . $title);

        if (str_contains($text, 'go') || str_contains($text, 'golang')) {
            return [
                'tag' => 'GO RUNTIME & MICROSERVICES',
                'accent' => '#00ADD8',
                'accent_light' => '#38BDF8',
                'badge_bg' => 'rgba(0, 173, 216, 0.15)',
                'badge_border' => 'rgba(0, 173, 216, 0.4)',
                'glow' => '#0284C7',
                'icon' => '🐹',
                'lang' => 'go',
                'code' => [
                    'package main',
                    '',
                    'import "context"',
                    '',
                    'func StreamRPC(ctx context.Context) {',
                    '    bus := event.NewBroker("grpc")',
                    '    bus.Publish(&Event{',
                    '        ID:    "evt_0912",',
                    '        Topic: "orders.replicated",',
                    '    })',
                    '}',
                ],
            ];
        }

        if (str_contains($text, 'kube') || str_contains($text, 'k8s') || str_contains($text, 'cloud') || str_contains($text, 'devops') || str_contains($text, 'docker')) {
            return [
                'tag' => 'CLOUD INFRASTRUCTURE & K8S',
                'accent' => '#326CE5',
                'accent_light' => '#60A5FA',
                'badge_bg' => 'rgba(50, 108, 229, 0.15)',
                'badge_border' => 'rgba(50, 108, 229, 0.4)',
                'glow' => '#2563EB',
                'icon' => '☸️',
                'lang' => 'yaml',
                'code' => [
                    'apiVersion: apps/v1',
                    'kind: Deployment',
                    'metadata:',
                    '  name: nexus-ingress-mesh',
                    'spec:',
                    '  replicas: 5',
                    '  strategy:',
                    '    type: RollingUpdate',
                    '  template:',
                    '    spec: { containers: [...] }',
                ],
            ];
        }

        if (str_contains($text, 'ai') || str_contains($text, 'llm') || str_contains($text, 'agent') || str_contains($text, 'gpt') || str_contains($text, 'model')) {
            return [
                'tag' => 'AUTONOMOUS AI ARCHITECTURE',
                'accent' => '#10B981',
                'accent_light' => '#34D399',
                'badge_bg' => 'rgba(16, 185, 129, 0.15)',
                'badge_border' => 'rgba(16, 185, 129, 0.4)',
                'glow' => '#059669',
                'icon' => '⚡',
                'lang' => 'python',
                'code' => [
                    'async def execute_agent_loop(ctx):',
                    '    plan = await planner.synthesize()',
                    '    async for token in chain.stream():',
                    '        if token.is_tool_call:',
                    '            res = await runner.invoke(token)',
                    '            yield res.emit_event()',
                    '    return plan.finalize()',
                ],
            ];
        }

        if (str_contains($text, 'kafka') || str_contains($text, 'distribut') || str_contains($text, 'system') || str_contains($text, 'event') || str_contains($text, 'data')) {
            return [
                'tag' => 'DISTRIBUTED SYSTEMS & RAFT',
                'accent' => '#F59E0B',
                'accent_light' => '#FBBF24',
                'badge_bg' => 'rgba(245, 158, 11, 0.15)',
                'badge_border' => 'rgba(245, 158, 11, 0.4)',
                'glow' => '#D97706',
                'icon' => '🔄',
                'lang' => 'json',
                'code' => [
                    '{',
                    '  "cluster": "nexus-prod-01",',
                    '  "consensus": "Raft_v2",',
                    '  "quorum_status": "HEALTHY",',
                    '  "leader_election_ms": 124,',
                    '  "invariants_verified": true',
                    '}',
                ],
            ];
        }

        if (str_contains($text, 'english') || str_contains($text, 'language') || str_contains($text, 'communication') || str_contains($text, 'ielts') || str_contains($text, 'speaking')) {
            return [
                'tag' => 'EXECUTIVE ENGLISH & GLOBAL FLUENCY',
                'accent' => '#38BDF8',
                'accent_light' => '#7DD3FC',
                'badge_bg' => 'rgba(56, 189, 248, 0.15)',
                'badge_border' => 'rgba(56, 189, 248, 0.4)',
                'glow' => '#0284C7',
                'icon' => '🌐',
                'lang' => 'en-C1',
                'code' => [
                    '// Executive Communication Framework',
                    'Objective: "Align international stakeholders"',
                    'Tone: Assertive, diplomatic, high-agency',
                    '',
                    'Key Phrasing:',
                    '→ "From a strategic perspective, we recommend..."',
                    '→ "To mitigate risk while optimizing delivery..."',
                    '→ "The underlying ROI supports our thesis."',
                ],
            ];
        }

        if (str_contains($text, 'design') || str_contains($text, 'figma') || str_contains($text, 'ui') || str_contains($text, 'ux')) {
            return [
                'tag' => 'PRODUCT DESIGN & FIGMA TOKENS',
                'accent' => '#EC4899',
                'accent_light' => '#F472B6',
                'badge_bg' => 'rgba(236, 72, 153, 0.15)',
                'badge_border' => 'rgba(236, 72, 153, 0.4)',
                'glow' => '#DB2777',
                'icon' => '🎨',
                'lang' => 'design-tokens',
                'code' => [
                    ':root {',
                    '  --color-primary: #0F172A;',
                    '  --color-accent: #10B981;',
                    '  --radius-card: 24px;',
                    '  --shadow-elevation: 0 20px 40px -15px rgba(0,0,0,0.1);',
                    '  --font-display: "Inter", sans-serif;',
                    '  --wcag-contrast: 7.2:1 (AAA Pass);',
                    '}',
                ],
            ];
        }

        if (str_contains($text, 'agile') || str_contains($text, 'scrum') || str_contains($text, 'management') || str_contains($text, 'project')) {
            return [
                'tag' => 'AGILE LEADERSHIP & SPRINT MATRIX',
                'accent' => '#818CF8',
                'accent_light' => '#A5B4FC',
                'badge_bg' => 'rgba(129, 140, 248, 0.15)',
                'badge_border' => 'rgba(129, 140, 248, 0.4)',
                'glow' => '#6366F1',
                'icon' => '📋',
                'lang' => 'agile-sprint',
                'code' => [
                    'Sprint: "Q3 Delivery Cycle #14"',
                    'Velocity: 48 Story Points',
                    'Cycle Time: 2.4 days / feature',
                    '',
                    'Standup Blockers: 0',
                    'Definition of Done: Verified in Staging',
                    'Release Confidence: 99.4%',
                ],
            ];
        }

        if (str_contains($text, 'marketing') || str_contains($text, 'growth') || str_contains($text, 'seo') || str_contains($text, 'ads')) {
            return [
                'tag' => 'GROWTH HACKING & UNIT ECONOMICS',
                'accent' => '#F97316',
                'accent_light' => '#FB923C',
                'badge_bg' => 'rgba(249, 115, 22, 0.15)',
                'badge_border' => 'rgba(249, 115, 22, 0.4)',
                'glow' => '#EA580C',
                'icon' => '📈',
                'lang' => 'growth-metrics',
                'code' => [
                    'CAC (Customer Acquisition Cost): €42.50',
                    'LTV (Customer Lifetime Value):  €380.00',
                    'LTV / CAC Ratio: 8.9x (Elite Tier)',
                    'Landing Page CVR: 4.8% (Benchmark: 2.1%)',
                    'Organic Search Growth: +142% MoM',
                ],
            ];
        }

        if (str_contains($text, 'finance') || str_contains($text, 'valuation') || str_contains($text, 'accounting') || str_contains($text, 'invest')) {
            return [
                'tag' => 'CORPORATE FINANCE & DCF MODELING',
                'accent' => '#10B981',
                'accent_light' => '#34D399',
                'badge_bg' => 'rgba(16, 185, 129, 0.15)',
                'badge_border' => 'rgba(16, 185, 129, 0.4)',
                'glow' => '#059669',
                'icon' => '🏛️',
                'lang' => 'dcf-valuation',
                'code' => [
                    'WACC (Discount Rate): 8.4%',
                    'Terminal Growth Rate: 2.5%',
                    'Projected Free Cash Flow (5Y): €14.8M',
                    'Enterprise Valuation (EV): €84.2M',
                    'IRR (Internal Rate of Return): 26.4%',
                ],
            ];
        }

        if (str_contains($text, 'rust')) {
            return [
                'tag' => 'RUST SYSTEMS & MEMORY SAFETY',
                'accent' => '#F97316',
                'accent_light' => '#FDBA74',
                'badge_bg' => 'rgba(249, 115, 22, 0.15)',
                'badge_border' => 'rgba(249, 115, 22, 0.4)',
                'glow' => '#EA580C',
                'icon' => '🦀',
                'lang' => 'rust',
                'code' => [
                    'pub async fn process_stream(mut stream: TcpStream) {',
                    '    let mut buffer = [0; 1024];',
                    '    match stream.read(&mut buffer).await {',
                    '        Ok(bytes) => info!("Received bytes: {}", bytes),',
                    '        Err(e) => error!("Failed: {}", e),',
                    '    }',
                    '}',
                ],
            ];
        }

        if (str_contains($text, 'security') || str_contains($text, 'zero-trust') || str_contains($text, 'mtls') || str_contains($text, 'owasp') || str_contains($text, 'cyber')) {
            return [
                'tag' => 'CYBERSECURITY & ZERO-TRUST',
                'accent' => '#EF4444',
                'accent_light' => '#F87171',
                'badge_bg' => 'rgba(239, 68, 68, 0.15)',
                'badge_border' => 'rgba(239, 68, 68, 0.4)',
                'glow' => '#DC2626',
                'icon' => '🛡️',
                'lang' => 'security-policy',
                'code' => [
                    'policy: "zero-trust-enforce"',
                    'client_cert: "SPIFFE-ID-verified"',
                    'tls_version: "TLS_1_3_CHACHA20_POLY1305"',
                    'authorization: "RBAC + ABAC evaluated"',
                    'status: ALLOWED_WITH_AUDIT_LOG',
                ],
            ];
        }

        if (str_contains($text, 'linux') || str_contains($text, 'bash') || str_contains($text, 'terraform') || str_contains($text, 'cicd')) {
            return [
                'tag' => 'DEVOPS & INFRASTRUCTURE AUTOMATION',
                'accent' => '#06B6D4',
                'accent_light' => '#67E8F9',
                'badge_bg' => 'rgba(6, 182, 212, 0.15)',
                'badge_border' => 'rgba(6, 182, 212, 0.4)',
                'glow' => '#0891B2',
                'icon' => '🐧',
                'lang' => 'hcl',
                'code' => [
                    'resource "aws_eks_cluster" "prod" {',
                    '  name     = "nexus-core"',
                    '  version  = "1.31"',
                    '  vpc_config { subnet_ids = var.private_subnets }',
                    '}',
                ],
            ];
        }

        if (str_contains($text, 'python') || str_contains($text, 'data') || str_contains($text, 'neural') || str_contains($text, 'pytorch')) {
            return [
                'tag' => 'DATA SCIENCE & NEURAL NETWORKS',
                'accent' => '#3B82F6',
                'accent_light' => '#93C5FD',
                'badge_bg' => 'rgba(59, 130, 246, 0.15)',
                'badge_border' => 'rgba(59, 130, 246, 0.4)',
                'glow' => '#2563EB',
                'icon' => '🐍',
                'lang' => 'python',
                'code' => [
                    'import torch',
                    'import torch.nn as nn',
                    '',
                    'class TransformerBlock(nn.Module):',
                    '    def __init__(self, d_model, heads):',
                    '        super().__init__()',
                    '        self.attention = nn.MultiheadAttention(d_model, heads)',
                ],
            ];
        }

        // Default Modern Engineering Theme
        return [
            'tag' => 'ENTERPRISE ARCHITECTURE',
            'accent' => '#10B981',
            'accent_light' => '#34D399',
            'badge_bg' => 'rgba(16, 185, 129, 0.15)',
            'badge_border' => 'rgba(16, 185, 129, 0.4)',
            'glow' => '#059669',
            'icon' => '🚀',
            'lang' => 'sh',
            'code' => [
                '# NexusEd Production Stack',
                'export ENV="production"',
                'nexused build --target=high-perf',
                '[INFO] Pipeline verified: 100%',
                '[READY] Zero downtime deployment',
            ],
        ];
    }

    protected static function renderSvg(Course $course, array $theme): string
    {
        $escapedTitle = htmlspecialchars($course->title, ENT_XML1, 'UTF-8');
        $escapedTopic = htmlspecialchars($course->topic ?? 'Engineering Track', ENT_XML1, 'UTF-8');
        $hours = (int)$course->estimated_hours ?: 6;
        $modulesCount = $course->modules()->count() ?: 3;
        $accent = $theme['accent'];
        $accentLight = $theme['accent_light'];
        $badgeBg = $theme['badge_bg'];
        $badgeBorder = $theme['badge_border'];
        $tag = $theme['tag'];
        $icon = $theme['icon'];

        // Format code lines
        $codeLines = '';
        $y = 120;
        foreach ($theme['code'] as $i => $line) {
            $num = $i + 1;
            $lineEscaped = htmlspecialchars($line, ENT_XML1, 'UTF-8');
            $color = '#E2E8F0';
            if (str_starts_with(trim($line), '//') || str_starts_with(trim($line), '#')) {
                $color = '#64748B';
            } elseif (str_contains($line, 'func') || str_contains($line, 'package') || str_contains($line, 'async') || str_contains($line, 'def')) {
                $color = $accentLight;
            } elseif (str_contains($line, '"') || str_contains($line, "'")) {
                $color = '#38BDF8';
            }
            $codeLines .= "<tspan x=\"720\" y=\"{$y}\" fill=\"#475569\">" . sprintf('%02d', $num) . "  </tspan><tspan fill=\"{$color}\">{$lineEscaped}</tspan>\n";
            $y += 24;
        }

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090D16" />
      <stop offset="50%" stop-color="#0E1626" />
      <stop offset="100%" stop-color="#090D16" />
    </linearGradient>

    <!-- Ambient Glow Gradient -->
    <radialGradient id="glowGrad" cx="30%" cy="30%" r="60%">
      <stop offset="0%" stop-color="{$accent}" stop-opacity="0.22" />
      <stop offset="60%" stop-color="{$accent}" stop-opacity="0.03" />
      <stop offset="100%" stop-color="{$accent}" stop-opacity="0" />
    </radialGradient>

    <!-- Terminal Glow -->
    <radialGradient id="terminalGlow" cx="80%" cy="40%" r="50%">
      <stop offset="0%" stop-color="{$accent}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="{$accent}" stop-opacity="0" />
    </radialGradient>

    <!-- Card Inner Shadow Filter -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="60" result="blur" />
    </filter>

    <!-- Grid Pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" stroke-width="0.75" stroke-opacity="0.6" />
      <circle cx="40" cy="40" r="1.2" fill="#334155" fill-opacity="0.8" />
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="675" fill="url(#bgGrad)" />

  <!-- Grid Overlay -->
  <rect width="1200" height="675" fill="url(#grid)" />

  <!-- Ambient Color Glows -->
  <circle cx="250" cy="200" r="350" fill="url(#glowGrad)" />
  <circle cx="950" cy="250" r="300" fill="url(#terminalGlow)" />

  <!-- Decorative Circuit Mesh Lines -->
  <g stroke="#1E293B" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.7">
    <line x1="80" y1="80" x2="620" y2="80" />
    <line x1="620" y1="80" x2="680" y2="140" />
    <line x1="80" y1="580" x2="1120" y2="580" />
  </g>

  <!-- Left Content Column -->
  <g transform="translate(80, 0)">
    <!-- Top Pill Badge -->
    <rect x="0" y="110" width="340" height="36" rx="18" fill="{$badgeBg}" stroke="{$badgeBorder}" stroke-width="1.5" />
    <text x="18" y="133" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-size="12" font-weight="800" fill="{$accentLight}" letter-spacing="1.5">
      {$icon}  {$tag}
    </text>

    <!-- Main Course Title -->
    <switch>
      <g>
        <text x="0" y="220" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">
          <tspan x="0" dy="0">{$escapedTitle}</tspan>
        </text>
      </g>
    </switch>

    <!-- Subtitle / Topic -->
    <text x="0" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" font-size="18" font-weight="500" fill="#94A3B8" letter-spacing="0.2">
      Comprehensive production curriculum with hands-on lab tests.
    </text>

    <!-- Metric Badges -->
    <g transform="translate(0, 420)">
      <!-- Badge 1: Modules -->
      <rect x="0" y="0" width="130" height="42" rx="10" fill="#0F172A" stroke="#1E293B" stroke-width="1" />
      <text x="16" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="700" fill="#F8FAFC">
        📚  {$modulesCount} Modules
      </text>

      <!-- Badge 2: Hours -->
      <rect x="145" y="0" width="130" height="42" rx="10" fill="#0F172A" stroke="#1E293B" stroke-width="1" />
      <text x="161" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="700" fill="#F8FAFC">
        ⏱️  {$hours}h Length
      </text>

      <!-- Badge 3: Certification -->
      <rect x="290" y="0" width="180" height="42" rx="10" fill="#0F172A" stroke="#1E293B" stroke-width="1" />
      <text x="306" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="700" fill="#10B981">
        ✓  Verified Certificate
      </text>
    </g>

    <!-- Brand Seal / Watermark -->
    <g transform="translate(0, 530)">
      <text x="0" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" fill="#64748B" letter-spacing="1.2">
        NEXUSED <tspan fill="{$accent}">•</tspan> ACADEMY ARCHITECTS
      </text>
    </g>
  </g>

  <!-- Right Column: macOS Code & Architecture Terminal Window -->
  <g transform="translate(670, 70)">
    <!-- Terminal Outer Shadow Card -->
    <rect x="0" y="0" width="450" height="480" rx="16" fill="#0A0E1A" stroke="#1E293B" stroke-width="1.5" />

    <!-- Terminal Header -->
    <rect x="0" y="0" width="450" height="40" rx="16" fill="#0F172A" />
    <rect x="0" y="24" width="450" height="16" fill="#0F172A" />
    <line x1="0" y1="40" x2="450" y2="40" stroke="#1E293B" stroke-width="1" />

    <!-- Window Dots -->
    <circle cx="20" cy="20" r="5" fill="#EF4444" />
    <circle cx="36" cy="20" r="5" fill="#F59E0B" />
    <circle cx="52" cy="20" r="5" fill="#10B981" />

    <!-- File Tab Name -->
    <rect x="80" y="10" width="160" height="22" rx="6" fill="#1E293B" />
    <text x="96" y="25" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="10" font-weight="700" fill="#94A3B8">
      main.{$theme['lang']}
    </text>

    <!-- Active status indicator -->
    <circle cx="420" cy="20" r="4" fill="{$accent}" />

    <!-- Syntax Highlighted Code -->
    <text font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="12.5" font-weight="500">
      {$codeLines}
    </text>

    <!-- Bottom Status Bar -->
    <rect x="0" y="445" width="450" height="35" rx="16" fill="#080C14" />
    <rect x="0" y="445" width="450" height="15" fill="#080C14" />
    <line x1="0" y1="445" x2="450" y2="445" stroke="#1E293B" stroke-width="1" />
    <text x="18" y="467" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600" fill="#64748B">
      UTF-8  <tspan fill="{$accent}">●</tspan>  {$theme['tag']}  <tspan fill="#475569">| Ln 12, Col 1</tspan>
    </text>
  </g>
</svg>
SVG;
    }
}

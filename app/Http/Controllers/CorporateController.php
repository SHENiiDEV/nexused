<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use App\Services\Billing\B2BInvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CorporateController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $company = $user->company;

        if (!$company) {
            return redirect()->route('student.dashboard')->with(
                'error',
                'No corporate organization found for your account. Please register as a Corporate account or contact your team administrator.'
            );
        }

        // Team members under this company
        $employees = User::where('company_id', $company->id)->get();

        // Calculate metrics for each employee
        $employeeData = $employees->map(function ($emp) {
            $enrollmentCount = Enrollment::where('user_id', $emp->id)->count();
            $completedCount = Enrollment::where('user_id', $emp->id)->whereNotNull('completed_at')->count();
            $totalProgress = LessonProgress::where('user_id', $emp->id)->where('is_completed', true)->count();
            $quizAttempts = QuizAttempt::where('user_id', $emp->id)->get();
            $quizScoreAvg = $quizAttempts->count() > 0
                ? round(($quizAttempts->where('is_correct', true)->count() / $quizAttempts->count()) * 100)
                : 0;

            return [
                'id' => $emp->id,
                'name' => $emp->name . ($emp->surname ? ' ' . $emp->surname : ''),
                'email' => $emp->email,
                'role' => $emp->role,
                'enrolled_courses' => $enrollmentCount,
                'completed_courses' => $completedCount,
                'completed_lessons' => $totalProgress,
                'quiz_accuracy_pct' => $quizScoreAvg,
                'created_at' => $emp->created_at->format('M d, Y'),
            ];
        });

        // Invoices for this company
        $invoices = Invoice::where('company_id', $company->id)->latest()->get();

        // Available published courses for seat assignment
        $courses = Course::where('status', 'published')->get();

        // Platform users that can be added to this company
        $availableUsers = User::where(function ($query) use ($company) {
            $query->whereNull('company_id')
                ->orWhere('company_id', '!=', $company->id);
        })
            ->where('id', '!=', $user->id)
            ->orderBy('name')
            ->get(['id', 'name', 'surname', 'email', 'role'])
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name . ($u->surname ? ' ' . $u->surname : ''),
                'email' => $u->email,
                'role' => $u->role,
            ]);

        return Inertia::render('Corporate/Dashboard', [
            'company' => $company,
            'employees' => $employeeData,
            'invoices' => $invoices,
            'courses' => $courses,
            'availableUsers' => $availableUsers,
        ]);
    }

    /**
     * Add an existing platform user to corporate company
     */
    public function addPlatformUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_id' => 'nullable|exists:courses,id',
        ]);

        $company = auth()->user()->company;
        if (!$company) {
            return redirect()->route('student.dashboard')->with('error', 'Corporate organization not found.');
        }

        if ($company->used_seats >= $company->max_seats) {
            return back()->withErrors(['seats' => 'Maximum corporate license seats reached. Please upgrade your seat quota.']);
        }

        $platformUser = User::findOrFail($validated['user_id']);
        if ($platformUser->company_id === $company->id) {
            return back()->withErrors(['user_id' => 'This user is already part of your team.']);
        }

        $platformUser->company_id = $company->id;
        $platformUser->save();

        $company->increment('used_seats');

        if (!empty($validated['course_id'])) {
            Enrollment::firstOrCreate([
                'user_id' => $platformUser->id,
                'course_id' => $validated['course_id'],
            ], [
                'company_id' => $company->id,
            ]);
        }

        AuditLogger::record('seat.allocated', 'Company', $company->id, [
            'employee_id' => $platformUser->id,
            'employee_email' => $platformUser->email,
            'seats_used' => $company->used_seats,
        ]);

        return back()->with('success', "Platform user {$platformUser->name} ({$platformUser->email}) successfully added to your corporate organization.");
    }

    public function inviteEmployee(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'course_id' => 'nullable|exists:courses,id',
        ]);

        $company = auth()->user()->company;

        if ($company->used_seats >= $company->max_seats) {
            return back()->withErrors(['seats' => 'Maximum corporate license seats reached. Upgrade package to add more.']);
        }

        $employee = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make('nexus_temp_' . Str::random(8)),
            'role' => 'student',
            'company_id' => $company->id,
        ]);

        $company->increment('used_seats');

        if (!empty($validated['course_id'])) {
            Enrollment::create([
                'user_id' => $employee->id,
                'course_id' => $validated['course_id'],
                'company_id' => $company->id,
            ]);
        }

        AuditLogger::record('seat.allocated', 'Company', $company->id, [
            'employee_id' => $employee->id,
            'employee_email' => $employee->email,
            'seats_used' => $company->used_seats,
        ]);

        return back()->with('success', "Employee {$employee->name} successfully invited and allocated seat.");
    }

    public function downloadInvoice(Invoice $invoice, B2BInvoiceService $invoiceService): HttpResponse
    {
        // Render printable / PDF view
        $html = $invoiceService->renderHtmlInvoice($invoice);
        return response($html, 200, ['Content-Type' => 'text/html']);
    }

    public function exportUbl(Invoice $invoice, B2BInvoiceService $invoiceService): HttpResponse
    {
        $xml = $invoice->ubl_xml;
        if (empty($xml)) {
            $items = [
                [
                    'name' => "NexusEd Corporate Team License",
                    'quantity' => 1,
                    'unit_price' => $invoice->amount - $invoice->tax_amount,
                    'tax_rate' => 19,
                    'tax_amount' => $invoice->tax_amount,
                    'total' => $invoice->amount,
                ],
            ];
            $xml = $invoiceService->generateUblXml($invoice, $items, $invoice->company);
            $invoice->ubl_xml = $xml;
            $invoice->save();
        }

        $filename = "{$invoice->invoice_number}-peppol-ubl21.xml";

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}

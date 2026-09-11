<?php

namespace App\Mail;

use App\Models\Course;
use App\Models\Invoice;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Billing\B2BInvoiceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CoursePurchasedEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public ?Invoice $invoice = null;
    public ?string $invoiceHtml = null;

    public function __construct(
        public Transaction $transaction,
        public User $user,
        public ?Course $course = null,
        ?Invoice $invoice = null
    ) {
        if (!$this->course && $this->transaction->course_id) {
            $this->course = $this->transaction->course;
        }

        $invoiceService = app(B2BInvoiceService::class);
        $this->invoice = $invoice ?? $this->transaction->invoice ?? $invoiceService->getOrCreateInvoice($this->transaction);
        if ($this->invoice) {
            $this->invoiceHtml = $invoiceService->renderHtmlInvoice($this->invoice);
        }
    }

    public function envelope(): Envelope
    {
        $itemTitle = $this->course?->title ?? $this->transaction->metadata['course_title'] ?? 'Corporate Training Package';

        return new Envelope(
            from: new Address(
                config('mail.from.address', 'info@nexused.co.uk'),
                config('mail.from.name', 'NexusEd Global')
            ),
            subject: "Order Confirmation & Tax Invoice — {$itemTitle} [{$this->transaction->transaction_ref}]",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.course-purchased',
            with: [
                'transaction' => $this->transaction,
                'user' => $this->user,
                'course' => $this->course,
                'invoice' => $this->invoice,
                'company' => config('company'),
                'isCorporate' => (bool)$this->transaction->company_id || (($this->transaction->metadata['type'] ?? '') === 'b2b_license'),
            ]
        );
    }

    public function attachments(): array
    {
        $attachments = [];

        if ($this->invoice && $this->invoiceHtml) {
            $filename = "Invoice-{$this->invoice->invoice_number}.html";
            $attachments[] = Attachment::fromData(
                fn () => $this->invoiceHtml,
                $filename
            )->withMime('text/html');
        }

        return $attachments;
    }
}

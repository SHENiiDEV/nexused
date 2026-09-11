<?php

namespace App\Mail;

use App\Models\Course;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CoursePurchasedEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public User $user,
        public ?Course $course = null
    ) {
        if (!$this->course && $this->transaction->course_id) {
            $this->course = $this->transaction->course;
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
            subject: "Order Confirmation & Access Details — {$itemTitle} [{$this->transaction->transaction_ref}]",
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
                'company' => config('company'),
                'isCorporate' => (bool)$this->transaction->company_id || (($this->transaction->metadata['type'] ?? '') === 'b2b_license'),
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

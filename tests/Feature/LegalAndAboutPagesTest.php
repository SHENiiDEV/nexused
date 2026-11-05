<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LegalAndAboutPagesTest extends TestCase
{
    public function test_delivery_and_returns_page_is_public_with_company_contact_details(): void
    {
        $response = $this->get('/delivery-and-returns');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Legal/DeliveryAndReturns')
            ->has('company.name')
            ->has('company.address')
            ->has('company.email')
        );
    }

    public function test_about_page_renders_with_company_props(): void
    {
        $response = $this->get('/about');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->has('company', fn (Assert $company) => $company
                ->where('name', 'TRUE CENTRIC LTD')
                ->where('number', '15642952')
                ->where('address', '20 Wenlock Road, London, England, N1 7GU')
                ->where('email', 'legal@nexused.com')
            )
        );
    }

    public function test_terms_page_renders_with_company_props(): void
    {
        $response = $this->get('/terms');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Legal/Terms')
            ->has('company.name')
            ->has('company.number')
            ->has('company.address')
            ->has('company.email')
        );
    }

    public function test_privacy_page_renders_with_company_props(): void
    {
        $response = $this->get('/privacy');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Legal/Privacy')
            ->has('company.name')
            ->has('company.number')
            ->has('company.address')
            ->has('company.email')
        );
    }
}

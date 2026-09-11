<?php

namespace Tests\Feature;

use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class LegalAndAboutPagesTest extends TestCase
{
    public function test_about_page_renders_with_company_props(): void
    {
        $response = $this->get('/about');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('About')
            ->has('company', fn (Assert $company) => $company
                ->where('name', 'NexusEd Global GmbH')
                ->where('number', 'HRB 248910 B')
                ->where('address', 'Friedrichstraße 200, 10117 Berlin, Germany')
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

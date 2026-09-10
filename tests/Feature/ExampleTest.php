<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_root_redirects_to_courses(): void
    {
        $response = $this->get('/');
        $response->assertRedirect('/courses');
    }

    public function test_courses_catalog_returns_successful_response(): void
    {
        $response = $this->get('/courses');
        $response->assertStatus(200);
    }
}

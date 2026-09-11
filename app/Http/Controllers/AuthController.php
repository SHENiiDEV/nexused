<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginInput = trim($credentials['email']);
        $password = $credentials['password'];

        // Allow logging in with either 'admin' username or standard email address
        $user = null;
        if (strtolower($loginInput) === 'admin') {
            $user = User::where('role', 'admin')->first();
        } else {
            $user = User::where('email', $loginInput)->first();
        }

        if ($user && Hash::check($password, $user->password)) {
            Auth::login($user, $request->boolean('remember'));
            $request->session()->regenerate();

            if ($user->isAdmin()) {
                return redirect()->route('admin.generator');
            } elseif ($user->isCorporate() && $user->company_id) {
                return redirect()->route('corporate.dashboard');
            }

            return redirect()->route('student.dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $excludedCountries = [
            'sudan', 'dem. rep. of the congo', 'democratic republic of the congo', 'iran',
            'mali', 'myanmar', 'myanmar (burma)', 'north korea', 'south sudan', 'syria',
            'yemen', 'afghanistan', 'belarus', 'central african republic', 'cuba',
            'haiti', 'iraq', 'russia', 'somalia', 'venezuela', 'zimbabwe',
        ];

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'surname' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'phone' => 'required|string|max:30',
            'date_of_birth' => 'required|date|before:today',
            'address_street' => 'required|string|max:255',
            'address_city' => 'required|string|max:100',
            'address_country' => [
                'required',
                'string',
                'max:100',
                function ($attribute, $value, $fail) use ($excludedCountries) {
                    if (in_array(strtolower(trim($value)), $excludedCountries, true)) {
                        $fail('Registration is not supported from this country due to regulatory compliance.');
                    }
                },
            ],
            'address_postcode' => 'required|string|max:20',
            'terms' => 'accepted',
            'role' => 'required|in:student,corporate',
            'company_name' => 'nullable|required_if:role,corporate|string|max:150',
            'vat_number' => 'nullable|string|max:50',
        ], [
            'terms.accepted' => 'You must agree to the Terms & Conditions and Privacy Policy to create an account.',
        ]);

        $companyId = null;
        if ($validated['role'] === 'corporate') {
            $company = Company::create([
                'name' => $validated['company_name'] ?? 'Enterprise Team',
                'vat_number' => $validated['vat_number'] ?? 'EU' . rand(100000000, 999999999),
                'billing_email' => $validated['email'],
                'billing_address' => $validated['address_street'] . ', ' . $validated['address_city'] . ', ' . $validated['address_postcode'] . ' ' . $validated['address_country'],
                'country_code' => substr($validated['address_country'], 0, 2),
                'max_seats' => 10,
                'used_seats' => 1,
            ]);
            $companyId = $company->id;
        }

        $user = User::create([
            'name' => $validated['name'],
            'surname' => $validated['surname'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'date_of_birth' => $validated['date_of_birth'],
            'address_street' => $validated['address_street'],
            'address_city' => $validated['address_city'],
            'address_country' => $validated['address_country'],
            'address_postcode' => $validated['address_postcode'],
            'terms_accepted' => true,
            'terms_accepted_at' => now(),
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'company_id' => $companyId,
            'xp' => 100, // Welcome bonus XP
            'streak_days' => 1,
        ]);

        Auth::login($user);

        if ($user->isCorporate()) {
            return redirect()->route('corporate.dashboard');
        }

        return redirect()->route('student.dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('courses.index');
    }
}

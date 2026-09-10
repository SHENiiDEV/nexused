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
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();
            if ($user->isAdmin()) {
                return redirect()->route('admin.generator');
            } elseif ($user->isCorporate()) {
                return redirect()->route('corporate.dashboard');
            }

            return redirect()->route('courses.index');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|in:student,corporate',
            'company_name' => 'nullable|required_if:role,corporate|string|max:150',
            'vat_number' => 'nullable|string|max:50',
        ]);

        $companyId = null;
        if ($validated['role'] === 'corporate') {
            $company = Company::create([
                'name' => $validated['company_name'] ?? 'Enterprise Team',
                'vat_number' => $validated['vat_number'] ?? 'EU' . rand(100000000, 999999999),
                'billing_email' => $validated['email'],
                'max_seats' => 10,
                'used_seats' => 1,
            ]);
            $companyId = $company->id;
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'company_id' => $companyId,
        ]);

        Auth::login($user);

        if ($user->isCorporate()) {
            return redirect()->route('corporate.dashboard');
        }

        return redirect()->route('courses.index');
    }

    /**
     * Quick Demo Switcher - seamlessly logs in as seeded role for easy evaluation
     */
    public function demoLogin(string $role): RedirectResponse
    {
        $email = match ($role) {
            'admin' => 'admin@nexused.test',
            'corporate' => 'corporate@nexused.test',
            default => 'student@nexused.test',
        };

        $user = User::firstWhere('email', $email);
        if ($user) {
            Auth::login($user);
        }

        if ($role === 'admin') {
            return redirect()->route('admin.generator');
        } elseif ($role === 'corporate') {
            return redirect()->route('corporate.dashboard');
        }

        return redirect()->route('courses.index');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('courses.index');
    }
}

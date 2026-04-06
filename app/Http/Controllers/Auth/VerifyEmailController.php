<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the user's email address as verified.
     * Works without requiring the user to be logged in.
     */
    public function __invoke(Request $request, $id, $hash): RedirectResponse
    {
        $user = User::findOrFail($id);

        // Verify the hash matches the user's email
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403, 'Invalid verification link.');
        }

        // If already verified, redirect to login with success
        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')->with('status', 'email-already-verified');
        }

        // Mark as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // If user is logged in, redirect to dashboard
        if ($request->user() && $request->user()->id === $user->id) {
            return redirect()->intended(route('dashboard', absolute: false) . '?verified=1');
        }

        // If not logged in, redirect to login with success message
        return redirect()->route('login')->with('status', 'email-verified');
    }
}

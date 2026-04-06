<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // Update google_id if not set
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
                
                // Update avatar if not set
                if (!$user->avatar && $googleUser->avatar) {
                    $user->update(['avatar' => $googleUser->avatar]);
                }
            } else {
                // Create new user exactly like RegisteredUserController
                $userData = [
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(Str::random(24)), // Give a random password
                    'type' => 'company',
                    'is_active' => 1,
                    'is_enable_login' => 1,
                    'created_by' => 0,
                    'plan_is_active' => 0, // Set to 0 like RegisteredUserController, Observer will handle it
                    'avatar' => $googleUser->avatar,
                    'lang' => 'en',
                    'status' => 'active',
                ];
                
                $user = User::create($userData);

                // Assign role and settings to the user
                defaultRoleAndSetting($user);
                
                // Force role assignment just in case defaultRoleAndSetting fails silently
                $companyRole = Role::where('name', 'company')->first();
                if ($companyRole && !$user->hasRole('company')) {
                    $user->assignRole($companyRole);
                }
                
                // Clear permission cache for this user
                app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            }

            Auth::login($user);

            return redirect()->intended('dashboard');

        } catch (\Exception $e) {
            \Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Something went wrong with Google login.');
        }
    }
}

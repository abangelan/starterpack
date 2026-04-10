<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $superAdmin = Role::create([
            'name'        => 'Super Admin',
            'description' => 'Akses penuh ke semua fitur sistem',
            'is_active'   => true,
        ]);

        $admin = Role::create([
            'name'        => 'Admin',
            'description' => 'Akses manajemen pengguna dan data',
            'is_active'   => true,
        ]);

        $user = Role::create([
            'name'        => 'User',
            'description' => 'Akses terbatas hanya fitur dasar',
            'is_active'   => true,
        ]);

        // Create admin user
        $adminUser = User::create([
            'name'     => 'Super Administrator',
            'email'    => 'admin@starterpack.com',
            'password' => Hash::make('password'),
            'status'   => 'active',
        ]);
        $adminUser->roles()->attach($superAdmin);

        // Sample users
        $sampleAdminUser = User::create([
            'name'     => 'Budi Admin',
            'email'    => 'admin2@starterpack.com',
            'password' => Hash::make('password'),
            'status'   => 'active',
        ]);
        $sampleAdminUser->roles()->attach($admin);

        $regularUser = User::create([
            'name'     => 'Siti User',
            'email'    => 'user@starterpack.com',
            'password' => Hash::make('password'),
            'status'   => 'active',
        ]);
        $regularUser->roles()->attach($user);

        $inactiveUser = User::create([
            'name'     => 'Andi Nonaktif',
            'email'    => 'inactive@starterpack.com',
            'password' => Hash::make('password'),
            'status'   => 'inactive',
        ]);
        $inactiveUser->roles()->attach($user);

        $this->command->info('✅ Seed berhasil!');
        $this->command->info('🔑 Login: admin@starterpack.com / password');
    }
}

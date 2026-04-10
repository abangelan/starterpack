<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Exports\UsersExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->role_id) {
            $query->whereHas('roles', fn($q) => $q->where('roles.id', $request->role_id));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $perPage = $request->per_page ?? 10;
        $users   = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|confirmed|min:6',
            'role_id'  => 'required|exists:roles,id',
            'status'   => 'in:active,inactive',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'status'   => $request->status ?? 'active',
        ]);

        $user->roles()->sync([$request->role_id]);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan',
            'data'    => $user->load('roles'),
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json(['data' => $user->load('roles')]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|confirmed|min:6',
            'role_id'  => 'required|exists:roles,id',
            'status'   => 'in:active,inactive',
        ]);

        $user->update([
            'name'   => $request->name,
            'email'  => $request->email,
            'status' => $request->status ?? $user->status,
            ...($request->password ? ['password' => Hash::make($request->password)] : []),
        ]);

        $user->roles()->sync([$request->role_id]);

        return response()->json([
            'message' => 'Pengguna berhasil diupdate',
            'data'    => $user->fresh()->load('roles'),
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'Tidak bisa menghapus akun sendiri'], 422);
        }
        $user->roles()->detach();
        $user->delete();
        return response()->json(['message' => 'Pengguna berhasil dihapus']);
    }

    public function exportExcel(Request $request)
    {
        return Excel::download(new UsersExport($request->all()), 'users_' . date('Ymd_His') . '.xlsx');
    }

    public function exportPdf(Request $request)
    {
        $query = User::with('roles');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($request->role_id) {
            $query->whereHas('roles', fn($q) => $q->where('roles.id', $request->role_id));
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $users = $query->latest()->get();

        $pdf = Pdf::loadView('exports.users-pdf', compact('users'))
            ->setPaper('a4', 'landscape');

        return $pdf->download('users_' . date('Ymd_His') . '.pdf');
    }
}

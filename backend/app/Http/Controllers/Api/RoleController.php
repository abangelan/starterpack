<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Exports\RolesExport;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::withCount('users');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->is_active !== null && $request->is_active !== '') {
            $query->where('is_active', (bool) $request->is_active);
        }

        $perPage = $request->per_page ?? 10;
        $roles   = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $roles->items(),
            'meta' => [
                'current_page' => $roles->currentPage(),
                'last_page'    => $roles->lastPage(),
                'per_page'     => $roles->perPage(),
                'total'        => $roles->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|unique:roles,name',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $role = Role::create([
            'name'        => $request->name,
            'description' => $request->description,
            'is_active'   => $request->is_active ?? true,
        ]);

        return response()->json([
            'message' => 'Role berhasil ditambahkan',
            'data'    => $role->loadCount('users'),
        ], 201);
    }

    public function show(Role $role)
    {
        return response()->json(['data' => $role->loadCount('users')]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name'        => 'required|string|unique:roles,name,' . $role->id,
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $role->update([
            'name'        => $request->name,
            'description' => $request->description,
            'is_active'   => $request->is_active ?? $role->is_active,
        ]);

        return response()->json([
            'message' => 'Role berhasil diupdate',
            'data'    => $role->fresh()->loadCount('users'),
        ]);
    }

    public function destroy(Role $role)
    {
        if ($role->users()->count() > 0) {
            return response()->json([
                'message' => 'Role tidak bisa dihapus karena masih digunakan oleh ' . $role->users()->count() . ' pengguna.'
            ], 422);
        }
        $role->delete();
        return response()->json(['message' => 'Role berhasil dihapus']);
    }

    public function exportExcel(Request $request)
    {
        return Excel::download(new RolesExport($request->all()), 'roles_' . date('Ymd_His') . '.xlsx');
    }

    public function exportPdf(Request $request)
    {
        $query = Role::withCount('users');

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        if ($request->is_active !== null && $request->is_active !== '') {
            $query->where('is_active', (bool) $request->is_active);
        }

        $roles = $query->latest()->get();

        $pdf = Pdf::loadView('exports.roles-pdf', compact('roles'))
            ->setPaper('a4', 'landscape');

        return $pdf->download('roles_' . date('Ymd_His') . '.pdf');
    }
}

<?php

namespace App\Exports;

use App\Models\Role;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RolesExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Role::withCount('users');

        if (!empty($this->filters['search'])) {
            $query->where('name', 'like', '%' . $this->filters['search'] . '%');
        }
        if (isset($this->filters['is_active']) && $this->filters['is_active'] !== '') {
            $query->where('is_active', (bool) $this->filters['is_active']);
        }

        return $query->latest();
    }

    public function headings(): array
    {
        return ['No', 'Nama Role', 'Deskripsi', 'Jumlah User', 'Status', 'Tanggal Dibuat'];
    }

    public function map($role): array
    {
        static $no = 0;
        $no++;
        return [
            $no,
            $role->name,
            $role->description ?? '-',
            $role->users_count,
            $role->is_active ? 'Aktif' : 'Nonaktif',
            $role->created_at->format('d/m/Y H:i'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}

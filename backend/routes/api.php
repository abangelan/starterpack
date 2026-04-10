<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use Illuminate\Support\Facades\Route;

// Public route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Users – export must be before apiResource to avoid conflict with {user}
    Route::get('/users/export-excel', [UserController::class, 'exportExcel']);
    Route::get('/users/export-pdf',   [UserController::class, 'exportPdf']);
    Route::apiResource('/users', UserController::class);

    // Roles – export before apiResource
    Route::get('/roles/export-excel', [RoleController::class, 'exportExcel']);
    Route::get('/roles/export-pdf',   [RoleController::class, 'exportPdf']);
    Route::apiResource('/roles', RoleController::class);
});

<?php

use App\Http\Controllers\QMSController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->name('quality_management_system.')->prefix('quality-management-system')->group(function () {
    Route::get('/home/{team_id?}/{project_id?}', [QMSController::class, 'index'])->name('index');
    Route::get('settings/{project_id?}', [QMSController::class, 'settings'])->name('settings');
    Route::post('/store', [QMSController::class, 'store'])->name('store');
    Route::post('/update/{id?}', [QMSController::class, 'update'])->name('update');
    Route::post('/destroy/{id?}', [QMSController::class, 'destroy'])->name('destroy');
    Route::post('save-column-order', [QMSController::class, 'order'])->name('order');
});

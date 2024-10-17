<?php

use App\Http\Controllers\QMSController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::middleware(['qa_user'])->name('quality_management_system.')->prefix('quality-management-system')->group(function () {
    Route::get('/home/{team_id?}/{project_id?}', [QMSController::class, 'index'])->name('index');
    Route::get('settings/{project_id?}', [QMSController::class, 'settings'])->name('settings');
    Route::post('/store', [QMSController::class, 'store'])->name('store');
    Route::post('/update/{id?}', [QMSController::class, 'update'])->name('update');
    Route::post('/destroy/{id?}', [QMSController::class, 'destroy'])->name('destroy');
    Route::post('save-column-order', [QMSController::class, 'order'])->name('order');
});

Route::middleware(['qa_user'])->name('qa_group.')->prefix('qa-group')->group(function () {
    Route::get('/index/{qa_group_id?}', [QMSController::class, 'qa_index'])->name('index');
    Route::post('/store', [QMSController::class, 'qa_store'])->name('store');
    Route::post('/update/{id}', [QMSController::class, 'qa_update'])->name('update');
    Route::get('/show/{id}', [QMSController::class, 'qa_show'])->name('show');
    Route::post('/destroy/{id}', [QMSController::class, 'qa_destroy'])->name('destroy');
    Route::post('/transfer/{qa_group_id}', [QMSController::class, 'qa_transfer'])->name('transfer');
    Route::post('/unassign', [QMSController::class, 'qa_unassign'])->name('unassign');

    Route::get('/scoring/{project_id?}', [QMSController::class, 'scoring'])->name('scoring');
    Route::post('/save_rating', [QMSController::class, 'save_rating'])->name('save_rating');
    Route::post('/update_rating', [QMSController::class, 'update_rating'])->name('update_rating');
});

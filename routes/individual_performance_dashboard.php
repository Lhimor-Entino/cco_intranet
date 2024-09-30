<?php

use App\Http\Controllers\IndividualPerformanceController;

use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->name('individual_performance_dashboard.')->prefix('individual-performance-dashboard')->group(function () {
    Route::get('individual-performance/{project_id?}', [IndividualPerformanceController::class, 'index'])->name('index');
    Route::get('/team-performance/{team_id?}/{project_id?}', [IndividualPerformanceController::class, 'team'])->name('team');
    Route::get('/project-performance/{project_id?}', [IndividualPerformanceController::class, 'project'])->name('project');
    Route::get('/settings/{project_id?}', [IndividualPerformanceController::class, 'settings'])->name('settings');
    Route::post('/store', [IndividualPerformanceController::class, 'store'])->name('store');
    Route::post('/update/{metric_id}', [IndividualPerformanceController::class, 'update'])->name('update');
    Route::post('/destroy/{metric_id}', [IndividualPerformanceController::class, 'destroy'])->name('destroy');
    Route::post('/save-column-order', [IndividualPerformanceController::class, 'order'])->name('save.order');

    Route::name('agent.')->prefix('agent')->group(function () {
        Route::get('/rating/{project_id?}', [IndividualPerformanceController::class, 'rating'])->name('rating');
        Route::post('/save_rating', [IndividualPerformanceController::class, 'save_rating'])->name('save_rating');
        Route::post('/update_rating', [IndividualPerformanceController::class, 'update_rating'])->name('update_rating');
    });
});

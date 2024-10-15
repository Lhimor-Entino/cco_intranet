<?php

use App\Http\Controllers\IndividualPerformanceController;
use App\Http\Controllers\QMSController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->name('quality_management_system.')->prefix('quality_management_system')->group(function () {
    Route::get('', [QMSController::class, 'index'])->name('index');
});

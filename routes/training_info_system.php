<?php

use App\Http\Controllers\AgentAssessmentController;
use App\Http\Controllers\TrainingAssessmentController;
use App\Http\Controllers\TrainingFolderController;
use App\Http\Controllers\TrainingInfoSystemController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::middleware(['team_leader'])->prefix('training_info_system')->name('training_info_system.')->group(function(){
        Route::get('/',[TrainingInfoSystemController::class,'index'])->name('index');
        Route::get('/admin/{id?}/{sub_folder_id?}',[TrainingInfoSystemController::class,'admin'])->name('admin');
        Route::post('/store',[TrainingInfoSystemController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[TrainingInfoSystemController::class,'destroy'])->name('destroy');
        Route::get('/edit/{id}/{version?}',[TrainingInfoSystemController::class,'edit'])->name('edit');
        Route::get('/edit/beta/{main_folder_id}/{id}/{version?}',[TrainingInfoSystemController::class,'edit2'])->name('edit2');
        Route::post('/update/{id}',[TrainingInfoSystemController::class,'update'])->name('update');
        Route::post('/upload_video/{id}',[TrainingInfoSystemController::class,'upload_video'])->name('upload_video');
        Route::post('/upload_image/{id}',[TrainingInfoSystemController::class,'upload_image'])->name('upload_image');        
        Route::post('/save_draft/{id}/{version}',[TrainingInfoSystemController::class,'save_draft'])->name('save_draft');        
        Route::post('/save_as_new/{id}/',[TrainingInfoSystemController::class,'save_as_new'])->name('save_as_new');
    });

    Route::prefix('training_folder')->name('training_folder.')->group(function(){
        Route::post('/store',[TrainingFolderController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[TrainingFolderController::class,'destroy'])->name('destroy');        
        Route::post('/update/{id}',[TrainingFolderController::class,'update'])->name('update');
        Route::prefix('sub')->name('sub.')->group(function(){
            Route::post('/store',[TrainingFolderController::class,'sub_store'])->name('store');
            Route::post('/update/{id}',[TrainingFolderController::class,'sub_update'])->name('update');
            Route::post('/destroy/{id}',[TrainingFolderController::class,'sub_destroy'])->name('destroy');
        });
    });
    
    Route::middleware(['team_leader'])->prefix('assessment')->name('assessment.')->group(function(){
        //admin side
        Route::get('/',[TrainingAssessmentController::class,'index'])->name('index');
        Route::post('/store/',[TrainingAssessmentController::class,'store'])->name('store');
        Route::post('/destroy/{id}',[TrainingAssessmentController::class,'destroy'])->name('destroy');
        Route::post('/update/{id}',[TrainingAssessmentController::class,'update'])->name('update');
        Route::get('/edit/{main_folder_id}/{id}',[TrainingAssessmentController::class,'edit'])->name('edit');
        Route::prefix('questions')->name('questions.')->group(function(){
            Route::post('/store',[TrainingAssessmentController::class,'question_store'])->name('store');
            Route::post('/update/{id}',[TrainingAssessmentController::class,'question_update'])->name('update');
            Route::post('/destroy/{id}',[TrainingAssessmentController::class,'question_destroy'])->name('destroy');
            Route::post('/upload_video/{id}',[TrainingAssessmentController::class,'question_upload_video'])->name('upload_video');
            Route::post('/upload_image/{id}',[TrainingAssessmentController::class,'question_upload_image'])->name('upload_image');
        });
        Route::prefix('links')->name('links.')->group(function(){
            Route::post('/store',[TrainingAssessmentController::class,'link_store'])->name('store');
        });

        Route::prefix('agent')->name('agent.')->group(function(){            
            Route::get('/show/{uuid}',[AgentAssessmentController::class,'show'])->name('show');
            Route::post('/store',[AgentAssessmentController::class,'store'])->name('store');
        });
        
        Route::post('manual_check',[TrainingAssessmentController::class,'manual_check'])->name('manual_check');
    });
});
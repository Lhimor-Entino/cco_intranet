<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingFolderProjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //this is a pivot table for many to many relationship between training folders and projects
        Schema::create('training_folder_projects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_folder_id')->index();
            $table->unsignedBigInteger('project_id')->index();
            
            $table->timestamps();
            $table->foreign('training_folder_id')->references('id')->on('training_folders')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_folder_projects');
    }
}

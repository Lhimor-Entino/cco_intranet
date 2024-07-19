<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingSubFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_sub_folders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_folder_id')->index()->nullable();
            //self referencing foreign key for recursive relationship
            $table->unsignedBigInteger('training_sub_folder_id')->index()->nullable();
            $table->unsignedBigInteger('user_id')->index(); //creator
            $table->string('name');
            $table->timestamps();

            $table->foreign('training_folder_id')->references('id')->on('training_folders')->onDelete('cascade');
            $table->foreign('training_sub_folder_id')->references('id')->on('training_sub_folders')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_sub_folders');
    }
}

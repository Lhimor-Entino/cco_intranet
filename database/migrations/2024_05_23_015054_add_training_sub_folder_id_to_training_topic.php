<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTrainingSubFolderIdToTrainingTopic extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('training_topics', function (Blueprint $table) {
            $table->unsignedBigInteger('training_sub_folder_id')->index()->nullable();
            $table->foreign('training_sub_folder_id')->references('id')->on('training_sub_folders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('training_topics', function (Blueprint $table) {
            $table->dropForeign(['training_sub_folder_id']);
            $table->dropColumn('training_sub_folder_id');
        });
    }
}

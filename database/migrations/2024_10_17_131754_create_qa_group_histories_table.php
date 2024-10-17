<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQaGroupHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qa_group_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('qa_group_id')->index()->nullable();
            $table->unsignedBigInteger('user_id')->index();
            $table->date('start_date');
            $table->timestamps();
            $table->foreign('qa_group_id')->references('id')->on('qa_groups')->onDelete('set null');
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
        Schema::dropIfExists('qa_group_histories');
    }
}

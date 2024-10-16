<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQaElementScoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qa_element_scores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('qa_element_id')->index('metric_id');
            $table->unsignedBigInteger('user_id')->index();
            $table->decimal('score', 25, 2)->default(0);
            $table->date('date');
            $table->smallInteger('is_applicable')->default(1);
            $table->timestamps();

            $table->foreign('qa_element_id')->references('id')->on('qa_elements')->onDelete('cascade');
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
        Schema::dropIfExists('qa_element_scores');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingAssessmentResultAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_assessment_result_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_assessment_result_id')->index('result_id');
            $table->tinyInteger('question_type');
            $table->text('question');
            $table->string('correct_answer');
            $table->text('user_answer');
            $table->integer('score');
            $table->integer('points');
            $table->tinyInteger('needs_manual_check')->default(0);
            $table->timestamps();

            $table->foreign('training_assessment_result_id','result_id')->references('id')->on('training_assessment_results')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_assessment_result_answers');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingAssessmentQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_assessment_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_assessment_id')->index();
            $table->text('question');
            $table->integer('points')->default(1);
            $table->string('answer');
            /*
            1- Multiple Choice
            2- Multiple Answers
            3- Type the Answer
            4- Enumeration
            5- Essay
            More will be probably added in the future..
            */
            $table->tinyInteger('question_type')->default('1');
            $table->timestamps();

            $table->foreign('training_assessment_id')->references('id')->on('training_assessments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_assessment_questions');
    }
}

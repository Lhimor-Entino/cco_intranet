<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingAssessmentQuestionChoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_assessment_question_choices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_assessment_question_id')->index('q_id');
            $table->string('choice');
            $table->timestamps();

            $table->foreign('training_assessment_question_id','q_id')->references('id')->on('training_assessment_questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_assessment_question_choices');
    }
}

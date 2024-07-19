<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingAssessmentResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_assessment_results', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_assessment_id')->index('ta_id')->nullable(); // Used only for reference, questions are copied from the assessment in case of changes
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('checked_by_id')->index()->nullable();
            $table->integer('max_score');
            $table->integer('user_score');
            $table->integer('passing_score');
            $table->dateTime('date_checked')->nullable();
            $table->timestamps();

            $table->foreign('training_assessment_id','ta_id')->references('id')->on('training_assessments')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('checked_by_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_assessment_results');
    }
}

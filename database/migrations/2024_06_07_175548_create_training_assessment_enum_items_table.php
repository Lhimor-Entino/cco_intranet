<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingAssessmentEnumItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_assessment_enum_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_assessment_question_id')->index('question_id');
            $table->string('item');
            $table->timestamps();

            $table->foreign('training_assessment_question_id','question_id')->references('id')->on('training_assessment_questions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('training_assessment_enum_items');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingTopicVersionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('training_topic_versions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_topic_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->text('content')->nullable();
            $table->string('version')->nullable();
            $table->tinyInteger('is_active')->default(0);
            $table->timestamps();

            $table->foreign('training_topic_id')->references('id')->on('training_topics')->onDelete('cascade');
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
        Schema::dropIfExists('training_topic_versions');
    }
}

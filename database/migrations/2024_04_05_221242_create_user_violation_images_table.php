<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserViolationImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_violation_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_violation_id')->index();
            $table->string('image');
            $table->timestamps();

            $table->foreign('user_violation_id')->references('id')->on('user_violations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_violation_images');
    }
}

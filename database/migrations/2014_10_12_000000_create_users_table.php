<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('photo')->nullable();
            $table->string('company_id')->index()->unique();
            $table->string('email')->unique()->nullable();            
            $table->date('date_of_birth');
            $table->string('position')->nullable();            
            $table->string('department')->nullable();
            $table->string('project')->nullable();
            $table->string('site')->nullable();
            $table->date('date_hired')->nullable();
            $table->date('date_resigned')->nullable();            
            $table->string('schedule')->nullable();
            $table->tinyInteger('level')->default(3);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

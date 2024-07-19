<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsEditedToUserAttendances extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_attendances', function (Blueprint $table) {
            $table->tinyInteger('edited_time_in')->default(0);
            $table->unsignedBigInteger('edited_time_in_by_id')->nullable()->index();
            $table->datetime('edited_time_in_date')->nullable();
            $table->tinyInteger('edited_time_out')->default(0);
            $table->unsignedBigInteger('edited_time_out_by_id')->nullable()->index();
            $table->datetime('edited_time_out_date')->nullable();

            $table->foreign('edited_time_in_by_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('edited_time_out_by_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_attendances', function (Blueprint $table) {
            $table->dropColumn('edited_time_in');
            $table->dropColumn('edited_time_out');
            $table->dropForeign(['edited_time_in_by_id']);
            $table->dropForeign(['edited_time_out_by_id']);
            $table->dropColumn('edited_time_in_by_id');
            $table->dropColumn('edited_time_out_by_id');
            $table->dropColumn('edited_time_in_date');
            $table->dropColumn('edited_time_out_date');
        });
    }
}

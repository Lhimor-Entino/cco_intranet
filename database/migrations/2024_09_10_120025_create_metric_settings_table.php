<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMetricSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('metric_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('individual_performance_metric_id');
            $table->string('name');
            $table->string('value');
            $table->string('tag');
            $table->unique(['individual_performance_metric_id', 'name', 'tag']);
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
        // First, drop the composite unique index before dropping the table
        Schema::table('metric_settings', function (Blueprint $table) {
            $table->dropUnique(['individual_performance_metric_id', 'name', 'tag']);
        });

        Schema::dropIfExists('metric_settings');
    }
}

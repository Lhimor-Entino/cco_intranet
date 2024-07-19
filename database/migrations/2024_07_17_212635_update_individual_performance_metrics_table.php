<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UpdateIndividualPerformanceMetricsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /**
         * WE ARE USING QUERY BUILDING HERE BECAUSE USING BLUEPRINT REQUIRES INSTALLING DOCTRINE/DBAL
         */
        // Update the goal column from int to float
        DB::statement('ALTER TABLE individual_performance_metrics MODIFY COLUMN goal FLOAT');

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Reverse the modifications
        DB::statement('ALTER TABLE individual_performance_metrics MODIFY COLUMN goal INT');
    }
}

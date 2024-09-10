<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetricSettings extends Model
{
    use HasFactory;
    protected $fillable = ['individual_performance_metric_id', 'name', 'tag', 'value'];

    public function metric()
    {
        return $this->belongsTo(IndividualPerformanceUserMetric::class);
    }
}

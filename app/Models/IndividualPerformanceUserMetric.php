<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndividualPerformanceUserMetric extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function metric()
    {
        return $this->belongsTo(IndividualPerformanceMetric::class, 'individual_performance_metric_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

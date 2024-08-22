<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndividualPerformanceMetric extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $with = ['project', 'user'];
    protected $appends = ['daily_goal'];



    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user_metrics()
    {
        return $this->hasMany(IndividualPerformanceUserMetric::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getDailyGoalAttribute()
    {
        if ($this->goal !== 0) {
            $noDecimal = ($this->goal === (int) $this->goal);
            if ($this->format === 'number') {
                return $this->goal . ($noDecimal ? '.00 ' : ' ') . $this->unit;
            }
            if ($this->format === 'percentage') {
                return $this->goal . ($noDecimal ? '.00% ' : '% ');
            }
            if ($this->format === 'duration') {
                return $this->minutesToHHMMSS($this->goal);
            }
            if ($this->format === 'rate') {
                return $this->goal . ($noDecimal ? '.00 per ' : ' per ') . $this->rate_unit;
            }
        }
        return 'No Daily Goals';
    }

    private function minutesToHHMMSS($minutes)
    {
        $totalSeconds = round($minutes * 60);
        $hours = floor($totalSeconds / 3600);
        $remainingSeconds = $totalSeconds % 3600;
        $minutesPart = floor($remainingSeconds / 60);
        $secondsPart = $remainingSeconds % 60;

        $formattedHours = str_pad($hours, 2, '0', STR_PAD_LEFT);
        $formattedMinutes = str_pad($minutesPart, 2, '0', STR_PAD_LEFT);
        $formattedSeconds = str_pad($secondsPart, 2, '0', STR_PAD_LEFT);
        // return "$remainingSeconds";
        return "$formattedHours:$formattedMinutes:$formattedSeconds";
    }
    public function scopeWithRoundedGoals($query)
    {
        return $query->selectRaw('
            id,project_id,user_id,metric_name,ROUND(goal,2) as goal, format,unit,rate_unit,position
        ');
    }
}

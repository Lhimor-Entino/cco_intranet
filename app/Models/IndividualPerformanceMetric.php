<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndividualPerformanceMetric extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $with = ['project','user'];
    protected $appends = ['daily_goal'];

    

    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function user_metrics(){
        return $this->hasMany(IndividualPerformanceUserMetric::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function getDailyGoalAttribute(){
        if($this->goal!==0){
            if($this->format==='number'){
                return $this->goal.'.00 '.$this->unit;
            }
            if($this->format==='percentage'){
                return $this->goal.'.00%';
            }
            if($this->format==='duration'){
                return $this->minutesToHHMMSS($this->goal);
            }
            if($this->format==='rate'){
                return $this->goal.'.00 per '.$this->rate_unit;
            }
        }
        return 'No Daily Goals';
    }

    private function minutesToHHMMSS($minutes){
        $totalSeconds = $minutes * 60;
        $hours = floor($totalSeconds / 3600);
        $remainingSeconds = $totalSeconds % 3600;
        $minutesPart = floor($remainingSeconds / 60);
        $secondsPart = $remainingSeconds % 60;

        $formattedHours = str_pad($hours, 2, '0', STR_PAD_LEFT);
        $formattedMinutes = str_pad($minutesPart, 2, '0', STR_PAD_LEFT);
        $formattedSeconds = str_pad($secondsPart, 2, '0', STR_PAD_LEFT);

        return "$formattedHours:$formattedMinutes:$formattedSeconds";

    }
}

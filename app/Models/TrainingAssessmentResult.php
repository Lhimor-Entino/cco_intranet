<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingAssessmentResult extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $with = ['assessment','user','answers','checked_by'];
    public function assessment(){
        return $this->belongsTo(TrainingAssessment::class,'training_assessment_id');
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function answers(){
        return $this->hasMany(TrainingAssessmentResultAnswer::class);
    }
    public function checked_by(){
        return $this->belongsTo(User::class,'checked_by_id');
    }
}

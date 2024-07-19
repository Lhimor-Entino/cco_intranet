<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingAssessmentLink extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $with = ['user'];
    protected $appends = ['status','link'];
    //user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assessment()
    {
        return $this->belongsTo(TrainingAssessment::class,'training_assessment_id');
    }

    public function getStatusAttribute()
    {
        //return Archived if archived is 1
        if ($this->archived == 1) {
            return 'Archived';
        }
        //return active if valid_until is greater than current date
        if ($this->valid_until > now()) {
            return 'Active';
        }
        //return expired if valid_until is less than current date
        if ($this->valid_until < now()) {
            return 'Expired';
        }
    }

    public function getLinkAttribute():string
    {
        return route('assessment.agent.show',$this->uuid);
    }
}

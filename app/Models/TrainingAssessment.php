<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingAssessment extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $with = ['questions','user','sub_folder','links'];
    protected $appends = ['total_points'];

    public function questions(){
        return $this->hasMany(TrainingAssessmentQuestion::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function sub_folder(){        
        //return the sub folder that owns this sub folder, but don't eager load the children of the parent
        return $this->belongsTo(TrainingSubFolder::class, 'training_sub_folder_id','id')->without('children');
        
    }

    public function links(){
        return $this->hasMany(TrainingAssessmentLink::class);
    }

    public function getTotalPointsAttribute(){
        return $this->questions->sum('points');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingSubFolder extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $with = ['children','user','parent'];
    protected $appends = ['topic_titles','assessment_titles'];

    //self referencing foreign key for recursive relationship
    public function children(){
        return $this->hasMany(TrainingSubFolder::class,'training_sub_folder_id','id' );
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function parent(){
        //return the sub folder that owns this sub folder, but don't eager load the children of the parent
        return $this->belongsTo(TrainingSubFolder::class, 'training_sub_folder_id','id')->without('children');
    }

    public function topics(){
        return $this->hasMany(TrainingTopic::class);
    }

    public function assessments(){
        return $this->hasMany(TrainingAssessment::class);
    }

    public function getTopicTitlesAttribute(){
        return $this->topics()->pluck('title')??[];
    }

    public function getAssessmentTitlesAttribute(){
        return $this->assessments()->pluck('title')??[];
    }

}

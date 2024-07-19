<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingTopic extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['version_names'];
    protected $with =['sub_folder','user'];

    public function versions()
    {
        return $this->hasMany(TrainingTopicVersion::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function current_version(){
        return $this->hasOne(TrainingTopicVersion::class)->where('is_active',1);
    }

    public function getVersionNamesAttribute(){
        return $this->versions->pluck('version')->toArray();
    }

    public function sub_folder(){
        return $this->belongsTo(TrainingSubFolder::class,'training_sub_folder_id');
    }
}

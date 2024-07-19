<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingFolder extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $with = ['projects', 'user'];
    protected $appends = ['sub_folder_count'];

    public function projects(){
        return $this->belongsToMany(Project::class,TrainingFolderProject::class , 'training_folder_id', 'project_id');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function sub_folders(){
        return $this->hasMany(TrainingSubFolder::class);
    }

    public function getSubFolderCountAttribute(){
        return $this->sub_folders()->count();
    }
}

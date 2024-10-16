<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QAElements extends Model
{
    use HasFactory;
    protected $table = 'qa_elements';
    protected $with = ['user', 'project'];
    protected $fillable = [
        'project_id',
        'user_id',
        'qa_element',
        'goal',
        'position'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user_scores()
    {
        return $this->hasMany(QaElementScores::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function settings($tag)
    {
        return $this->hasMany(MetricSettings::class)->where('tag', $tag);
    }

    public function setting($tag, $name)
    {
        return $this->hasOne(MetricSettings::class)->where('tag', $tag)->where('name', $name);
    }
}

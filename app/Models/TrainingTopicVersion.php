<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingTopicVersion extends Model
{
    use HasFactory;
    protected $with =['user'];
    protected $guarded = [];
    // protected $casts = [
    //     'content' => 'array',
    // ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getContentAttribute($value)
    {
        
        return json_decode($value); 
    }
}

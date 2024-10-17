<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaGroupHistories extends Model
{
    use HasFactory;
    protected $fillable = ['qa_group_id', 'user_id', 'start_date'];
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}

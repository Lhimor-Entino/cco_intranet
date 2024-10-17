<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaElementScores extends Model
{
    use HasFactory;
    protected $fillable = [
        'qa_element_id',
        'user_id',
        'score',
        'is_applicable',
        'date'
    ];
}

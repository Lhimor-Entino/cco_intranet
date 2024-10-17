<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QaGroups extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $with = ['user', 'elements'];
    protected $fillable = ['user_id', 'name', 'qa_group_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function users()
    {
        return $this->hasMany(User::class, 'qa_group_id');
    }
}

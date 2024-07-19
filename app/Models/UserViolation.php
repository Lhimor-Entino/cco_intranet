<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserViolation extends Model
{
    use HasFactory;
    protected $fillable = ['user_id','violation','description','date'];
    protected $with = ['images'];
    public function images(){
        return $this->hasMany(UserViolationImage::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('order', function (Builder $builder) {
            $builder->orderBy('date', 'desc');
        });
    }
}

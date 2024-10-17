<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use PhpParser\Node\Expr\Cast\Bool_;

class User extends Authenticatable

{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];
    protected $with = ['shift', 'project'];
    protected $appends = ['has_settings_access', 'team_join_date', 'qa_assigned_date'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getFirstNameAttribute($value)
    {
        return Str::headline(Str::of($value)->lower());
    }

    public function getLastNameAttribute($value)
    {
        return Str::headline(Str::of($value)->lower());
    }

    public function getMiddleNameAttribute($value)
    {
        return Str::headline(Str::of($value)->lower());
    }

    public function getPhotoAttribute($value)
    {
        if ($value && str_contains(strtolower($value), 'http')) {
            return $value;
        }
        if (!$value) {
            return null;
        }
        return url('/') . '/public/' . $value;
    }

    public function getCompanyIdAttribute($value)
    {
        return Str::of($value)->upper();
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function attendances()
    {
        return $this->hasMany(UserAttendance::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    protected static function booted()
    {
        static::addGlobalScope('is_archived', function (Builder $builder) {
            $builder->where('is_archived', 0);
        });
    }

    public function user_skills()
    {
        return $this->hasMany(UserSkill::class);
    }

    public function violations()
    {
        return $this->hasMany(UserViolation::class);
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function getHasSettingsAccessAttribute(): Bool
    {
        return $this->position == 'PROGRAMMER' ||
            $this->position == 'REPORTS ANALYST' ||
            $this->position == 'QUALITY ANALYST 5' ||
            $this->position == 'REAL TIME ANALYST' ||
            $this->position == 'GENERAL MANAGER' ||
            $this->position == 'OPERATIONS SUPERVISOR' ||
            $this->position == 'QUALITY ANALYST 1' ||
            $this->position == 'OPERATIONS SUPERVISOR 2' ||
            $this->position == 'QUALITY ANALYST 6' ||
            $this->position == 'QUALITY ANALYST 2' ||
            $this->position == 'QUALITY ANALYST 4' ||
            $this->position == 'QUALITY ASSURANCE AND TRAINING SUPERVISOR' ||
            $this->position == 'QUALITY ANALYST' ||
            $this->position == 'OPERATIONS MANAGER';
    }

    public function team_histories()
    {
        return $this->hasMany(TeamHistory::class);
    }

    public function qa_group_histories()
    {
        return $this->hasMany(QaGroupHistories::class, 'user_id');
    }

    public function getQaAssignedDateAttribute()
    {
        $latest = $this->qa_group_histories()->orderBy('id', 'desc')->first();
        return $latest ? $latest->start_date : null;
    }
    public function getTeamJoinDateAttribute()
    {
        $latest = $this->team_histories()->orderBy('id', 'desc')->first();
        return $latest ? $latest->start_date : null;
    }

    public function user_metrics()
    {
        return $this->hasMany(IndividualPerformanceUserMetric::class);
    }
    public function user_elements()
    {
        return $this->hasMany(QaElementScores::class, 'user_id');
    }
}

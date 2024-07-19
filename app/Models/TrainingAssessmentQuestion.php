<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingAssessmentQuestion extends Model
{
    use HasFactory;
    protected $guarded=[];
    protected $appends = ['question_type_description','formatted_answer','enum_item_count'];
    protected $with = ['choices','enum_items'];

    // public function getQuestionAttribute($value)    {
    //     return json_decode($value); 
    // }

    public function getFormattedAnswerAttribute()    {
        if(!$this->answer) return '';
        $questionType = $this->question_type;
        if($questionType == 2 || $questionType ==3){
            //if $questionType is 2 or 3, $this->answer is a pipe separated string, example: "Choice 1|Choice 2|Choice 3"
            //formattedAnswer is the answer to be displayed, example: "Choice 1, Choice 2, and Choice 3"
            $array_of_answers = explode('|',$this->answer);
            $formattedAnswer = '';
            foreach($array_of_answers as $key=>$answer){
                if($key == 0){
                    $formattedAnswer = $answer;
                }else if($key == count($array_of_answers)-1){
                    $formattedAnswer .= ', and '.$answer;
                }else{
                    $formattedAnswer .= ', '.$answer;
                }
            }
            return $formattedAnswer;

        }
        return $this->answer;
    }

    public function getQuestionTypeDescriptionAttribute()    {
        $questionType = $this->question_type;
        $questionTypeDescription = '';
        switch ($questionType) {
            case '1':
                $questionTypeDescription = ['type'=>1,'description'=>'Multiple Choice'];
                break;
            case '2':
                $questionTypeDescription = ['type'=>2,'description'=>'Multiple Answers'];
                break;
            case '3':
                $questionTypeDescription = ['type'=>3,'description'=>'Type the Answer'];
                break;
            case '4':
                $questionTypeDescription = ['type'=>4,'description'=>'Enumeration'];
                break;
            case '5':
                $questionTypeDescription = ['type'=>5,'description'=>'Essay'];
                break;
            case '6':
                $questionTypeDescription = ['type'=>6,'description'=>'Unkown Type'];
                break;
        }
        return $questionTypeDescription;
    }

    public function choices()    {
        return $this->hasMany(TrainingAssessmentQuestionChoice::class);
    }

    public function enum_items()    {
        return $this->hasMany(TrainingAssessmentEnumItem::class);
    }

    public function getEnumItemCountAttribute()    {
        return $this->enum_items()->count();
    }
}

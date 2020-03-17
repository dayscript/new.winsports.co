<?php

namespace Drupal\widget_programming;

use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

class WidgetProgrammingManager implements WidgetProgrammingManagerInterface {

  use StringTranslationTrait;

  public function __construct(TranslationInterface $string_translation) {
    $this->stringTranslation = $string_translation;
  }

  public function dates() {
    $months = ['January' => 'Enero','February' => 'Febrero','March' => 'Marzo','April' => 'Abril','May' => 'Mayo','June' => 'Junio','July' => 'Julio','August' => 'Agosto','September' => 'Septiembre','October' => 'Octubre','November' => 'Noviembre','December' => 'Diciembre'];
    $weekday = ['Mon' => 'Lun', 'Tue' => 'Mar', 'Wed' => 'Mié', 'Thu' => 'Jue', 'Fri' => 'Vie', 'Sat' => 'Sáb', 'Sun' => 'Dom'];
    $current_year = date('Y');
    $dates = [];
    $view = 7;
    $pos = 0;

    foreach (array_keys($months) as $key => $month) {
      $current_month = $key+1;
      $current_day = 1;
      if($current_month == date('n')){
        $current_day = date('j');
      }
      if($current_month == date('n')){
        $dates[$months[$month]] = [];
        for ($i=$current_day; $i <= cal_days_in_month(CAL_GREGORIAN, $current_month, $current_year) ; $i++) { 
          if($pos < $view){
            $dates[$months[$month]][] = ['day' => $i, 'weekday'=> $weekday[date('D', mktime(0, 0, 0, $current_month, $i, $current_year))], 'value' => date('Y-m-d', mktime(0, 0, 0, $current_month, $i, $current_year))];
          }
          $pos++;
        }    
      }
    }
    return $dates;
  }
}





















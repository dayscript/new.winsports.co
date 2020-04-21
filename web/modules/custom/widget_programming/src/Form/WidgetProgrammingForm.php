<?php

namespace Drupal\widget_programming\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\widget_programming\WidgetProgrammingManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class WidgetProgrammingForm extends FormBase {

  protected $Programming;

  public function __construct(WidgetProgrammingManagerInterface $widget_programming) {
    $this->Programming = $widget_programming;
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('widget_programming.manager')
    );
  }

  public function getFormId() {
    return 'widget_programming_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['widget_programming']['#attached']['library'][] = 'widget_programming/widget_programming.owlcarousel';
    $form['#attached']['drupalSettings']['settings']['programming_config'] = $data;

    $params = htmlspecialchars($_GET["date"]);
    $date_active = date('Y-m-d');
    if( isset($params) && !empty($params) ){
      $date_active =  $params;
    }

    $dates = $this->Programming->dates();
    $html = '';

    foreach ($dates as $km => $month) {
      $html_ = [];
      foreach ($month as $ks => $day) {
        $class_date = ($date_active == $day['value']) ? 'active' : '';
        $html_[] = '
        <div class="date flex-1 '.$class_date.'">
        <a href="programacion?date='.$day['value'].'">
          <div class="weekday">'.$day['weekday'].'</div>
          <div class="day">'.$day['day'].'</div>
        </a>
        </div>';
      }
      $html_owl[] = '<div class="item" data-merge="'.count($month).'"><h3>'.$km.'</h3><div class="items">'.implode($html_).'</div></div>';
    }
    $html .= '<div id="owl-programming" class="owl-carousel">'.implode($html_owl).'</div>';

    $form['dates'] = [
      '#type' => 'markup',
      '#markup' => $html,
    ];
    return $form;
  }
  
  public function validateForm(array &$form, FormStateInterface $form_state) {}

  public function submitForm(array &$form, FormStateInterface $form_state) {}
}


<?php

namespace Drupal\custom_ads\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CustomAdsForm extends FormBase implements ContainerInjectionInterface {

  public function __construct() {}

  public static function create(ContainerInterface $container) {
    return new static($container);
  }

  public function getFormId() {
    return 'custom_ads_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {}

}

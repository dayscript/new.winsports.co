<?php

namespace Drupal\custom_playlist\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CustomPlaylistSettings extends ConfigFormBase implements ContainerInjectionInterface {

  public function __construct() {}

  public static function create(ContainerInterface $container) {
    return new static();
  }

  protected function getEditableConfigNames() {
    return ['custom_playlist.settings'];
  }

  public function getFormId() {
    return 'custom_playlist_settings';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildForm($form, $form_state);
    
    $rounds = [];
    $rounds['all'] = 'Seleccione';
    $terms = \Drupal::service('entity_type.manager')->getStorage("taxonomy_term")->loadTree('rounds', 0, 1, true);
    foreach ($terms as $term) {
      $rounds[$term->get('tid')->value] = $term->get('name')->value;
    }
    $form['filter_liga'] = array(
      '#type' => 'select',
      '#title' => $this->t('Ronda'),
      '#description' => $this->t('Seleccione la Ronda por defecto para el bloque "Videos Liga"'),
      '#options' => $rounds,
      '#required' => FALSE,
      '#default_value' => $this->config('custom_playlist.settings')->get('filter_liga') ? $this->config('custom_playlist.settings')->get('filter_liga') : '',
    );
    $form['filter_torneo'] = array(
      '#type' => 'select',
      '#title' => $this->t('Ronda'),
      '#description' => $this->t('Seleccione la Ronda por defecto para el bloque "Videos Torneo"'),
      '#options' => $rounds,
      '#required' => FALSE,
      '#default_value' => $this->config('custom_playlist.settings')->get('filter_torneo') ? $this->config('custom_playlist.settings')->get('filter_torneo') : '',
    );
    $form['filter_copa'] = array(
      '#type' => 'select',
      '#title' => $this->t('Ronda'),
      '#description' => $this->t('Seleccione la Ronda por defecto para el bloque "Videos Copa"'),
      '#options' => $rounds,
      '#required' => FALSE,
      '#default_value' => $this->config('custom_playlist.settings')->get('filter_copa') ? $this->config('custom_playlist.settings')->get('filter_copa') : '',
    );

    $categoria = [];
    $categoria['all'] = 'Seleccione';
    $terms = \Drupal::service('entity_type.manager')->getStorage("taxonomy_term")->loadTree('categoria', 0, 1, true);
    foreach ($terms as $term) {
      $categoria[$term->get('tid')->value] = $term->get('name')->value;
    }
    $form['filter_otros'] = array(
      '#type' => 'select',
      '#title' => $this->t('Categoría'),
      '#description' => $this->t('Seleccione la Categoría por defecto para el bloque "Más Videos"'),
      '#options' => $categoria,
      '#required' => FALSE,
      '#default_value' => $this->config('custom_playlist.settings')->get('filter_otros') ? $this->config('custom_playlist.settings')->get('filter_otros') : '',
    );
    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('custom_playlist.settings')->set('filter_liga', $form_state->getValue('filter_liga'))->save();
    $this->config('custom_playlist.settings')->set('filter_torneo', $form_state->getValue('filter_torneo'))->save();
    $this->config('custom_playlist.settings')->set('filter_copa', $form_state->getValue('filter_copa'))->save();
    $this->config('custom_playlist.settings')->set('filter_otros', $form_state->getValue('filter_otros'))->save();
    \Drupal::messenger()->addMessage(t('Saved successfully!'), 'status');
  }
}

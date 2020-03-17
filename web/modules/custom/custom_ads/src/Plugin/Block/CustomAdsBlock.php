<?php

namespace Drupal\custom_ads\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\custom_ads\Form\CustomAdsForm;
use Drupal\node\Entity\Node;

/**
 * Provides a configurable block with Ads Plugin.
 *
 * @Block(
 *  id = "custom_ads_block",
 *  admin_label = @Translation("Custom Ads Block"),
 * )
 */
class CustomAdsBlock extends BlockBase implements ContainerFactoryPluginInterface {

  protected $formBuilder;

  public function __construct(array $configuration, $plugin_id, $plugin_definition, FormBuilderInterface $form_builder) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->formBuilder = $form_builder;
  }

  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('form_builder')
    );
  }

  public function blockForm($form, FormStateInterface $form_state) {
    $config = $this->getConfiguration();

    $query = \Drupal::entityQuery('node')
    ->condition('type', 'anuncio')
    ->condition('status', 1);    
    $response = $query->execute();

    $ads = [];
    foreach ($response as $key => $nid) {
      $node = $node = \Drupal\node\Entity\Node::load($nid);
      $ads[$nid] = $node->title->value;
    }

    $form['ads'] = array(
      '#type' => 'select',
      '#title' => $this->t('Select Ads'),
      '#options' => $ads,
      '#default_value' => $config['custom_ads'],
      '#required' => FALSE,
    );
    return $form;
  }

  public function blockSubmit($form, FormStateInterface $form_state) {
    $nid = $form_state->getValue('ads');
    $node = Node::load($nid);
    $this->setConfigurationValue('custom_ads', ['id' => $nid, 'block' => $this->getPluginId(), 'section' => $node->field_seccion->value, 'space' => $node->field_espacio->value]);
  }

  public function build() {
    $config = $this->getConfiguration();
    $form = $this->formBuilder->getForm(CustomAdsForm::class);
    $form['ad_'+$this->getPluginId()] = [
      '#type' => 'markup',
      '#markup' => '<div id="eplAdDiv'.$config['custom_ads']['space'].'"></div>',
    ];
    $render['block'] = $form;
    $render['block']['#attached']['library'] = ['custom_ads/drupal.custom_ads'];
    $render['block']['#attached']['drupalSettings']['settings']['custom_ads'][$config['custom_ads']['id']] = $config['custom_ads'];
    return $render;
  }

}
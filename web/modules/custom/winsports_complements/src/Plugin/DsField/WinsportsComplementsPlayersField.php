<?php

namespace Drupal\winsports_complements\Plugin\DsField;

use Drupal\Component\Utility\Html;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\ds\Plugin\DsField\DsFieldBase;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;

use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

use Drupal\Core\Session\AccountProxy;
use Drupal\Core\Session\AccountProxyInterface;
/**
 * Plugin that renders the terms inside a chosen taxonomy vocabulary.
 *
 * @DsField(
 *   id = "winsports_complements_players_field",
 *   title = @Translation("Winsports Complements Players Field"),
 *   entity_type = "node",
 *   provider = "node"
 * )
 */
class WinsportsComplementsPlayersField extends DsFieldBase implements ContainerFactoryPluginInterface{


  /**
   * @var $account \Drupal\Core\Session\AccountProxyInterface
   */
  protected $account;


  /**
   * @param \Symfony\Component\DependencyInjection\ContainerInterface $container
   * @param array $configuration
   * @param string $plugin_id
   * @param mixed $plugin_definition
   *
   * @return static
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_user')
    );
  }


  /**
   * @param array $configuration
   * @param string $plugin_id
   * @param mixed $plugin_definition
   * @param \Drupal\Core\Session\AccountProxyInterface $account
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, AccountProxyInterface $account) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->account = $account;
  }
  
  /**
   * {@inheritdoc}
   *  Return theme config for this selection.
   * 
   */
  public function build() {
    $config = $this->getConfiguration();
    if (!isset($config['vocabulary']) || !$config['vocabulary']) {
      return;
    }

    $query = \Drupal::entityQuery('taxonomy_term')
      ->condition('vid', $config['vocabulary']);

    $tids = $query->execute();
    if (!$tids) {
      return;
    }

    $terms = Term::loadMultiple($tids);
    if (!$terms) {
      return;
    }

    return array(
      '#theme' => 'item_list',
      '#items' => $this->buildTermList($terms),
    );
  }

  /**
   * Builds a term list to be used with #theme => 'item_list
   *
   * @param array $terms
   * @return array
   */
  private function buildTermList(array $terms) {
    $config = $this->getConfiguration();
    $formatter = isset($config['field']['formatter']) && $config['field']['formatter'] ? $config['field']['formatter'] : 'unlinked';
    $items = array();
    foreach ($terms as $term) {
      $items[] = $this->buildTermListItem($term, $formatter);
    }

    return $items;
  }

  /**
   * Builds an individual term item for the term item list depending on the formatter.
   *
   * @param \Drupal\taxonomy\Entity\Term $term
   * @return string
   */
  private function buildTermListItem(Term $term, $formatter) {
    if ($formatter === 'linked') {
      $link_url = Url::fromRoute('entity.taxonomy_term.canonical', array('taxonomy_term' => $term->id()));
      return \Drupal::l($term->label(), $link_url);
    }

    return HTML::escape($term->label());
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm($form, FormStateInterface $form_state) {
    $config = $this->getConfiguration();

    $names = taxonomy_vocabulary_get_names();
    $players = [ 'JW Player', 'MediaStream' ]; // Should use dependency injection rather.
    $options = array();
    foreach ($players as $player) {
      $options[$player] = $player;
    }
    $settings['players'] = array(
      '#type' => 'select',
      '#title' => t('Player'),
      '#default_value' => $config['players'],
      '#options' => $options,
    );

    return $settings;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary($settings) {
    
    $config = $this->getConfiguration();
    
    $no_selection = array('No player selected.');

    if (isset($config['players']) && $config['players']) {
      //$vocabulary = Vocabulary::load($config['players']);
      $player = $config['players'];
      return $player ? array('Player: ' . $player) : $no_selection;
    }

    return $no_selection;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    
    $configuration = array(
      'players' => 'JW Player'
    );

    return $configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function formatters() {
    return array('on_demand' => 'On Demand', 'on_load' => 'On Load');
  }

}

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

use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Config\ConfigFactoryInterface;

use Drupal\Core\Entity\EntityManager;
use Drupal\Core\Entity\EntityManagerInterface;



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
   * @var $configManager Drupal\Core\Config\ConfigFactoryInterface.
   *
   * 
   */
  protected $configManager;

      /**
   * @var $configManager Drupal\Core\Config\EntityManagerInterface.
   *
   * 
   */
  protected $entityManager;

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
      $container->get('current_user'),
      $container->get('config.factory'),
      $container->get('entity.manager')

    );
  }


  /**
   * @param array $configuration
   * @param string $plugin_id
   * @param mixed $plugin_definition
   * @param \Drupal\Core\Session\AccountProxyInterface $account
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, AccountProxyInterface $account , ConfigFactoryInterface $configManager, EntityManagerInterface $entityManager ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->account = $account;
    $this->configManager = $configManager;
    $this->entityManager = $entityManager;
    

    
  }
  
  /**
   * {@inheritdoc}
   *  Return theme config for this selection.
   * 
   */
  public function build() {
    $ds_config = $this->getConfiguration();
    $plugin_config = $this->configManager->get('winsports_complements.playersconfig')->get('players_plugins');
    $plugin_config_pos = array_search($ds_config['field']['settings']['players'], array_column($plugin_config, 'id'));
    $plugin_config = $plugin_config[$plugin_config_pos];
    // dump($ds_config);
    // dump($plugin_config);

    $style = $this->entityManager->getStorage('image_style')->load('destacado_a_854_x_480');
    $url =  file_url_transform_relative($style->buildUrl(file_load($ds_config['entity']->field_image[0]->target_id)->getFileUri()));

    $data = [
      'plugin_conf' => $plugin_config,
      'entity'      => (object)[
        'nid' =>  $ds_config['entity']->nid->value,
        'image' =>  (object)[ 
          'uri' =>  file_url_transform_relative($style->buildUrl(file_load($ds_config['entity']->field_image[0]->target_id)->getFileUri())),
          'metadata' => $ds_config['entity']->field_image[0],
        ],
      'formater'    => $ds_config['field']['formatter'] 
      ]
    ];

    return array(
      '#theme' => 'jw_player',
      '#player' => $data,
    );
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm($form, FormStateInterface $form_state) {

    $config = $this->getConfiguration();
    
    $settings['players'] = array(
      '#type' => 'select',
      '#title' => t('Player'),
      '#default_value' => $config['players'],
      '#options' => self::getPlayersConfig('name'),
    );

    return $settings;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary($settings) {
    
    $config = $this->getConfiguration();
    
    $no_selection = array( t('No player selected.') );

    if (isset($config['players']) && $config['players']) {
      $player = $config['players'];
      return $player ? array( t('Player: ') . $player) : $no_selection;
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


  private function getPlayersConfig( $property = null ){
    $config = $this->configManager->get('winsports_complements.playersconfig')->get('players_plugins');
    
    if(!is_null($property))  {
      foreach($config as $key => $value){
        $values[$value['id']] = $value[$property]; 
      }
      return $values;
    }
    return $config;
  
  }
}

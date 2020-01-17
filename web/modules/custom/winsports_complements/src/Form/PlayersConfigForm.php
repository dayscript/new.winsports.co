<?php

namespace Drupal\winsports_complements\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Serializer;
use Drupal\Core\Language\LanguageInterface;

/**
 * Class PlayersConfigForm.
 */
class PlayersConfigForm extends ConfigFormBase {

  /**
   * Drupal\Core\Session\AccountProxyInterface definition.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Drupal\Core\Session\AccountProxyInterface definition.
   *
   * @var \Symfony\Component\Serializer\SerializerInterface
   */
  protected $serializer;


  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    $instance->currentUser = $container->get('current_user');
    return $instance;
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'winsports_complements.playersconfig',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'players_config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('winsports_complements.playersconfig')->get('players_plugins');
    $i = 0;
    $num_fields = $form_state->get('num_fields');
    

    if( count($config) >= 1 && is_null($num_fields)) {
      $num_fields = count($config);
      $form_state->set('num_fields', $num_fields);
    }

    
    $form['description'] = array(
      '#markup' => '<div>'. t('Add the players plugins, this players will showing in the display suite configuration field').'</div>',
    );

    

    $form['#tree'] = TRUE;
    $form['players_plugins'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Players plugins'),
      '#prefix' => '<div id="names-fieldset-wrapper">',
      '#suffix' => '</div>',
    ];
    

    for ($i = 0; $i < $num_fields; $i++) {
      
      $form['players_plugins'][$i] = [
        '#type'=>'fieldset',
        '#title' => t('Player') .' '. $i,
        
      ];

      $form['players_plugins'][$i]['name'] = [
        '#type' => 'textfield',
        '#title' => t('Name'),
        '#description' => t('The unique name of library'),
        '#required'=> TRUE,
        '#default_value' => $config[$i]['name']
        
      ];

      $form['players_plugins'][$i]['type'] = [
        '#type' => 'radios',
        '#title' => t('Injection Type'),
        '#description' => t('How will injection for script'),
        '#options' => array( 0 => 'inline', 1 =>'libraries'),
        '#default_value' => $config[$i]['type'],
        '#required'=> TRUE
      ];
      
      $form['players_plugins'][$i]['library_name'] = [
        '#type' => 'textfield',
        '#title' => t('Library Name'),
        '#description' => t('The name of library, is the folder name in libraries path'),
        '#default_value' => $config[$i]['library_name'],
        '#states' =>[
          'visible' => [
            ':input[name="players_plugins['.$i.'][type]"]' => [ 'value' => 1 ]
          ],
          'required' => [
            ':input[name="players_plugins['.$i.'][type]"]' => [ 'value' => 1 ]
          ]
        ]
      ];
     
      $form['players_plugins'][$i]['inline_script'] = [
        '#type'=>'textfield',
        '#title'=>'Inline Script',
        '#default_value'=>'',
        '#description'=> t('Insert here the URL from where will inject the script'),
        '#default_value' => $config[$i]['inline_script'],

        '#states' =>[
          'visible' => [
            ':input[name="players_plugins['.$i.'][type]"]' => [ 'value' => 0 ]
          ],
          'required' => [
            ':input[name="players_plugins['.$i.'][type]"]' => [ 'value' => 0 ]
          ]
        ],
      ];
    }

    $form['actions'] = [
      '#type' => 'actions',
    ];

    $form['players_plugins']['actions']['add_name'] = [
      '#type' => 'submit',
      '#value' => t('Add one more'),
      '#submit' => array('::addOne'),
      '#ajax' => [
        'callback' => '::addmoreCallback',
        'wrapper' => 'names-fieldset-wrapper',
      ],
    ];

    if ($num_fields > 1) {
      $form['players_plugins']['actions']['remove_name'] = [
        '#type' => 'submit',
        '#value' => t('Remove one'),
        '#submit' => array('::removeCallback'),
        '#ajax' => [
          'callback' => '::addmoreCallback',
          'wrapper' => 'names-fieldset-wrapper',
        ]
      ];
    }
    
    $form_state->setCached(FALSE);

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function addOne(array &$form, FormStateInterface $form_state) {
    $num_fields = $form_state->get('num_fields');
    $add_button = $num_fields + 1;
    $form_state->set('num_fields', $add_button);
    $form_state->setRebuild();
  }

  /**
   * {@inheritdoc}
   */
  public function addmoreCallback(array &$form, FormStateInterface $form_state) {
    $num_fields = $form_state->get('num_fields');
    return $form['players_plugins'];
  }

  /**
   * {@inheritdoc}
   */
  public function removeCallback(array &$form, FormStateInterface $form_state) {
    $num_fields = $form_state->get('num_fields');
    if ($num_fields > 1) {
      $remove_button = $num_fields - 1;
      $form_state->set('num_fields', $remove_button);
    }
   $form_state->setRebuild();
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $plugins = [];
    foreach($form_state->getValue('players_plugins') as $key => $value){
      if(is_numeric($key)){
        $value['id'] = self::getMachineName($value['name']);
        $plugins[] = $value;
      }
    }

    $this->config('winsports_complements.playersconfig')
     ->set('players_plugins', $plugins )
     ->save();
  }


  protected function getMachineName($string) {
    $transliterated = \Drupal::transliteration()->transliterate($string, LanguageInterface::LANGCODE_DEFAULT, '_');
    $transliterated = mb_strtolower($transliterated);
    $transliterated = preg_replace('@[^a-z0-9_.]+@', '_', $transliterated);
   
    return $transliterated;
  }

}

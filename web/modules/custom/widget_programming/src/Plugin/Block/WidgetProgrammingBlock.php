<?php

namespace Drupal\widget_programming\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\widget_programming\WidgetProgrammingManagerInterface;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\widget_programming\Form\WidgetProgrammingForm;

/**
 * Provides a configurable block with Widget Programming Plugin.
 *
 * @Block(
 *  id = "widget_programming_block",
 *  admin_label = @Translation("Widget Programming Block"),
 * )
 */
class WidgetProgrammingBlock extends BlockBase implements ContainerFactoryPluginInterface {

  protected $Programming;

  protected $formBuilder;

  public function __construct(array $configuration, $plugin_id, $plugin_definition, WidgetProgrammingManagerInterface $widget_programming, FormBuilderInterface $form_builder) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->Programming = $widget_programming;
    $this->formBuilder = $form_builder;
  }

  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('widget_programming.manager'),
      $container->get('form_builder')
    );
  }

  public function blockForm($form, FormStateInterface $form_state) {
    $config = $this->getConfiguration();
    return $form;
  }

  public function build() {
    $form = $this->formBuilder->getForm(WidgetProgrammingForm::class);
    $render['block'] = $form;
    $render['block']['#attached']['library'] = ['widget_programming/drupal.widget_programming'];
    return $render;
  }

}

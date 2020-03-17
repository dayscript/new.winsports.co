<?php

/**
 * @file
 * Definition of Drupal\custom_ads\Plugin\views\field\NodeFieldEspacioEplad.
 */

namespace Drupal\custom_ads\Plugin\views\field;

use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\NodeType;
use Drupal\views\Plugin\views\field\FieldPluginBase;
use Drupal\views\ResultRow;

/**
 * Field handler to flag the node type.
 *
 * @ingroup views_field_handlers
 *
 * @ViewsField("node_field_espacio_eplad")
 */
class NodeFieldEspacioEplad extends FieldPluginBase {

  /**
   * @{inheritdoc}
   */
  public function query() {
    // Leave empty to avoid a query on this field.
  }

  /**
   * Define the available options
   * @return array
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    $options['hide_alter_empty'] = ['default' => FALSE];
    return $options;
  }

  /**
   * Provide the options form.
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);
  }

  /**
   * @{inheritdoc}
   */
  public function render(ResultRow $values) {
   return ['#markup' => '<div id="eplAdDiv" data-space="'.$values->_entity->field_espacio->value.'" data-secction="'.$values->_entity->field_seccion->value.'"><!--<script type="text/javascript">eplAD4M("Top_Banner_NEW")</script>--></div>'] ;
  }
}

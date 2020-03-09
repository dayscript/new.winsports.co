<?php

/**
 * @file
 * Definition of Drupal\custom_authors\Plugin\views\filter\ListAuthorsColumns.
 */

namespace Drupal\custom_authors\Plugin\views\filter;

use Drupal\views\Plugin\views\display\DisplayPluginBase;
use Drupal\views\Plugin\views\filter\InOperator;
use Drupal\views\ViewExecutable;

/**
 * Filters by given list of node title options.
 *
 * @ingroup views_filter_handlers
 *
 * @ViewsFilter("custom_authors_list_authors_columns")
 */
class ListAuthorsColumns extends InOperator {

  /**
   * {@inheritdoc}
   */
  public function init(ViewExecutable $view, DisplayPluginBase $display, array &$options = NULL) {
    parent::init($view, $display, $options);
    $this->valueTitle = t('Authors');
    $this->definition['options callback'] = array($this, 'generateOptions');
  }

  /**
   * Override the query so that no filtering takes place if the user doesn't
   * select any options.
   */
  public function query() {
    if (!empty($this->value)) {
      parent::query();
    }
  }

  /**
   * Skip validation if no options have been chosen so we can use it as a
   * non-filter.
   */
  public function validate() {
    if (!empty($this->value)) {
      parent::validate();
    }
  }

  /**
   * Helper function that generates the options.
   * @return array
   */
  public function generateOptions() {
    return array(
      '11769' => 'Campo Elías Terán',
      '6747' => 'César Augusto Londoño',
      '190' => 'Hugo Illera',
      '2443' => 'Óscar Rentería',
      '24432' => 'Sergio Galván Rey',
      '7004' => 'Wbeimar Muñoz'
    );
  }

}

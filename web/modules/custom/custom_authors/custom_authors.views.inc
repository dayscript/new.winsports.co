<?php

/**
 * Implements hook_views_data_alter().
 */
function custom_authors_views_data_alter(array &$data) {
  $data['node_field_data']['lists_authors_columns'] = array(
    'title' => t('List authors columns'),
    'filter' => array(
      'title' => t('List authors columns'),
      'help' => t('Specify a list of authors for columns content.'),
      'field' => 'uid',
      'id' => 'custom_authors_list_authors_columns'
    ),
  );
  $data['node_field_data']['lists_authors_blogs'] = array(
    'title' => t('List authors blogs'),
    'filter' => array(
      'title' => t('List authors blogs'),
      'help' => t('Specify a list of authors for blogs content.'),
      'field' => 'uid',
      'id' => 'custom_authors_list_authors_blogs'
    ),
  );
}
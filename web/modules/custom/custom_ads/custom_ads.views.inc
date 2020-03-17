<?php

/**
 * Implements hook_views_data_alter().
 */
function custom_ads_views_data_alter(array &$data) {
  $data['node']['node_field_espacio_eplad'] = array(
    'title' => t('Eplanning Ad'),
    'field' => array(
      'title' => t('Eplanning Ad'),
      'help' => t('Space Eplanning Ad.'),
      'id' => 'node_field_espacio_eplad',
    ),
  );
}
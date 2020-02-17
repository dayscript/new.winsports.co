<?php
/**
 * @file
 * Contains \Drupal\winsportsmigrate\Controller\MigrateController.
 */

namespace Drupal\winsportsmigrate\Controller;

use Drupal\node\Entity\Node;
use GuzzleHttp\Client;
use http\Exception;

class MigrateController {

  public function slug($title, $separator = '-', $language = 'en') {
    $flip  = $separator === '-' ? '_' : '-';
    $title = preg_replace('![' . preg_quote($flip) . ']+!u', $separator, $title);
    $title = str_replace('@', $separator . 'at' . $separator, $title);
    $title = preg_replace('![^' . preg_quote($separator) . '\pL\pN\s]+!u', '', strtolower($title));
    $title = preg_replace('![' . preg_quote($separator) . '\s]+!u', $separator, $title);

    return trim($title, $separator);
  }

  public function goals() {
    if (isset($_REQUEST['limit'])) {
      $limit = $_REQUEST['limit'];
    }
    else {
      $limit = 10;
    }
    $client  = new Client();
    $url     = 'https://admin.winsports.co/migrate/goals';
    $res     = $client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      foreach ($response['nodes'] as $item) {
        $query = \Drupal::entityQuery('node');
        $query->condition('title', $item['title']);
        $query->condition('type', 'gol_partido');
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $data = file_get_contents($item['field_image']['src']);
          if ($file = file_save_data($data, 'public://images/goles/' . $this->slug($item['title']) . '.jpg', FILE_EXISTS_REPLACE)) {
            $node = Node::create([
              'type'              => 'gol_partido',
              'title'             => $item['title'],
              'field_url'         => $item['url'],
              'field_cimacast'    => $item['cimacast_video_id'],
              'field_mediastream' => $item['mediastream_id'],
              'field_image'       => [
                'target_id' => $file->id(),
                'alt'       => $item['title'],
                'title'     => $item['title'],
              ],
              'uid'               => 1,
              'moderation_state'  => 'published',
            ]);
            $node->save();
            $results['new']++;
            if ($results['new'] >= $limit) {
              break;
            }
          }
        }
        else {
          $results['existing']++;
        }
      }
    }


    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Goles') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

}
<?php
/**
 * @file
 * Contains \Drupal\winsportsmigrate\Controller\MigrateController.
 */

namespace Drupal\winsportsmigrate\Controller;

use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use GuzzleHttp\Client;

class MigrateController {

  public $client;

  public $limit;

  public function __construct() {
    if (isset($_REQUEST['limit'])) {
      $this->limit = $_REQUEST['limit'];
    }
    else {
      $this->limit = 10;
    }
    $this->client = new Client();
  }

  public function slug($title, $separator = '-', $language = 'en') {
    $flip  = $separator === '-' ? '_' : '-';
    $title = preg_replace('![' . preg_quote($flip) . ']+!u', $separator, $title);
    $title = str_replace('@', $separator . 'at' . $separator, $title);
    $title = preg_replace('![^' . preg_quote($separator) . '\pL\pN\s]+!u', '', strtolower($title));
    $title = preg_replace('![' . preg_quote($separator) . '\s]+!u', $separator, $title);

    return trim($title, $separator);
  }

  public function articles() {
    $url     = 'https://admin.winsports.co/migrate/articles/202002';
    $res     = $this->client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      foreach ($response['nodes'] as $item) {
        $query = \Drupal::entityQuery('node');
        $query->condition('title', $item['title']);
        $query->condition('type', 'article');
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $node = Node::create([
            'type'                   => 'article',
            'title'                  => $item['title'],
            'field_pretitle'         => $item['pretitle'],
            'body'                   => [
              'value'  => $item['body'],
              'format' => 'full_html',
            ],
            'field_lead'             => $item['lead'],
            'field_url'              => $item['video'],
            'field_is_video_article' => $item['is_video'],
            'uid'                    => 1,
            'moderation_state'       => 'published',
          ]);
          $node->save();
          $this->attachTags($node, $item['tags']);
          $this->attachCategory($node, $item['category']);
          $this->attachSource($node, $item['fuente']);
          if ($item['field_image']['src']) {
            $image = file_get_contents($item['field_image']['src']);
            if ($file = file_save_data($image, 'public://images/articles/' . $this->slug($item['title']) . '.jpg', FILE_EXISTS_REPLACE)) {
              $node->field_image = [
                'target_id' => $file->id(),
                'alt'       => $item['title'],
                'title'     => $item['title'],
              ];
            }
          }
          if ($item['imagen_h']['src']) {
            $image = file_get_contents($item['imagen_h']['src']);
            if ($file = file_save_data($image, 'public://images/articles/' . $this->slug($item['title']) . '_h.jpg', FILE_EXISTS_REPLACE)) {
              $node->field_image_h = [
                'target_id' => $file->id(),
                'alt'       => $item['title'],
                'title'     => $item['title'],
              ];
            }
          }
          $date = $item['fecha'];
          $node->set('created', $date);
          $node->save();
          $results['new']++;
          if ($results['new'] >= $this->limit) {
            break;
          }
        }
        else {
          $results['existing']++;
        }
      }
    }


    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Articulos') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

  public function teams() {
    $url     = 'https://admin.winsports.co/migrate/teams';
    $res     = $this->client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      foreach ($response['nodes'] as $item) {
        $query = \Drupal::entityQuery('node');
        $query->condition('title', $item['title']);
        $query->condition('type', 'equipo');
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $node = Node::create([
            'type'                   => 'equipo',
            'title'                  => $item['title'],
            'body'                   => [
              'value'  => $item['body'],
              'format' => 'full_html',
            ],
            'field_pretitle'         => $item['website'],
            'field_apodo'            => $item['apodo'],
            'field_ciudad'           => $item['ciudad'],
            'field_director_tecnico' => $item['director'],
            'field_estadio'          => $item['estadio'],
            'field_fundacion'        => $item['fundacion'],
            'field_nombre_comun'     => $item['comun'],
            'field_presidente'     => $item['presidente'],
            'field_mediastream'     => $item['twitter'],
            'uid'                    => 1,
            'moderation_state'       => 'published',
          ]);
          $node->save();
          if ($item['field_image']['src']) {
            $image = file_get_contents($item['field_image']['src']);
            if ($file = file_save_data($image, 'public://images/teams/' . $this->slug($item['title']) . '.png', FILE_EXISTS_REPLACE)) {
              $node->field_image = [
                'target_id' => $file->id(),
                'alt'       => $item['title'],
                'title'     => $item['title'],
              ];
            }
          }
          $date = $item['fecha'];
          $node->set('created', $date);
          $node->save();
          $results['new']++;
          if ($results['new'] >= $this->limit) {
            break;
          }
        }
        else {
          $results['existing']++;
        }
      }
    }


    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Equipos') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

  public function goals() {
    $url     = 'https://admin.winsports.co/migrate/goals';
    $res     = $this->client->get($url);
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
            if ($results['new'] >= $this->limit) {
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

  public function attachTags($node, $tags) {
    foreach (explode(',', $tags) as $tag_text) {
      if (trim($tag_text) == '') {
        continue;
      }
      $query = \Drupal::entityQuery('taxonomy_term');
      $query->condition('name', $tag_text);
      $query->condition('vid', 'tags');
      $entity_ids = $query->execute();
      if (count($entity_ids) == 0) {
        $term = Term::create(['vid' => 'tags']);
        $term->setName($tag_text);
        $term->save();
      }
      else {
        $term = Term::load(array_pop($entity_ids));
      }
      $node->field_tags[] = $term;
      $node->save();
    }
  }

  public function attachCategory($node, $cat) {
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('name', $cat);
    $query->condition('vid', 'categoria');
    $entity_ids = $query->execute();
    if (count($entity_ids) == 0) {
      $term = Term::create(['vid' => 'categoria']);
      $term->setName($cat);
      $term->save();
    }
    else {
      $term = Term::load(array_pop($entity_ids));
    }
    $node->field_category = $term;
    $node->save();
  }

  public function attachSource($node, $cat) {
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('name', $cat);
    $query->condition('vid', 'fuentes');
    $entity_ids = $query->execute();
    if (count($entity_ids) == 0) {
      $term = Term::create(['vid' => 'fuentes']);
      $term->setName($cat);
      $term->save();
    }
    else {
      $term = Term::load(array_pop($entity_ids));
    }
    $node->field_source = $term;
    $node->save();
  }

}
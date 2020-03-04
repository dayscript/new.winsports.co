<?php
/**
 * @file
 * Contains \Drupal\winsportsmigrate\Controller\MigrateController.
 */

namespace Drupal\winsportsmigrate\Controller;

use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Datetime\Element\Datetime;
use Drupal\node\Entity\Node;
use Drupal\redirect\Entity\Redirect;
use Drupal\taxonomy\Entity\Term;
use Drupal\user\Entity\User;
use GuzzleHttp\Client;

class MigrateController {

  public $client;

  public $limit;

  public $offset;

  public $period;

  public function __construct() {
    if (isset($_REQUEST['limit'])) {
      $this->limit = $_REQUEST['limit'];
    }
    else {
      $this->limit = 10;
    }
    if (isset($_REQUEST['offset'])) {
      $this->offset = $_REQUEST['offset'];
    }
    else {
      $this->offset = 0;
    }
    if (isset($_REQUEST['period'])) {
      $this->period = $_REQUEST['period'];
    }
    else {
      $this->period = '202002';
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
    $url     = 'https://admin.winsports.co/migrate/articles/' . $this->period;
    $res     = $this->client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      $count    = 0;
      foreach ($response['nodes'] as $item) {
        $count++;
        if ($this->offset > 0 && $count <= $this->offset) {
          continue;
        }
        $date  = $item['created'];
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
            'created'                => $date,
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
          $node->save();
          $results['new']++;
        }
        else {
          $node = Node::load(array_pop($entity_ids));
          $node->set('uid', $item['uid']);
          $node->set('created', $date);
          $node->save();
          $results['existing']++;
        }
        $this->attachTeams($node, $item['equipos']);
        if ($results['new'] + $results['existing'] >= $this->limit) {
          break;
        }
      }
    }
    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Articulos') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'] . '<br>Total: ' . $count,
    ];
  }

  public function opinion() {
    $url     = 'https://admin.winsports.co/migrate/opinion/' . $this->period;
    $res     = $this->client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      $count    = 0;
      foreach ($response['nodes'] as $item) {
        $count++;
        if ($this->offset > 0 && $count <= $this->offset) {
          continue;
        }
        $date  = $item['fecha'];
        $query = \Drupal::entityQuery('node');
        $query->condition('title', $item['title']);
        $query->condition('type', 'columna_blog');
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $node = Node::create([
            'type'                  => 'columna_blog',
            'title'                 => $item['title'],
            'field_pretitle'        => $item['pretitle'],
            'field_tipo_de_opinion' => $item['tipo'],
            'field_mediastream'     => $item['mediastream'],
            'body'                  => [
              'value'  => $item['body'],
              'format' => 'full_html',
            ],
            'field_url'             => $item['video'],
            'uid'                   => $item['autor_uid'],
            'moderation_state'      => 'published',
            'created'               => $date,
          ]);
          $node->save();
          $this->attachTags($node, $item['tags']);
          if ($item['field_image']['src']) {
            $image = file_get_contents($item['field_image']['src']);
            if ($file = file_save_data($image, 'public://images/columna_blog/' . $this->slug($item['title']) . '.jpg', FILE_EXISTS_REPLACE)) {
              $node->field_image = [
                'target_id' => $file->id(),
                'alt'       => $item['title'],
                'title'     => $item['title'],
              ];
            }
          }
          $node->save();
          $results['new']++;
          if ($results['new'] >= $this->limit) {
            break;
          }
        }
        else {
          $node = Node::load(array_pop($entity_ids));
          $node->set('uid', $item['autor_uid']);
          $node->set('created', $date);
          $node->save();
          $results['existing']++;
        }
        if ($results['new'] + $results['existing'] >= $this->limit) {
          break;
        }
      }
    }


    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de columnas / blog') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'] . '<br>Total: ' . $count,
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
              'value'  => $item['resena'],
              'format' => 'full_html',
            ],
            'field_pretitle'         => $item['website'],
            'field_apodo'            => $item['apodo'],
            'field_ciudad'           => $item['ciudad'],
            'field_director_tecnico' => $item['director'],
            'field_estadio'          => $item['estadio'],
            'field_fundacion'        => $item['fundacion'],
            'field_nombre_comun'     => $item['comun'],
            'field_presidente'       => $item['presidente'],
            'field_mediastream'      => $item['twitter'],
            'uid'                    => 1,
            'moderation_state'       => 'published',
          ]);
          $node->save();
          $this->attachPlayers($node, $item['players']);
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
          $node->save();
          $results['new']++;
          if ($results['new'] >= $this->limit) {
            break;
          }
        }
        else {
          $node = Node::load(array_pop($entity_ids));
          $results['existing']++;
        }
      }
    }


    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Equipos') . '<br>' . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

  public function tournaments() {
    $url     = 'https://admin.winsports.co/migrate/tournaments';
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
        $query->condition('type', 'torneo');
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $node = Node::create([
            'type'              => 'torneo',
            'title'             => $item['title'],
            'field_opta_id'     => $item['opta_id'],
            'field_opta_season' => $item['opta_season'],
            'uid'               => 1,
            'moderation_state'  => 'published',
          ]);
          $node->save();
          if ($item['imagen']['src']) {
            $image = file_get_contents($item['imagen']['src']);
            if ($file = file_save_data($image, 'public://images/tournaments/' . $this->slug($item['title']) . '.png', FILE_EXISTS_REPLACE)) {
              $node->field_image = [
                'target_id' => $file->id(),
                'alt'       => $item['title'],
                'title'     => $item['title'],
              ];
            }
          }
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
      '#markup' => t('Migracion de Torneos') . '<br>' . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

  public function galeries() {
    $url     = 'https://admin.winsports.co/migrate/galeries';
    $res     = $this->client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      foreach ($response['nodes'] as $item) {
        $date  = $item['fecha'];
        $query = \Drupal::entityQuery('node');
        $query->condition('title', $item['title']);
        $query->condition('type', 'galeria');
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $node = Node::create([
            'type'             => 'galeria',
            'title'            => $item['title'],
            'field_pretitle'   => $item['pretitle'],
            'field_lead'       => $item['lead'],
            'uid'              => 1,
            'moderation_state' => 'published',
            'created'          => $date,
          ]);
          $node->save();
          $node->field_image = [];
          foreach ($item['field_image'] as $key => $img) {
            $image = file_get_contents($img['src']);
            if ($file = file_save_data($image, 'public://images/galeries/' . $this->slug($item['title']) . '-' . $key . '.png', FILE_EXISTS_REPLACE)) {
              $node->field_image[] = [
                'target_id' => $file->id(),
                'alt'       => $item['title'],
                'title'     => $item['title'],
              ];
            }
          }
          $node->save();
          $this->attachTags($node, $item['tags']);
          $this->attachCategory($node, $item['category']);
          $this->attachSource($node, $item['fuente']);

          $results['new']++;
          if ($results['new'] >= $this->limit) {
            break;
          }
        }
        else {
          //          $node = Node::load(array_pop($entity_ids));
          //          $node->set('created', $date);
          //          $node->save();
          $results['existing']++;
        }
      }
    }
    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Galerias') . '<br>' . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

  public function users() {
    $url     = 'https://admin.winsports.co/migrate/users';
    $res     = $this->client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      foreach ($response['nodes'] as $item) {
        $query = \Drupal::entityQuery('user');
        $query->condition('uid', $item['uid']);
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $date = strtotime($item['fecha']);
          $user = User::create([
            'uid'           => $item['uid'],
            'name'          => $item['name'],
            'field_nombres' => $item['nombre_completo'],
            'status'        => $item['activo'],
            'mail'          => $item['mail'],
            'field_twitter' => $item['twitter'],
            'field_perfil‎' => $item['perfil'],
            'created'       => $date,
          ]);
          $user->save();
          if ($item['field_image']['src']) {
            $image = file_get_contents($item['field_image']['src']);
            if ($file = file_save_data($image, 'public://images/users/' . $this->slug($item['name']) . '.png', FILE_EXISTS_REPLACE)) {
              $user->field_image = [
                'target_id' => $file->id(),
                'alt'       => $item['name'],
                'title'     => $item['name'],
              ];
            }
          }
          $user->save();
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
      '#markup' => t('Migracion de Equipos') . '<br>' . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

  public function schedule() {
    $url     = 'https://admin.winsports.co/migrate/schedule/' . $this->period;
    $res     = $this->client->get($url);
    $results = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      $count    = 0;
      foreach ($response['nodes'] as $item) {
        $count++;
        if ($this->offset > 0 && $count <= $this->offset) {
          continue;
        }
        $date  = $item['created'];
        $date1 = DrupalDateTime::createFromTimestamp(strtotime($item['fecha']))
                               ->format(DATETIME_DATETIME_STORAGE_FORMAT);
        $date2 = DrupalDateTime::createFromTimestamp(strtotime($item['end_date']))
                               ->format(DATETIME_DATETIME_STORAGE_FORMAT);
        $query = \Drupal::entityQuery('node');
        $query->condition('title', $item['title']);
        $query->condition('field_date', $date1);
        $query->condition('type', 'programacion');
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $node = Node::create([
            'type'             => 'programacion',
            'title'            => $item['title'],
            'field_date'       => $date1,
            'field_end_date'   => $date2,
            'uid'              => 1,
            'moderation_state' => 'published',
            'created'          => $date,
          ]);
          $node->save();
          $this->attachCanales($node, $item['canales']);
          $node->save();
          $results['new']++;
          if ($results['new'] >= $this->limit) {
            break;
          }
        }
        else {
          $node = Node::load(array_pop($entity_ids));
          $node->set('created', $date);
          $node->set('field_date', $date1);
          $node->set('field_end_date', $date2);
          $node->save();
          $results['existing']++;
        }
        $this->attachTorneo($node, $item['torneo']);
        $node->save();
        if ($results['new'] + $results['existing'] >= $this->limit) {
          break;
        }
      }
    }


    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Programacion') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'] . '<br>Total: ' . $count,
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
      $count    = 0;
      $response = json_decode($res->getBody(), TRUE);
      foreach ($response['nodes'] as $item) {
        $count++;
        if ($this->offset > 0 && $count <= $this->offset) {
          continue;
        }
        $date  = $item['fecha'];
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
              'created'           => $date,
            ]);
            $node->save();
            $results['new']++;
            if ($results['new'] >= $this->limit) {
              break;
            }
          }
        }
        else {
          $node = Node::load(array_pop($entity_ids));
          $node->set('created', $date);
          $node->save();
          $results['existing']++;
        }
        if ($item['tipo']) {
          $this->attachTipoDeGol($node, $item['tipo']);
        }
        if ($item['torneo']) {
          $this->attachTorneo($node, $item['torneo']);
        }
        $this->attachTags($node, $item['tags']);
        $node->save();
        if ($results['new'] + $results['existing'] >= $this->limit) {
          break;
        }
      }
    }

    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Goles') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'] . '<br>Total: ' . $count,
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

  public function attachPlayers($node, $players) {
    foreach (explode(',', $players) as $player_name) {
      if (trim($player_name) == '') {
        continue;
      }
      $query = \Drupal::entityQuery('node');
      $query->condition('title', $player_name);
      $query->condition('type', 'jugador');
      $entity_ids = $query->execute();
      if (count($entity_ids) == 0) {
        $player = Node::create([
          'type'             => 'jugador',
          'title'            => $player_name,
          'uid'              => 1,
          'moderation_state' => 'published',
        ]);
        $player->save();
      }
      else {
        $player = Node::load(array_pop($entity_ids));
      }
      $node->field_jugador[] = $player;
      $node->save();
    }
  }

  public function attachTeams($node, $teams) {
    $node->field_equipos = [];
    foreach (explode(',', $teams) as $team_name) {
      if (trim($team_name) == '') {
        continue;
      }
      $query = \Drupal::entityQuery('node');
      $query->condition('title', $team_name);
      $query->condition('type', 'equipo');
      $entity_ids = $query->execute();
      if (count($entity_ids) == 0) {
        $equipo = Node::create([
          'type'             => 'equipo',
          'title'            => $team_name,
          'uid'              => 1,
          'moderation_state' => 'published',
        ]);
        $equipo->save();
      }
      else {
        $equipo = Node::load(array_pop($entity_ids));
      }
      $node->field_equipos[] = $equipo;
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

  public function attachTipoDeGol($node, $gol) {
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('name', $gol);
    $query->condition('vid', 'tipo_de_gol');
    $entity_ids = $query->execute();
    if (count($entity_ids) == 0) {
      $term = Term::create(['vid' => 'tipo_de_gol']);
      $term->setName($gol);
      $term->save();
    }
    else {
      $term = Term::load(array_pop($entity_ids));
    }
    $node->field_tipo_de_gol = $term;
    $node->save();
  }

  public function attachCanales($node, $channels) {
    foreach (explode(',', $channels) as $ch_text) {
      if (trim($ch_text) == '') {
        continue;
      }
      $query = \Drupal::entityQuery('taxonomy_term');
      $query->condition('name', $ch_text);
      $query->condition('vid', 'canales');
      $entity_ids = $query->execute();
      if (count($entity_ids) == 0) {
        $term = Term::create(['vid' => 'canales']);
        $term->setName($ch_text);
        $term->save();
      }
      else {
        $term = Term::load(array_pop($entity_ids));
      }
      $node->field_canal[] = $term;
      $node->save();
    }
  }

  public function attachTorneo($node, $tr) {
    if (trim($tr) == '') {
      return FALSE;
    }
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('name', $tr);
    $query->condition('vid', 'torneos');
    $entity_ids = $query->execute();
    if (count($entity_ids) == 0) {
      $term = Term::create(['vid' => 'torneos']);
      $term->setName($tr);
      $term->save();
    }
    else {
      $term = Term::load(array_pop($entity_ids));
    }
    $node->field_torneo = $term;
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

  public function matches() {
    $opta_id     = 371;
    $opta_season = 2020;
    $url         = 'https://winsports.dayscript.com/competitions/' . $opta_id . '/' . $opta_season . '/generate-winsports';
    $res         = $this->client->get($url);
    $results     = [
      'new'      => 0,
      'existing' => 0,
    ];
    if ($res->getStatusCode() == 200) {
      $response = json_decode($res->getBody(), TRUE);
      $count    = 0;
      foreach ($response['matches'] as $item) {
        $count++;
        if ($this->offset > 0 && $count <= $this->offset) {
          continue;
        }
        $date = DrupalDateTime::createFromTimestamp(strtotime($item['date']))
                              ->format(DATETIME_DATETIME_STORAGE_FORMAT);

        $query = \Drupal::entityQuery('node');
        $query->condition('title', $item['title']);
        $query->condition('type', 'partido');
        $query->condition('field_opta_match_id', $item['match_id']);
        $entity_ids = $query->execute();
        if (count($entity_ids) == 0) {
          $node = Node::create([
            'type'             => 'partido',
            'title'            => $item['title'],
            'body'             => [
              'value'  => $item['description'],
              'format' => 'full_html',
            ],
            'uid'              => 1,
            'moderation_state' => 'published',
          ]);
          $node->save();
          $results['new']++;
        }
        else {
          $node = Node::load(array_pop($entity_ids));
          $results['existing']++;
        }
        $node->set('field_opta_match_id', $item['match_id']);
        $node->set('field_opta_id', $item['competition_id']);
        $node->set('field_opta_season', $item['season_id']);
        $node->set('field_round', $item['round']);
        $node->set('field_phase', $item['phase']);
        $node->set('field_home', $item['home']);
        $node->set('field_away', $item['away']);
        $node->set('field_date', $date);
        $node->save();
        $query = \Drupal::entityQuery('node');
        $query->condition('field_opta_id', $item['competition_id']);
        $query->condition('field_opta_season', $item['season_id']);
        $query->condition('type', 'torneo');
        $torneo_ids = $query->execute();
        if (count($torneo_ids) == 0) {
          $node_torneo = Node::create([
            'type'              => 'torneo',
            'title'             => 'Torneo ' . $item['competition_id'] . ' Season ' . $item['season_id'],
            'field_opta_id'     => $item['opta_id'],
            'field_opta_season' => $item['opta_season'],
            'uid'               => 1,
            'moderation_state'  => 'published',
          ]);
          $node_torneo->save();
        }
        else {
          $node_torneo = Node::load(array_pop($torneo_ids));
        }
        $node->field_torneo_node = $node_torneo;
        $node->save();

        $redirects = \Drupal::service('redirect.repository')->findBySourcePath('matches/' . $item['match_id']);
        if(count($redirects) == 0){
          Redirect::create([
            'redirect_source'   => 'matches/' . $item['match_id'],
            'redirect_redirect' => 'internal:/node/' . $node->id(),
            'status_code'       => 301,
          ])->save();  
        }
        if ($results['new'] + $results['existing'] >= $this->limit) {
          break;
        }
      }
    }
    return [
      '#type'   => 'markup',
      '#markup' => t('Migracion de Partidos') . '<br>'
                   . 'Nuevos: ' . $results['new'] . '<br>Existentes: ' . $results['existing'],
    ];
  }

}
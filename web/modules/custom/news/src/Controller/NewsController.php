<?php

namespace Drupal\news\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
//use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
* Clase controlador para módulo de publicaciones
*
* A través de varios tipos de contenido genera un servicio json con los datos necesarios
* para que la aplicación móvil de inciradio funcione correctamente.
*
* @return object     Respuesta en json con datos de publicaciones
* 
* PHP version 7.2
*
* @category         Controlador
* @package         controllers
* @author            Pablo Villate <pablo.villate1@gmail.com>
* @copyright        2019 Instituto Nacional Para Ciegos
* @link                  http://inci.gov.co
* @since               Archivo disponible desde la version 1.0.0
**/
class NewsController extends ControllerBase {
  
  protected $api_key = '8mKaTrQe6WsHWBz';

  public function news() {
    $key = \Drupal::request()->query->get('key');
    $limit = \Drupal::request()->query->get('limit');
    $offset = \Drupal::request()->query->get('offset');
    $range_offset = 0;
    $range_limit = 100;

    if (!empty($limit)) {
      $range_limit = $limit;
    }

    if (!empty($offset)) {
      $range_offset = $offset;
    }
    if($key === $this->api_key) {
        $news = array();
        $query = \Drupal::entityQuery('node')
            ->condition('status', 1)
            ->condition('type', 'article', '=');
        $query->range($range_offset, $range_limit);
        $query->sort('created' , 'DESC');
        $nids = $query->execute();

        foreach ($nids as $nid) {
            $node = Node::load($nid);
            $nodes['titulo'] = $node->title->value;
            $nodes['resumen'] = $node->body->summary; 
            $nodes['body'] = $node->body->value;
            $nodes['fecha_creado'] = date('Y-m-d H:i:s', $node->created->value);
            //\Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$nid);
            $nodes['web_url'] = $node->toUrl()->toString();
            
            if(!empty($node->field_image->entity)) {
                $image = $node->field_image;
                $nodes['image'] = file_create_url($image->entity->uri->value);
                $nodes['image_alt'] = $image->alt;
            }

            array_push($news, $nodes);
        }
    } else {
      return new JsonResponse(['message' => 'El key no coincide']);   
    }

    if (!empty($news)) {
      return new JsonResponse($news);
    }
  }
}
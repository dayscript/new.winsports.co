<?php

namespace Drupal\youtube_formatter\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'youtube_formatter' formatter.
 *
 * @FieldFormatter(
 *   id = "youtube_formatter",
 *   label = @Translation("Youtube player formatter"),
 *   field_types = {
 *     "link"
 *   }
 * )
 */
class YouTubeFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $view_mode = $this->getSetting('view_mode');
    $view_mode = $view_mode == 'home' ? 'video_player' : 'default';
    $image     = $items->getParent()->getValue()->field_image->view($view_mode);
    $nodeid    = $items->getParent()->getValue()->id();
    $elements  = [];
    foreach ($items as $delta => $item) {
      $url              = $item->uri;
//      dd($item);
      $url              = str_replace('https://youtu.be/', 'https://www.youtube.com/embed/', $url);
      $elements[$delta] = [
        '#theme'     => 'youtube_player',
        '#item'      => $item,
        '#image'     => $image,
        '#url'       => $url,
        '#view_mode' => $view_mode,
      ];
      if (!empty($item->_attributes)) {
        $elements[$delta]['#attributes'] += $item->_attributes;
        unset($item->_attributes);
      }
      $elements[$delta]['#attached']['drupalSettings']['view_mode'] = $view_mode;
      $elements[$delta]['#attached']['drupalSettings']['url']       = $url;
      $elements[$delta]['#attached']['drupalSettings']['node_id']   = $nodeid;
    }

    return $elements;
  }

}
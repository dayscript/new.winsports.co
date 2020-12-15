<?php

namespace Drupal\mediastream_formatter\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldItemListInterface;

/**
 * Plugin implementation of the 'mediastream_formatter' formatter.
 *
 * @FieldFormatter(
 *   id = "mediastream_formatter",
 *   label = @Translation("Mediastream player formatter"),
 *   field_types = {
 *     "text",
 *     "string"
 *   }
 * )
 */
class MediastreamFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
             'autoplay' => FALSE,
             'view_mode' => 'default',
           ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary  = [];
    $autoplay = $this->getSetting('autoplay');
    $view_mode = $this->getSetting('view_mode');
    $summary[] = $this->t('Autoplay:' . ($autoplay ? 'Yes' : 'No') . ' View:' . $view_mode);

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $view_mode = $this->getSetting('view_mode');
    $view_mode = $view_mode == 'home' ? 'video_player' : 'default';
    $autoplay = $this->getSetting('autoplay');
    $image = $items->getParent()->getValue()->field_image->view($view_mode);
    $nodeid = $items->getParent()->getValue()->id();
    $elements = [];
    foreach ($items as $delta => $item) {
      $mediastream_id = $item->value;
      $elements[$delta] = [
        '#theme' => 'mediastream_player',
        '#item' => $item,
        '#image' => $image,
        '#autoplay' => $autoplay,
        '#view_mode' => $view_mode,
        '#mediastream_id' => $mediastream_id,
        '#attached' => ['library' => ['mediastream_formatter/msplayer']],
      ];
      if (!empty($item->_attributes)) {
        $elements[$delta]['#attributes'] += $item->_attributes;
        unset($item->_attributes);
      }
      $elements[$delta]['#attached']['drupalSettings']['autoplay'] = $autoplay;
      $elements[$delta]['#attached']['drupalSettings']['view_mode'] = $view_mode;
      $elements[$delta]['#attached']['drupalSettings']['mediastream_id'] = $mediastream_id;
      $elements[$delta]['#attached']['drupalSettings']['node_id'] = $nodeid;
    }

    return $elements;
  }
  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $form['autoplay'] = [
      '#title'         => $this->t('Autoplay'),
      '#type'          => 'checkbox',
      '#description'   => $this->t('Check to start playing video automatically'),
      '#default_value' => $this->getSetting('autoplay'),
    ];
    $form['view_mode'] = [
      '#title'         => $this->t('View'),
      '#type' => 'select',
      '#options' => [
        'default' => $this->t('Details Page'),
        'home' => $this->t('Home Page'),
      ],
      '#default_value' => $this->getSetting('view_mode'),
      '#description'   => $this->t('Select where is this going to be displayed'),
    ];

    return $form;
  }
}
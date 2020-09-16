<?php

namespace Drupal\schedule_menu_link\Plugin\Menu;

use Drupal\Core\Menu\MenuLinkDefault;
use Drupal\Core\Url;

class ScheduleMenuLink extends MenuLinkDefault {

  public function getTitle() {
    return $this->t('Programación');
  }

  public function getUrlObject($title_attribute = TRUE) {
    return Url::fromUri('internal:/programacion?date=' . format_date(time(), 'custom', "Y-m-d"));
  }
}
<?php

namespace Drupal\custom_system_actions\Plugin\Action;

use Drupal\Core\Action\ActionBase;
use Drupal\Core\Session\AccountInterface;

/**
 * create custom action
 *
 * @Action(
 *   id = "node_google_index_action",
 *   label = @Translation("Google Index Content"),
 *   type = "node"
 * )
 */
class GoogleIndexAction extends ActionBase {

    /**
     * {@inheritdoc}
     */
    public function execute($node = NULL) {
        if ($node) {
            // TODO: export your node here
            try {
                \Drupal::service('google_index_api.client')->updateUrl($node->toUrl()->toString());
                \Drupal::messenger()->addStatus('Node has been sent for indexing.');
            } catch (Exception $e) {
                \Drupal::messenger()->addStatus('The node could not be sent for indexing.');
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function access($object, AccountInterface $account = NULL, $return_as_object = FALSE) {
        /** @var \Drupal\node\NodeInterface $object */
        // TODO: write here your permissions
        $result = $object->access('create', $account, TRUE);
        return $return_as_object ? $result : $result->isAllowed();
    }

}
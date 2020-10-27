<?php
/**
 * @file
 * Contains \Drupal\services_amazon_s3\Controller\ServicesAmazonS3.
 */

namespace Drupal\services_amazon_s3\Controller;

use Aws\S3\S3Client;
use Aws\Exception\AwsException;
use Drupal\Core\Site\Settings;

class ServicesAmazonS3 {

  public function __construct() {}

  public function dimayor() {

  	$contents = file_get_contents('https://www.winsports.co/api/partidos-torneo/json?torneo=3');

	$client = new S3Client([
	    'region' => 'us-west-2',
	    'version' => '2006-03-01',
	    'credentials' => [
	        'key' => Settings::get('amazons3.key'),
	        'secret' => Settings::get('amazons3.secret')
	    ],
	]);

	$client->putObject([
	    'Bucket' => 'news-winsports',
	    'Key' => 'dimayor.json',
	    'Body' => $contents
	]);

    return [
      '#type'   => 'markup',
      '#markup' => t('Logos actualizados para Dimayor'),
    ];
  }

  public function futbolred() {

  	$contents = file_get_contents('https://winsports.co/api/futbol-red/json');

	$client = new S3Client([
	    'region' => 'us-west-2',
	    'version' => '2006-03-01',
	    'credentials' => [
	        'key' => Settings::get('amazons3.key'),
	        'secret' => Settings::get('amazons3.secret')
	    ],
	]);

	$client->putObject([
	    'Bucket' => 'news-winsports',
	    'Key' => 'futbolred.json',
	    'Body' => $contents
	]);

    return [
      '#type'   => 'markup',
      '#markup' => t('Widget actualizado para Futbolred'),
    ];
  }

  public function winsportsOnline() {

  	$contents = file_get_contents('https://winsports.co/api/futbol-red/json');

	$client = new S3Client([
	    'region' => 'us-west-2',
	    'version' => '2006-03-01',
	    'credentials' => [
	        'key' => Settings::get('amazons3.key'),
	        'secret' => Settings::get('amazons3.secret')
	    ],
	]);

	$client->putObject([
	    'Bucket' => 'news-winsports',
	    'Key' => 'winsportsOnline.json',
	    'Body' => $contents
	]);

    return [
      '#type'   => 'markup',
      '#markup' => t('Widget actualizado para Winsports online'),
    ];
  }
}
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
  	$domain = 'https://www.winsports.co/';
  	$tournaments = [
  		'371-2021' => '/api/partidos-torneo/json?torneo=21866',
  		'625-2021' => '/api/partidos-torneo/json?torneo=21731',
  		'664-2020' => '/api/partidos-torneo/json?torneo=3527',
  		'847-2020' => '/api/partidos-torneo/json?torneo=14842',
  	];

  	$client = new S3Client([
  	    'region' => 'us-west-2',
  	    'version' => '2006-03-01',
  	    'credentials' => [
  	        'key' => Settings::get('amazons3.key'),
  	        'secret' => Settings::get('amazons3.secret')
  	    ],
  	]);

  	foreach ($tournaments as $key => $url) {
  		$contents = file_get_contents($domain . $url);
  		$client->putObject([
  		    'Bucket' => 'news-winsports',
  		    'Key' => $key.'.json',
  		    'Body' => $contents
  		]);
  	}

    return [
      '#type'   => 'markup',
      '#markup' => t('Logos actualizados'),
    ];
  }

  public function futbolred() {
  	$contents = file_get_contents('https://www.winsports.co/api/widget-ms/json');

  	$client = new S3Client([
  	    'region' => 'us-west-2',
  	    'version' => '2006-03-01',
  	    'credentials' => [
  	        'key' => Settings::get('amazons3.key'),
  	        'secret' => Settings::get('amazons3.secret')
  	    ],
  	]);

  	$client->putObject([
  	    'Bucket' => 'widget-futbolred',
  	    'Key' => 'videos.json',
  	    'Body' => $contents
  	]);

    return [
      '#type'   => 'markup',
      '#markup' => t('Widget actualizado.'),
    ];
  }

  public function winsportsOnline() {

  	$domain = 'https://www.winsports.co/';
  	$teams = [
  		'2605' => '/api/noticias-winsports-online/json?team=2605',
  		'2670' => '/api/noticias-winsports-online/json?team=2670',
  		'2869' => '/api/noticias-winsports-online/json?team=2869',
  		'3067' => '/api/noticias-winsports-online/json?team=3067',
  		'2672' => '/api/noticias-winsports-online/json?team=2672',
  		'3123' => '/api/noticias-winsports-online/json?team=3123',
  		'2837' => '/api/noticias-winsports-online/json?team=2837',
  		'5147' => '/api/noticias-winsports-online/json?team=5147',
  		'2992' => '/api/noticias-winsports-online/json?team=2992',
  		'2727' => '/api/noticias-winsports-online/json?team=2727',
  		'2944' => '/api/noticias-winsports-online/json?team=2944',
  		'2781' => '/api/noticias-winsports-online/json?team=2781',
  		'2699' => '/api/noticias-winsports-online/json?team=2699',
  		'3033' => '/api/noticias-winsports-online/json?team=3033',
  		'3094' => '/api/noticias-winsports-online/json?team=3094',
  		'2858' => '/api/noticias-winsports-online/json?team=2858',
  		'5177' => '/api/noticias-winsports-online/json?team=5177',
  		'2923' => '/api/noticias-winsports-online/json?team=2923',
  		'3002' => '/api/noticias-winsports-online/json?team=3002',
  		'2573' => '/api/noticias-winsports-online/json?team=2573',
  		'2640' => '/api/noticias-winsports-online/json?team=2640',
  		'1784' => '/api/noticias-winsports-online/json?team=1784',
  		'5178' => '/api/noticias-winsports-online/json?team=5178',
  	];

  	$client = new S3Client([
  	    'region' => 'us-west-2',
  	    'version' => '2006-03-01',
  	    'credentials' => [
  	        'key' => Settings::get('amazons3.key'),
  	        'secret' => Settings::get('amazons3.secret')
  	    ],
  	]);

  	foreach ($teams as $key => $url) {
  		$contents = file_get_contents($domain . $url);
  		$client->putObject([
  		    'Bucket' => 'news-winsports',
  		    'Key' => $key.'.json',
  		    'Body' => $contents
  		]);
  	}

    return [
      '#type'   => 'markup',
      '#markup' => t('Widget actualizado.'),
    ];
  }

  public function widgetWinsportsNews() {
    $contents = file_get_contents('https://www.winsports.co/api/widget-winsports-news/json');

    $client = new S3Client([
        'region' => 'us-east-1',
        'version' => '2006-03-01',
        'credentials' => [
            'key' => Settings::get('amazons3.key'),
            'secret' => Settings::get('amazons3.secret')
        ],
    ]);

    $client->putObject([
        'Bucket' => 'widget-winsports-news',
        'Key' => 'news.json',
        'Body' => $contents
    ]);

    return [
      '#type'   => 'markup',
      '#markup' => t('Widget actualizado.'),
    ];
  }
}
<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");
require_once iUI::ACCESS_FILE;

$bodyPath = "apps/safety-rep-history";
$title = "Safety Rep History";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, true, 5);
$ui->version = "2019-01-10";
$ui->bodyClassName = 'container-fluid';
$ui->AddCSS("public/styles.css");
$ui->addManifest('public/js/manifest.json');
/**
 * Changelog:
 * 2019-01-10
 *      New page to load existing mailed report by selecting a rep.
 *
 *
 */


$ui->Send();

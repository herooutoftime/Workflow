<?php
/**
 * templateVars transport file for Workflow extra
 *
 * Copyright 2013 by Andreas Bilz Andreas Bilz <andreas@subsolutions.at>
 * Created on 10-23-2013
 *
 * @package workflow
 * @subpackage build
 */

if (! function_exists('stripPhpTags')) {
    function stripPhpTags($filename) {
        $o = file_get_contents($filename);
        $o = str_replace('<' . '?' . 'php', '', $o);
        $o = str_replace('?>', '', $o);
        $o = trim($o);
        return $o;
    }
}
/* @var $modx modX */
/* @var $sources array */
/* @var xPDOObject[] $templateVars */


$templateVars = array();

$templateVars[1] = $modx->newObject('modTemplateVar');
$templateVars[1]->fromArray(array (
  'id' => 1,
  'property_preprocess' => false,
  'type' => 'listbox',
  'name' => 'wfStatus',
  'caption' => 'Workflow Status',
  'description' => 'Current status of the resource in Workflow',
  'elements' => 'Neu==new||Wartet auf Veröffentlichung==awaiting||Abgewiesen==rejected||In Überarbeitung==progress||Öffentlich==public||Löschung beantragt==deleted',
  'rank' => 0,
  'display' => 'default',
  'default_text' => '',
  'properties' => 
  array (
  ),
  'input_properties' => 
  array (
    'allowBlank' => 'true',
    'listWidth' => '',
    'title' => '',
    'typeAhead' => 'false',
    'typeAheadDelay' => '250',
    'forceSelection' => 'false',
    'listEmptyText' => '',
  ),
  'output_properties' => 
  array (
  ),
), '', true, true);
$templateVars[2] = $modx->newObject('modTemplateVar');
$templateVars[2]->fromArray(array (
  'id' => 2,
  'property_preprocess' => false,
  'type' => 'text',
  'name' => 'wfAuthor',
  'caption' => 'Workflow Author',
  'description' => 'Current author for this resource',
  'elements' => '',
  'rank' => 0,
  'display' => 'default',
  'default_text' => '',
  'properties' => 
  array (
  ),
  'input_properties' => 
  array (
  ),
  'output_properties' => 
  array (
  ),
), '', true, true);
return $templateVars;

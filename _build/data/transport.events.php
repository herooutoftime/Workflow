<?php
/**
 * events transport file for Workflow extra
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
/* @var xPDOObject[] $events */


$events = array();

$events[1] = $modx->newObject('modEvent');
$events[1]->fromArray(array (
  'name' => 'OnDocStatusChange',
  'service' => 1,
  'groupname' => 'Workflow',
), '', true, true);
return $events;

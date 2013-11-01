<?php
/**
 * menus transport file for Workflow extra
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
/* @var xPDOObject[] $menus */

$action = $modx->newObject('modAction');
$action->fromArray( array (
  'namespace' => 'workflow',
  'controller' => 'index',
  'haslayout' => 1,
  'lang_topics' => 'workflow:default',
  'assets' => '',
  'help_url' => '',
  'id' => 1,
), '', true, true);

$menus[1] = $modx->newObject('modMenu');
$menus[1]->fromArray( array (
  'text' => 'Workflow',
  'parent' => 'components',
  'description' => 'ex_menu_desc',
  'icon' => '',
  'menuindex' => 0,
  'params' => '',
  'handler' => '',
  'permissions' => '',
  'id' => 1,
), '', true, true);
$menus[1]->addOne($action);

return $menus;

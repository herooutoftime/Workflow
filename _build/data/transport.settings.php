<?php
/**
 * systemSettings transport file for Workflow extra
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
/* @var xPDOObject[] $systemSettings */


$systemSettings = array();

$systemSettings[1] = $modx->newObject('modSystemSetting');
$systemSettings[1]->fromArray(array (
  'key' => 'workflow.admin_group',
  'value' => '1',
  'xtype' => 'modx-combo-usergroup',
  'namespace' => 'workflow',
  'area' => 'manager',
  'name' => 'Admin Group',
  'description' => 'Which group is allowed to send emails to their authors/editors?',
), '', true, true);
$systemSettings[2] = $modx->newObject('modSystemSetting');
$systemSettings[2]->fromArray(array (
  'key' => 'workflow.admin_email',
  'value' => 'andreas.bilz@gmail.com',
  'xtype' => 'textfield',
  'namespace' => 'workflow',
  'area' => 'manager',
  'name' => 'Workflow Admin Email',
  'description' => 'The recipient of Workflow related administrative mails',
), '', true, true);
$systemSettings[3] = $modx->newObject('modSystemSetting');
$systemSettings[3]->fromArray(array (
  'key' => 'workflow.enabled',
  'value' => true,
  'xtype' => 'combo-boolean',
  'namespace' => 'workflow',
  'area' => 'manager',
  'name' => 'Workflow Enabled',
  'description' => 'Is Workflow enabled?',
), '', true, true);
return $systemSettings;
